import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask,
  toggleTaskCompletion,
  deleteTask,
} from "../store/task-slice";
import { calculateTaskProgress } from "../store/task-slice";
function DailyTask() {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [yesterdaysTasks, setYesterdaysTasks] = useState([]);
  // const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const { dailyTask } = useSelector((state) => state.task);

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

  const handleAddTask = async () => {
    if (taskName.trim() === "" || !startTime || !endTime || !priority) {
      console.error("Missing required fields");
      return;
    }

    if (
      dailyTask.some(
        (task) => task.taskName.toLowerCase() === taskName.trim().toLowerCase()
      )
    ) {
      alert("This task already exists!");
      resetForm();
      return;
    }

    const newTask = {
      taskName,
      priority: priority.toLowerCase(),
      startTime,
      endTime,
      date: formattedDate,
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

  const handleFileChange = (taskId, file) => {
    // if (file) {
    //   const fileURL = URL.createObjectURL(file);
    //   setTasks((prevTasks) =>
    //     prevTasks.map((task) =>
    //       task.id === taskId ? { ...task, proofOfWork: fileURL } : task
    //     )
    //   );
    // }
  };
  const getProgressColor = (progress, isCompleted) => {
    if (isCompleted && progress === 100) {
      return "#4CAF50";
    }
    if (progress === 100 && !isCompleted) {
      return "#FF0000";
    }
    const colors = ["#6DA951", "#4CAF50", "#FFA33C", "#FC7033", "#FA4032"];
    return colors[Math.floor(progress / 20)] || "#FA4032";
  };

  const toggleCompletionHandler = (taskId) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(calculateTaskProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const checkIfTaskExceededTime = (task) => {
    const taskEndTime = new Date(`${formattedDate} ${task.endTime}`);
    const currentTime = new Date();

    return taskEndTime < currentTime && !task.isCompleted;
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
    const startTime = new Date(`${formattedDate} ${task.startTime}`);
    return currentTime >= startTime;
  };
  const Dashboard = ({ tasks }) => {
    if (!tasks) return <p>Loading...</p>;
    return (
      <div className="p-5 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div>
          <p>Total Tasks: {tasks.length}</p>
          <p>
            Completed Tasks: {tasks.filter((task) => task.isCompleted).length}
          </p>
          <p>
            Pending Tasks: {tasks.filter((task) => !task.isCompleted).length}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row lg:space-x-4 mb-6">
        <div
          className="w-full lg:w-2/3 rounded-lg shadow-lg p-5 mb-4 lg:mb-0"
          style={{ backgroundColor: "#F0C1E1" }}
        >
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-semibold text-left mb-6"
              style={{ color: "#2e2e2e" }}
            >
              ✨ Daily Checklist
            </h1>
            <div className="flex items-center">
              <h1
                className="text-2xl font-semibold text-right pr-3 mb-6"
                style={{ color: "#2e2e2e" }}
              >
                Date:
              </h1>
              <h1 className="text-xl mb-5" style={{ color: "#2e2e2e" }}>
                {formattedDate}
              </h1>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName || ""}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300"
              placeholder="Task Name"
            />
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Priority</label>
                <select
                  value={priority || ""}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">None</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleAddTask}
              className="w-full py-3 rounded-md bg-[#674188] text-white"
            >
              Add Task
            </button>
          </div>
        </div>

        <div
          className="w-full lg:w-1/3 rounded-lg shadow-lg p-5"
          style={{ backgroundColor: "#F0C1E1" }}
        >
          <h2
            className="text-2xl font-semibold text-left mb-6"
            style={{ color: "#2e2e2e" }}
          >
            Yesterday's Tasks
          </h2>
          <ul className="space-y-4">
            {yesterdaysTasks.length > 0 ? (
              yesterdaysTasks.map((task) => (
                <li key={task.id} className="p-3 rounded-md bg-green-100">
                  <strong>{task.taskName}</strong>
                  <div className="text-xs">
                    Completed at: {formattedYesterday}
                  </div>
                </li>
              ))
            ) : (
              <li>No completed tasks from yesterday</li>
            )}
          </ul>
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto mb-6 p-6 rounded-lg"
        style={{ backgroundColor: "#F0C1E1" }}
      >
        <h2
          className="text-2xl font-semibold text-left mb-6"
          style={{ color: "#2e2e2e" }}
        >
          Today's Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#674188] text-white">
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
            <tbody className="bg-[#F0C1E1]">
              {dailyTask &&
                dailyTask.map((task, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      task.isCompleted ? "bg-green-100" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2 text-center text-black">
                      {task.taskName}
                    </td>
                    <td className="px-4 py-2 text-center text-black">
                      {task.priority}
                    </td>
                    <td className="px-4 py-2 text-center text-black">
                      {task.startTime}
                    </td>
                    <td className="px-4 py-2 text-center text-black">
                      {task.endTime}
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative w-[120%] h-6 rounded-full bg-gray-300 text-center">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor: getProgressColor(
                              task.progress,
                              task.isCompleted
                            ),
                          }}
                        ></div>
                        <span className="absolute right-2 top-1 text-xs font-semibold text-white">
                          {task.progress === 100
                            ? task.isCompleted
                              ? "Completed"
                              : "Incomplete"
                            : `${task.progress}%`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleCompletionHandler(task._id)}
                        disabled={
                          task.isCompleted ||
                          !isTaskStarted(task) ||
                          new Date() >
                            new Date(`${formattedDate} ${task.endTime}`)
                        }
                        style={{
                          transform: "scale(1.5)",
                        }}
                      />
                    </td>

                    <td className="px-4 py-2 text-center">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(task.id, e.target.files[0])
                        }
                        className="text-sm"
                      />
                      {task.proofOfWork && (
                        <a
                          href={task.proofOfWork}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Proof
                        </a>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className={`py-1 px-2 rounded-md bg-red-500 text-white ${
                          checkIfTaskExceededTime(task)
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                        disabled={checkIfTaskExceededTime(task)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="max-w-4xl mx-auto mb-6"
        style={{ backgroundColor: "#F0C1E1" }}
      >
        <Dashboard tasks={dailyTask} />
      </div>
    </div>
  );
}

export default DailyTask;
