import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaTasks,
  FaCogs,
  FaHistory,
  FaListOl,
  FaTrophy,
} from "react-icons/fa";
import { Info } from "lucide-react";
import Confetti from "react-confetti";

// Helper to generate unique IDs
const generateId = () =>
  Date.now() + Math.random().toString(36).substring(2, 9);

// Help Modal Component
function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 font-[Inter] mb-4">
          The 3-3-3 Method
        </h2>
        <div className="space-y-4 text-gray-700 font-[Inter]">
          <div>
            <h3 className="text-lg font-semibold">What is the 3-3-3 Method?</h3>
            <p className="text-sm">
              The 3-3-3 Method is a productivity technique that structures your
              workday into three focused segments:
              <strong>3 hours of deep work</strong>,{" "}
              <strong>3 short tasks</strong>, and{" "}
              <strong>3 maintenance tasks</strong>. It’s designed to maximize
              focus, efficiency, and balance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">How to Use It</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Deep Work (3 hours):</strong> Dedicate 3 uninterrupted
                hours to a high-priority, cognitively demanding task.
              </li>
              <li>
                <strong>Short Tasks (3):</strong> Complete 3 quick, actionable
                tasks that take less time but need attention.
              </li>
              <li>
                <strong>Maintenance (3):</strong> Tackle 3 routine or
                administrative tasks to keep your life and work organized.
              </li>
              <li>
                Use the timer to track your 3-hour deep work session and manage
                tasks efficiently.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Benefits</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Increased Focus:</strong> Long, uninterrupted deep work
                boosts productivity.
              </li>
              <li>
                <strong>Task Completion:</strong> Structured short and
                maintenance tasks prevent procrastination.
              </li>
              <li>
                <strong>Work-Life Balance:</strong> Balances intense focus with
                lighter tasks.
              </li>
              <li>
                <strong>Motivation:</strong> Gamification (points, levels,
                badges) keeps you engaged.
              </li>
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 font-[Inter] font-semibold transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DeepWorkTimer() {
  const [activeTab, setActiveTab] = useState("timer");
  const [showHelp, setShowHelp] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Task states
  const [selectedCategory, setSelectedCategory] = useState("deep");
  const [deepWorkTasks, setDeepWorkTasks] = useState([]);
  const [shortTasks, setShortTasks] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [taskTimers, setTaskTimers] = useState({});
  const [editingTask, setEditingTask] = useState(null);

  // Gamification states
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const pointsToNextLevel = level * 100;

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      clearInterval(interval);
      setIsTimerActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Task timer logic
  useEffect(() => {
    let interval = null;
    if (activeTask && isTimerActive) {
      interval = setInterval(() => {
        setTaskTimers((prev) => ({
          ...prev,
          [activeTask.id]: (prev[activeTask.id] || 0) + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTask, isTimerActive]);

  // Time formatting
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTaskTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const getProgress = () => ((3 * 60 * 60 - timeLeft) / (3 * 60 * 60)) * 100;

  // Task management
  const addTask = (category, text) => {
    const newTask = { id: generateId(), text, completed: false };
    if (category === "deep") setDeepWorkTasks((prev) => [...prev, newTask]);
    else if (category === "short") setShortTasks((prev) => [...prev, newTask]);
    else if (category === "maintenance")
      setMaintenanceTasks((prev) => [...prev, newTask]);
    setPoints((prev) => prev + 5);
  };

  const toggleTaskTimer = (category, taskId) => {
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null);
    } else {
      setActiveTask({ category, id: taskId });
      if (!isTimerActive) setIsTimerActive(true);
    }
  };

  const deleteTask = (category, taskId) => {
    if (category === "deep")
      setDeepWorkTasks((prev) => prev.filter((t) => t.id !== taskId));
    else if (category === "short")
      setShortTasks((prev) => prev.filter((t) => t.id !== taskId));
    else if (category === "maintenance")
      setMaintenanceTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTask?.id === taskId) setActiveTask(null);
    if (editingTask?.id === taskId) setEditingTask(null);
    setTaskTimers((prev) => ({ ...prev, [taskId]: undefined }));
  };

  const startEditingTask = (category, task) =>
    setEditingTask({ category, id: task.id, text: task.text });
  const saveEditedTask = (category, taskId) => {
    const updatedText = editingTask.text.trim();
    if (updatedText) {
      if (category === "deep") {
        setDeepWorkTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, text: updatedText } : t))
        );
      } else if (category === "short") {
        setShortTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, text: updatedText } : t))
        );
      } else if (category === "maintenance") {
        setMaintenanceTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, text: updatedText } : t))
        );
      }
    }
    setEditingTask(null);
  };

  // Gamification logic
  const handleSessionComplete = () => {
    const newRecord = {
      date: new Date().toLocaleString(),
      deepCount: deepWorkTasks.length,
      shortCount: shortTasks.length,
      maintenanceCount: maintenanceTasks.length,
      taskTimes: { ...taskTimers },
    };
    setHistory((prev) => [newRecord, ...prev]);
    const sessionPoints =
      deepWorkTasks.length * 20 +
      shortTasks.length * 10 +
      maintenanceTasks.length * 5 +
      50; // Bonus for completion
    setPoints((prev) => {
      const newPoints = prev + sessionPoints;
      const newLevel = Math.floor(newPoints / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      return newPoints;
    });
    if (deepWorkTasks.length >= 3)
      setBadges((prev) => [...prev, "Deep Work Master"]);
    if (shortTasks.length >= 3) setBadges((prev) => [...prev, "Task Sprinter"]);
    if (maintenanceTasks.length >= 3)
      setBadges((prev) => [...prev, "Maintenance Pro"]);
    resetSession();
  };

  const resetSession = () => {
    setTimeLeft(3 * 60 * 60);
    setIsTimerActive(false);
    setDeepWorkTasks([]);
    setShortTasks([]);
    setMaintenanceTasks([]);
    setActiveTask(null);
    setTaskTimers({});
    setEditingTask(null);
  };

  const allTasks = [
    ...deepWorkTasks.map((t) => ({ ...t, category: "Deep Work" })),
    ...shortTasks.map((t) => ({ ...t, category: "Short Task" })),
    ...maintenanceTasks.map((t) => ({ ...t, category: "Maintenance" })),
  ];
  const rankedTasks = [...allTasks].sort(
    (a, b) => (taskTimers[b.id] || 0) - (taskTimers[a.id] || 0)
  );

  // Form handler
  const handleAddTaskForm = (e) => {
    e.preventDefault();
    const inputName =
      selectedCategory === "deep"
        ? "deepWork"
        : selectedCategory === "short"
        ? "shortTask"
        : "maintenanceTask";
    const text = e.target.elements[inputName].value.trim();
    if (text) {
      addTask(selectedCategory, text);
      e.target.reset();
    }
  };

  const placeholderText =
    selectedCategory === "deep"
      ? "Add a deep work task..."
      : selectedCategory === "short"
      ? "Add a short task..."
      : "Add a maintenance task...";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showConfetti && <Confetti />}
      {/* Header */}
      <div className="flex justify-between items-center mb-8 p-10">
        <h1 className="text-4xl font-bold text-purple-800">3-3-3 Method</h1>
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Learn about the Pomodoro Technique"
        >
          <Info size={24} className="text-purple-800" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 gap-x-8 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-96 bg-white shadow-lg p-8 flex-shrink-0 overflow-y-auto border-r border-gray-200">
          <nav className="space-y-5">
            {[
              {
                tab: "timer",
                icon: <FaClock className="text-2xl" />,
                label: "Timer",
              },
              {
                tab: "history",
                icon: <FaHistory className="text-2xl" />,
                label: "History",
              },
              {
                tab: "ranking",
                icon: <FaListOl className="text-2xl" />,
                label: "Ranking",
              },
            ].map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center space-x-4 p-5 rounded-xl transition-all duration-300 text-xl font-[Inter] font-medium ${
                  activeTab === tab
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-500"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>
          {/* Gamification Stats */}
          <div className="mt-10 space-y-6">
            <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold font-[Inter]">
                Level {level}
              </h3>
              <p className="text-sm mt-2">Points: {points.toLocaleString()}</p>
              <div className="mt-4">
                <div className="w-full bg-purple-400 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((points % 100) / 100) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-purple-100">
                  {points % 100}/{100} to Level {level + 1}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 font-[Inter] mb-4">
                Badges
              </h4>
              <div className="flex flex-wrap gap-3">
                {badges.length ? (
                  badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="bg-yellow-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md"
                    >
                      {badge}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Complete tasks to earn badges!
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "timer" && (
            <div className="space-y-10 max-w-5xl mx-auto">
              {/* Timer */}
              <section className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-900 font-[Inter] mb-8">
                  Deep Work Timer
                </h2>
                <div className="relative w-80 h-80">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r="48"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-purple-500 transition-all duration-500 ease-out"
                      strokeWidth="4"
                      strokeDasharray={`${getProgress() * 3.01}, 301`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      stroke="url(#gradient)"
                      fill="transparent"
                      r="48"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#8B5CF6", stopOpacity: 1 }}
                        />{" "}
                        {/* Purple-500 */}
                        <stop
                          offset="100%"
                          style={{ stopColor: "#A78BFA", stopOpacity: 1 }}
                        />{" "}
                        {/* Purple-400 */}
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl  text-gray-900  tracking-widest">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-8 mt-10">
                  <button
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className={`px-10 py-4 rounded-xl text-white font-[Inter] text-xl font-semibold transition-all duration-300 shadow-lg ${
                      isTimerActive
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-purple-500 hover:bg-purple-600"
                    }`}
                  >
                    {isTimerActive ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={() => {
                      setTimeLeft(3 * 60 * 60);
                      setIsTimerActive(false);
                      setActiveTask(null);
                    }}
                    className="px-10 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 font-[Inter] text-xl font-semibold transition-all duration-300 shadow-lg"
                  >
                    Reset
                  </button>
                </div>
              </section>

              {/* Tasks */}
              <section className="bg-white rounded-2xl shadow-lg p-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 font-[Inter] mb-6 md:mb-0">
                    Tasks
                  </h3>
                  <form
                    onSubmit={handleAddTaskForm}
                    className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto"
                  >
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-5 py-3 font-[Inter] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm text-lg"
                    >
                      <option value="deep">Deep Work</option>
                      <option value="short">Short Tasks</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <input
                      type="text"
                      name={
                        selectedCategory === "deep"
                          ? "deepWork"
                          : selectedCategory === "short"
                          ? "shortTask"
                          : "maintenanceTask"
                      }
                      placeholder={placeholderText}
                      className="border border-gray-300 rounded-lg px-5 py-3 font-[Inter] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow bg-white shadow-sm text-lg"
                    />
                    <button
                      type="submit"
                      className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 font-[Inter] font-semibold transition-all duration-300 shadow-md text-lg"
                    >
                      Add Task
                    </button>
                  </form>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Deep Work",
                      icon: <FaClock className="text-purple-500 text-2xl" />,
                      tasks: deepWorkTasks,
                      category: "deep",
                    },
                    {
                      title: "Short Tasks",
                      icon: <FaTasks className="text-purple-500 text-2xl" />,
                      tasks: shortTasks,
                      category: "short",
                    },
                    {
                      title: "Maintenance",
                      icon: <FaCogs className="text-purple-500 text-2xl" />,
                      tasks: maintenanceTasks,
                      category: "maintenance",
                    },
                  ].map(({ title, icon, tasks, category }) => (
                    <div
                      key={title}
                      className="bg-gray-100 rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        {icon}
                        <h4 className="text-2xl font-semibold text-gray-900 font-[Inter]">
                          {title}
                        </h4>
                      </div>
                      {tasks.length === 0 ? (
                        <p className="text-gray-500 font-[Inter] text-base">
                          No tasks added yet.
                        </p>
                      ) : (
                        tasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-white p-5 rounded-lg mb-5 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            {editingTask?.id === task.id ? (
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  value={editingTask.text}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      text: e.target.value,
                                    })
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-4 py-3 font-[Inter] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                                />
                                <div className="flex space-x-4">
                                  <button
                                    onClick={() =>
                                      saveEditedTask(category, task.id)
                                    }
                                    className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 font-[Inter] transition-all duration-300"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingTask(null)}
                                    className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 font-[Inter] transition-all duration-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-800 font-[Inter] text-lg break-words max-w-[65%]">
                                    {task.text}
                                  </span>
                                  <div className="flex items-center space-x-4">
                                    {activeTask?.id === task.id &&
                                      isTimerActive && (
                                        <span className="text-gray-600 font-mono text-base">
                                          {formatTaskTime(
                                            taskTimers[task.id] || 0
                                          )}
                                        </span>
                                      )}
                                    <button
                                      onClick={() =>
                                        toggleTaskTimer(category, task.id)
                                      }
                                      className={`px-5 py-2 rounded-lg text-white font-[Inter] text-base font-semibold transition-all duration-300 shadow-sm ${
                                        activeTask?.id === task.id &&
                                        isTimerActive
                                          ? "bg-yellow-500 hover:bg-yellow-600"
                                          : "bg-purple-500 hover:bg-purple-600"
                                      }`}
                                    >
                                      {activeTask?.id === task.id &&
                                      isTimerActive
                                        ? "Pause"
                                        : "Start"}
                                    </button>
                                    <button
                                      onClick={() =>
                                        startEditingTask(category, task)
                                      }
                                      className="text-gray-600 hover:text-purple-500 text-xl transition-colors duration-200"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteTask(category, task.id)
                                      }
                                      className="text-red-500 hover:text-red-600 text-xl transition-colors duration-200"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "history" && (
            <section className="bg-white rounded-2xl shadow-lg p-10 max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 font-[Inter] mb-8">
                Session History
              </h2>
              {history.length === 0 ? (
                <p className="text-gray-500 font-[Inter] text-center text-lg">
                  No sessions recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-5 font-[Inter] text-gray-700 font-semibold text-lg">
                          Date
                        </th>
                        <th className="p-5 font-[Inter] text-gray-700 font-semibold text-lg text-center">
                          Deep
                        </th>
                        <th className="p-5 font-[Inter] text-gray-700 font-semibold text-lg text-center">
                          Short
                        </th>
                        <th className="p-5 font-[Inter] text-gray-700 font-semibold text-lg text-center">
                          Maintenance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((session, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="p-5 font-[Inter] text-gray-600 text-base">
                            {session.date}
                          </td>
                          <td className="p-5 text-center font-[Inter] text-gray-600 text-base">
                            {session.deepCount}
                          </td>
                          <td className="p-5 text-center font-[Inter] text-gray-600 text-base">
                            {session.shortCount}
                          </td>
                          <td className="p-5 text-center font-[Inter] text-gray-600 text-base">
                            {session.maintenanceCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === "ranking" && (
            <section className="bg-white rounded-2xl shadow-lg p-10 max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 font-[Inter] mb-8">
                Task Ranking
              </h2>
              {rankedTasks.length === 0 ? (
                <p className="text-gray-500 font-[Inter] text-center text-lg">
                  No tasks added yet.
                </p>
              ) : (
                <ul className="space-y-5">
                  {rankedTasks.map((task, idx) => (
                    <li
                      key={task.id}
                      className="bg-gray-100 p-5 rounded-lg flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <FaTrophy
                          className={`text-2xl ${
                            idx === 0
                              ? "text-yellow-500"
                              : idx === 1
                              ? "text-gray-400"
                              : idx === 2
                              ? "text-amber-600"
                              : "text-gray-300"
                          }`}
                        />
                        <div>
                          <span className="font-[Inter] text-gray-800 font-semibold text-lg">
                            {task.text}
                          </span>
                          <span className="text-sm text-gray-500 block">
                            ({task.category})
                          </span>
                        </div>
                      </div>
                      <span className=" text-gray-600 font-mono text-base">
                        {formatTaskTime(taskTimers[task.id] || 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </main>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default DeepWorkTimer;
