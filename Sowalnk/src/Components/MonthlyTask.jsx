import React, { useState, useEffect } from "react";

function MonthlyTask() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateForInput = (date) => date.toISOString().split("T")[0];
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const validateDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setErrorMessage("Start date cannot be in the past.");
      return false;
    }

    if (endDate < startDate) {
      setErrorMessage("End date must be after the start date.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate) {
      validateDates(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (startDate) {
      validateDates(startDate, newEndDate);
    }
  };

  const calculateProgress = (start, end) => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    if (currentDate < startDate) return 0;
    if (currentDate >= endDate) return 100;

    const totalDuration = endDate - startDate;
    const timePassed = currentDate - startDate;
    return Math.round((timePassed / totalDuration) * 100);
  };

  const handleAddTask = () => {
    if (!taskName.trim() || !startDate || !endDate || !priority) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!validateDates(startDate, endDate)) {
      return;
    }

    const newTask = {
      id: Date.now(),
      taskName,
      priority,
      startDate,
      endDate,
      progress: 0,
      isCompleted,
      proofOfWork: "",
    };

    setTasks([...tasks, newTask]);
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("");
    setStartDate("");
    setEndDate("");
    setIsCompleted(false);
    setErrorMessage("");
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const toggleCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
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

  const getProgressColor = (progress) => {
    if (progress < 30) return "#6DA951";
    if (progress < 60) return "#4CAF50";
    if (progress < 80) return "#FFA33C";
    if (progress < 100) return "#FC7033";
    return "#FA4032";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          progress: calculateProgress(task.startDate, task.endDate),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row lg:space-x-4 mb-6">
        <div className="w-full lg:w-2/3 rounded-lg shadow-lg p-5 mb-4 lg:mb-0 bg-[#F0C1E1]">
          <h1 className="text-2xl font-semibold mb-6 text-[#2e2e2e]">
            Monthly Checklist
          </h1>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300"
              placeholder="Task Name"
            />
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={formatDateForInput(today)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || formatDateForInput(today)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            <button
              onClick={handleAddTask}
              className="w-full py-3 rounded-md bg-[#674188] text-white hover:bg-[#563177] transition-colors"
              disabled={!!errorMessage || !startDate || !endDate}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="max-w-4xl mx-auto mb-6 p-6 rounded-lg bg-[#F0C1E1]">
        <h2 className="text-2xl font-semibold text-left mb-6 text-[#2e2e2e]">
          Month Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#674188] text-white">
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Proof of Work</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const progress = calculateProgress(task.startDate, task.endDate);
                return (
                  <tr
                    key={task.id}
                    className={task.isCompleted ? "bg-[#E6F9E6]" : "bg-white"}
                  >
                    <td className="px-4 py-2 text-center text-black">{task.taskName}</td>
                    <td className="px-4 py-2 text-center text-black">{task.priority}</td>
                    <td className="px-4 py-2 text-center text-black">{formatDate(task.startDate)}</td>
                    <td className="px-4 py-2 text-center text-black">{formatDate(task.endDate)}</td>
                    <td className="px-4 py-2">
                      <div className="relative h-5 bg-gray-200 rounded-full">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: getProgressColor(progress)
                          }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
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
                      onChange={(e) => handleFileChange(task.id, e.target.files[0])}
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
                        onClick={() => handleDelete(task.id)}
                        className="bg-[#FC7033] hover:bg-[#F37220] text-white px-4 py-2 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MonthlyTask;