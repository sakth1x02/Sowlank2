import React, { useState, useMemo, useEffect } from "react";
import WeeksInMonth from "./WeeksInMonth";
import { useSelector } from "react-redux";
function WeeklyTask() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { dailyTask } = useSelector((state) => state.task);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay());
  firstDayOfWeek.setHours(0, 0, 0, 0);

  // Calculate week number
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1); // First day of the year
    const daysSinceStart = Math.floor(
      (date - startOfYear) / (1000 * 60 * 60 * 24)
    );
    return Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7); // Calculate week number
  };
  const currentWeekNumber = getWeekNumber(today);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  const formattedStartOfWeek = firstDayOfWeek.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  // console.log(firstDayOfWeek, lastDayOfWeek);

  const formattedEndOfWeek = lastDayOfWeek.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const calculateProgress = (task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const now = new Date();

    if (now <= start) return 0;
    if (now >= end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  const handleAddTask = () => {
    if (!taskName || !priority || !startDate || !endDate) {
      alert("Please fill out all fields.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today) {
      alert("Start date cannot be before today.");
      return;
    }

    if (start > end) {
      alert("Start date cannot be later than the end date.");
      return;
    }

    const newTask = {
      id: Date.now(),
      taskName,
      priority,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      isCompleted: false,
      progress: calculateProgress({ startDate, endDate }),
      proofOfWork: null,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("");
    setStartDate("");
    setEndDate("");
  };

  const toggleCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              progress: !task.isCompleted ? 100 : calculateProgress(task),
            }
          : task
      )
    );
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleFileChange = (taskId, file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, proofOfWork: fileURL } : task
        )
      );
    }
  };

  const weeklyTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const taskStartDate = new Date(task.startDate);
        const taskEndDate = new Date(task.endDate);
        return taskStartDate <= lastDayOfWeek && taskEndDate >= firstDayOfWeek;
      }),
    [tasks, firstDayOfWeek, lastDayOfWeek]
  );

  const getProgressBarColor = (progress) => {
    if (progress <= 25) return "#6DA951";
    if (progress <= 50) return "#4CAF50";
    if (progress <= 75) return "#FFA33C";
    if (progress < 100) return "#FC7033";
    return "#FA4032";
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          progress: calculateProgress(task),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const Dashboard = () => {
    const totalTask = Math.floor(dailyTask.length / 7);
    const completedTask = Math.floor(
      dailyTask.filter((task) => task.isCompleted).length / 7
    );
    const pendingTask = Math.floor(
      dailyTask.filter((task) => !task.isCompleted).length / 7
    );
    return (
      <div className="p-5 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div className="space-y-5">
          <WeeksInMonth
            year={today.getFullYear()}
            month={today.getMonth()}
            weekIndx={currentWeekNumber}
            completedTask={completedTask}
          />

          <div className="p-2 mt-5">
            <p>Total Tasks: {totalTask}</p>
            <p>Completed Tasks: {completedTask}</p>
            <p>Pending Tasks: {pendingTask}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto flex space-x-4 mb-6">
        <div className="w-2/3 rounded-lg shadow-lg p-5 bg-[#F0C1E1]">
          <h1 className="text-2xl font-semibold text-center mb-4 text-[#2e2e2e]">
            Weekly Checklist
          </h1>
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-xl font-semibold text-[#2e2e2e]">
              Week {currentWeekNumber} : {formattedStartOfWeek} -{" "}
              {formattedEndOfWeek}
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300"
              placeholder="Task Name"
            />
            <div className="flex space-x-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-1/3 p-3 border rounded-md"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/3 p-3 border rounded-md"
                min={today.toISOString().split("T")[0]}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/3 p-3 border rounded-md"
              />
            </div>
            <button
              onClick={handleAddTask}
              className="w-full py-3 rounded-md bg-[#674188] text-white hover:bg-[#563177] transition-colors"
              disabled={!taskName || !priority || !startDate || !endDate}
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="w-1/3 rounded-lg shadow-lg p-5 bg-[#F0C1E1]">
          <h2 className="text-xl font-semibold mb-4 text-[#3d3d3d]">
            Tasks This Week
          </h2>
          <ul className="space-y-4">
            {weeklyTasks.map((task) => (
              <li key={task.id} className="p-3 rounded-lg bg-white">
                <span>{task.taskName}</span>
                <button
                  onClick={() => toggleCompletion(task.id)}
                  className={`${
                    task.isCompleted ? "bg-green-500" : "bg-gray-400"
                  } text-white py-1 px-4 rounded`}
                >
                  {task.isCompleted ? "Completed" : "Incomplete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="my-6 max-w-4xl mx-auto rounded-lg shadow-lg p-6 bg-[#F0C1E1]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-[#674188] text-white">
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Proof of Work</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="px-4 py-2 text-center">{task.taskName}</td>
                  <td className="px-4 py-2 text-center">{task.priority}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(task.startDate).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(task.endDate).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative w-full h-6 rounded-full bg-gray-300">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${task.progress}%`,
                          backgroundColor: getProgressBarColor(task.progress),
                        }}
                      ></div>
                      <span className="absolute inset-x-2 text-xs text-white">
                        {task.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => toggleCompletion(task.id)}
                      className="h-4 w-4"
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
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="bg-[#FC7033] text-white py-1 px-3 rounded-md"
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
        <Dashboard />
      </div>
    </div>
  );
}

export default WeeklyTask;
