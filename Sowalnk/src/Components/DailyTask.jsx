import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask,
  toggleTaskCompletion,
  deleteTask,
  toggleHasExceededTime,
} from "../store/task-slice";

import {
  calculateTaskProgress,
  setDailyTaskProofWork,
} from "../store/task-slice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { increaseNormalCoins } from "../store/user-slice";

function DailyTask() {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [yesterdaysTasks, setYesterdaysTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  // const [error, setError] = useState("");
  const dispatch = useDispatch();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const navigate = useNavigate();

  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((state) => state.weekly);
  const { loggedInUser } = useSelector((state) => state.user);
  const { intermediateMember } = useSelector((store) => store.ui);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedYesterday = yesterday.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleAddTask = async () => {
    if (taskName.trim() === "" || !startTime || !endTime || !priority) {
      toast.error("Missing required fields");
      console.error("Missing required fields");
      return;
    }

    const currentTime = getCurrentTime();
    // Check if start time is before current time
    if (startTime < currentTime) {
      toast.error("Start time cannot be before current time");
      return;
    }

    if (startTime === endTime) {
      toast.error("Start and end time cannot be the same");
      return;
    }

    // Calculate time difference in minutes
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Check if end time is before start time
    if (endTotalMinutes < startTotalMinutes) {
      toast.error("End time cannot be before start time");
      return;
    }

    // Check for minimum 5-minute difference
    if (endTotalMinutes - startTotalMinutes < 5) {
      toast.error(
        "Minimum 5 minutes difference required between start and end time"
      );
      return;
    }

    if (taskName.length < 3) {
      toast.error("Task name must be at least 3 characters long");
      return;
    }
    if (
      dailyTask.some(
        (task) => task.taskName.toLowerCase() === taskName.trim().toLowerCase()
      ) ||
      weeklyTask.some(
        (task) => task.taskName.toLowerCase() === taskName.trim().toLowerCase()
      )
    ) {
      toast.error("This task already exists!");
      resetForm();
      return;
    }

    const newTask = {
      taskName,
      priority: priority.toLowerCase(),
      startTime,
      endTime,
      date: today,
      progress: 0,
      isCompleted: false,
      proofOfWork: "",
      hasExceededTime: false,
    };
    dispatch(addTask(newTask));
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("");
    setStartTime("");
    setEndTime("");
  };

  const handleFileChange = async (taskId, file) => {
    const token = await localStorage.getItem("token");
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`/api/v1/task/daily/${taskId}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setDailyTaskProofWork({ taskId, fileURL: data.proofOfWork }));
      } else {
        console.error("Failed to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };
  const getProgressColor = (progress, isCompleted, hasExceededTime) => {
    // Handle completed tasks
    if (isCompleted) {
      return "#4CAF50"; // Green
    }

    // Handle exceeded time
    if (hasExceededTime) {
      return "#FF0000"; // Red
    }

    // Handle in-progress tasks
    const validProgress = Math.min(Math.max(0, Number(progress) || 0), 100);
    if (validProgress < 25) return "#FA4032";
    if (validProgress < 50) return "#FC7033";
    if (validProgress < 75) return "#FFA33C";
    return "#6DA951";
  };

  const toggleCompletionHandler = async (task) => {
    // Early return if proofOfWork is empty
    if (task.proofOfWork === "") {
      return;
    }

    try {
      // Toggle task completion
      await dispatch(toggleTaskCompletion(task._id)).unwrap();
      toast.success(`Task "${task.taskName}" completed successfully! 🎉`);

      // Increase coins
      await dispatch(
        increaseNormalCoins({
          userId: loggedInUser._id,
          taskId: task._id,
        })
      ).unwrap();
      toast.success("Coins increased successfully! 🪙");
    } catch (error) {
      // Specific error messages
      if (error.message.includes("toggleTaskCompletion")) {
        toast.error("Failed to complete task");
      } else if (error.message.includes("increaseNormalCoins")) {
        toast.error("Failed to increase coins");
      } else {
        toast.error("An unexpected error occurred");
      }

      // Log the error for debugging
      console.error("Error in toggleCompletionHandler:", error);
    }
  };

  const handleDelete = async (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const checkIfTaskExceededTime = async (task) => {
    if (!task?.endTime || task?.isCompleted || task?.hasExceededTime)
      return false;

    const currentTime = new Date();
    const [hours, minutes] = task.endTime.split(":");
    const taskEndTime = new Date();
    taskEndTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    const hasExceeded = taskEndTime < currentTime;

    if (hasExceeded && !task.hasExceededTime) {
      try {
        await dispatch(toggleHasExceededTime(task._id)).unwrap();
        toast.error(
          `Time exceeded for task "${task.taskName}"! ⏰ No Worry You can still complete it`
        );
        // Force refresh task data after exceeding time
        dispatch(fetchTasks());
      } catch (error) {
        console.error("Failed to update exceeded time status:", error);
      }
    }

    return hasExceeded;
  };

  useEffect(() => {
    const completedTasks = dailyTask.filter(
      (task) => task.isCompleted && task.date === formattedYesterday
    );
    setYesterdaysTasks(completedTasks || []);
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const isTaskStarted = (task) => {
    const currentTime = new Date();
    const startTime = new Date(`${formattedDate} ${task?.startTime}`);
    return currentTime >= startTime;
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const Dashboard = ({ tasks }) => {
    return (
      <div className="p-5 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-400">
          Daily Task Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg border border-purple-500/20">
            <p className="text-gray-400">Total Tasks</p>
            <p className="text-2xl font-bold text-blue-400">{tasks.length}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg border border-purple-500/20">
            <p className="text-gray-400">Completed Tasks</p>
            <p className="text-2xl font-bold text-green-400">
              {tasks.filter((task) => task?.isCompleted).length}
            </p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg border border-purple-500/20">
            <p className="text-gray-400">Pending Tasks</p>
            <p className="text-2xl font-bold text-yellow-400">
              {
                tasks.filter(
                  (task) => !task?.isCompleted && !task?.hasExceededTime
                ).length
              }
            </p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg border border-purple-500/20">
            <p className="text-gray-400">Incompleted Tasks</p>
            <p className="text-2xl font-bold text-red-400">
              {tasks.filter((task) => task?.hasExceededTime).length}
            </p>
          </div>
        </div>
      </div>
    );
  };
  const filteredTasks =
    selectedDate === ""
      ? dailyTask
      : dailyTask.filter((task) => task.date.split("T")[0] === selectedDate);

  const todaysTasks = dailyTask.filter(
    (task) => task.date.split("T")[0] === today.toISOString().split("T")[0]
  );
  const taskLimitReached = intermediateMember
    ? todaysTasks.length >= 20
    : todaysTasks.length >= 10;

  useEffect(() => {
    const hasNavigated = sessionStorage.getItem("hasNavigatedToPricing");
    if (taskLimitReached && !hasNavigated) {
      toast.error("You have reached the maximum number of tasks for today");
      sessionStorage.setItem("hasNavigatedToPricing", "true");
      navigate("/pricing");
    }
    if (!taskLimitReached) {
      sessionStorage.removeItem("hasNavigatedToPricing");
    }
  }, [todaysTasks, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      dailyTask.forEach((task) => {
        if (!task.isCompleted && !task.hasExceededTime) {
          checkIfTaskExceededTime(task);
        }
      });
      dispatch(calculateTaskProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, [dailyTask, dispatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-md md:max-w-[90%] md:mx-auto lg:mx-auto flex flex-col lg:flex-row lg:space-x-4 mb-6">
        <div className="w-full rounded-lg shadow-lg p-5 mb-4 lg:mb-0 bg-gray-800 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-left mb-6 text-purple-400">
              ✨ Daily Checklist
            </h1>
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-right pr-3 mb-6 text-purple-400">
                Date:
              </h1>
              <h1 className="text-xl mb-5 text-blue-400">{formattedDate}</h1>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName || ""}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 border border-purple-500/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Task Name"
            />
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/3">
                <label className="block text-purple-400 mb-2">Priority</label>
                <select
                  value={priority || ""}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-purple-500/30 text-gray-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="">None</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-purple-400 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime || ""}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-purple-500/30 text-gray-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-purple-400 mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime || ""}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-purple-500/30 text-gray-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddTask}
              className={`w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 ${
                (
                  intermediateMember
                    ? todaysTasks.length >= 20
                    : todaysTasks.length >= 10
                )
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                intermediateMember
                  ? todaysTasks.length >= 20
                  : todaysTasks.length >= 10
              }
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md md:max-w-[90%] md:mx-auto lg:mx-auto mb-6 p-6 rounded-lg bg-gray-800 border border-purple-500/20">
        <div className="flex gap-6 justify-between items-start">
          <h2 className="text-2xl font-semibold text-left text-purple-400">
            Today's Tasks
          </h2>
          <div className="flex gap-4">
            <div className="mt-2 text-xl font-bold italic text-blue-400">
              {selectedDate === "" ? (
                <p className="text-sm not-italic mt-1 hidden md:block">
                  Select Date For Particular Task's Data
                </p>
              ) : (
                new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              )}
            </div>
            <input
              name="forfilter"
              type="date"
              className="rounded-lg mb-6 p-2 bg-gray-700 border border-purple-500/30 text-gray-100 focus:outline-none focus:border-purple-500"
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-scroll">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">End Time</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Proof of Work</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks?.map((task) => (
                <tr
                  key={task?._id}
                  className={`border-t border-purple-500/20 ${
                    task?.isCompleted ? "bg-green-900/30" : "bg-gray-700/50"
                  } hover:bg-gray-700/70 transition-colors duration-200`}
                >
                  <td className="px-4 overflow-auto py-2 text-center">
                    <div className="w-30 h-12 overflow-auto flex justify-center items-center">
                      {task?.taskName}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        task?.priority === "High"
                          ? "bg-red-500/20 text-red-400"
                          : task?.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {task?.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{task?.startTime}</td>
                  <td className="px-4 py-2 text-center">{task?.endTime}</td>
                  <td className="px-4 py-2">
                    <div className="relative w-[120%] h-6 rounded-full bg-gray-600 text-center">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${task?.progress}%`,
                          backgroundColor: getProgressColor(
                            task?.progress,
                            task?.isCompleted,
                            task?.hasExceededTime
                          ),
                        }}
                      ></div>
                      <span className="absolute right-2 top-1 text-xs font-semibold text-white">
                        {task?.progress === 100
                          ? task?.isCompleted
                            ? "Completed"
                            : "Incomplete"
                          : `${task?.progress}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={task.proofOfWork !== "" && task?.isCompleted}
                      onChange={() => toggleCompletionHandler(task)}
                      disabled={
                        task?.isCompleted ||
                        !isTaskStarted(task) ||
                        new Date() >
                          new Date(`${formattedDate} ${task?.endTime}`)
                      }
                      className={`${
                        task?.proofOfWork ? "" : "cursor-not-allowed"
                      } accent-purple-500`}
                      style={{
                        transform: "scale(1.5)",
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    {!task.proofOfWork && (
                      <input
                        name="proofwork"
                        type="file"
                        onChange={(e) =>
                          handleFileChange(task?._id, e.target.files[0])
                        }
                        disabled={task?.hasExceededTime}
                        className={`text-sm w-[90px] overflow-auto bg-gray-700 rounded-md p-1 ${
                          task?.hasExceededTime
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        required
                      />
                    )}
                    {task?.proofOfWork && (
                      <a
                        href={task?.proofOfWork || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm transition-colors duration-200"
                      >
                        View Proof
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(task?._id)}
                      className={`py-1 px-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-200 ${
                        task?.hasExceededTime || task?.isCompleted
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={task?.hasExceededTime || task?.isCompleted}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="w-full text-center my-7 text-gray-400">
              No Task Data is Present on this Date
            </div>
          )}
        </div>
      </div>
      <div className="max-w-md md:max-w-[90%] md:mx-auto lg:mx-auto mb-6 p-6 rounded-lg bg-gray-800 border border-purple-500/20">
        <Dashboard tasks={filteredTasks} />
      </div>
    </div>
  );
}

export default DailyTask;
