import React, { useState, useEffect } from 'react';
import HelpModal from './HelpModal';
import { FaClock, FaTasks, FaCogs, FaHistory, FaListOl } from 'react-icons/fa';

// Helper to generate unique IDs
const generateId = () => Date.now() + Math.random().toString(36).substring(2, 9);

function DeepWorkTimer() {
  const [activeTab, setActiveTab] = useState('timer');
  const [showHelp, setShowHelp] = useState(false);

  // Main timer (3 hours in seconds)
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Task categories
  const [selectedCategory, setSelectedCategory] = useState('deep');
  const [deepWorkTasks, setDeepWorkTasks] = useState([]);
  const [shortTasks, setShortTasks] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);

  // History
  const [history, setHistory] = useState([]);

  // Active task & timers
  const [activeTask, setActiveTask] = useState(null); // { category, id }
  const [taskTimers, setTaskTimers] = useState({}); // { [taskId]: seconds }

  // Editing task
  const [editingTask, setEditingTask] = useState(null); // { category, id, text }

  // Main timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      clearInterval(interval);
      setIsTimerActive(false);
      alert('3 hours of deep work completed!');
      recordSession();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Task-specific timer logic
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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      <div className="flex items-center justify-center space-x-1">
        <span>{hrs}h</span>
        <span>:</span>
        <span>{mins < 10 ? '0' : ''}{mins}m</span>
        <span>:</span>
        <span>{secs < 10 ? '0' : ''}{secs}s</span>
      </div>
    );
  };

  const formatTaskTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m : ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const getProgress = () => {
    const totalTime = 3 * 60 * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Add a new task
  const addTask = (category, text) => {
    const newTask = { id: generateId(), text };
    if (category === 'deep') setDeepWorkTasks((prev) => [...prev, newTask]);
    else if (category === 'short') setShortTasks((prev) => [...prev, newTask]);
    else if (category === 'maintenance') setMaintenanceTasks((prev) => [...prev, newTask]);
  };

  // Start/pause a task timer
  const toggleTaskTimer = (category, taskId) => {
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null);
    } else {
      setActiveTask({ category, id: taskId });
      if (!isTimerActive) setIsTimerActive(true);
    }
  };

  // Delete a task
  const deleteTask = (category, taskId) => {
    if (category === 'deep') setDeepWorkTasks((prev) => prev.filter((task) => task.id !== taskId));
    else if (category === 'short') setShortTasks((prev) => prev.filter((task) => task.id !== taskId));
    else if (category === 'maintenance') setMaintenanceTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (activeTask && activeTask.id === taskId) setActiveTask(null);
    if (editingTask && editingTask.id === taskId) setEditingTask(null);
    setTaskTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[taskId];
      return newTimers;
    });
  };

  // Edit a task
  const startEditingTask = (category, task) => setEditingTask({ category, id: task.id, text: task.text });
  const saveEditedTask = (category, taskId) => {
    const updatedText = editingTask.text.trim();
    if (updatedText) {
      if (category === 'deep') {
        setDeepWorkTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, text: updatedText } : task))
        );
      } else if (category === 'short') {
        setShortTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, text: updatedText } : task))
        );
      } else if (category === 'maintenance') {
        setMaintenanceTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, text: updatedText } : task))
        );
      }
    }
    setEditingTask(null);
  };

  // Record session
  const recordSession = () => {
    const newRecord = {
      date: new Date().toLocaleString(),
      deepCount: deepWorkTasks.length,
      shortCount: shortTasks.length,
      maintenanceCount: maintenanceTasks.length,
      taskTimes: { ...taskTimers },
    };
    setHistory((prev) => [newRecord, ...prev]);
    setTimeLeft(3 * 60 * 60);
    setIsTimerActive(false);
    setDeepWorkTasks([]);
    setShortTasks([]);
    setMaintenanceTasks([]);
    setActiveTask(null);
    setTaskTimers({});
    setEditingTask(null);
  };

  // Combine tasks for ranking (sorted by time spent)
  const allTasks = [
    ...deepWorkTasks.map((t) => ({ ...t, category: 'Deep Work' })),
    ...shortTasks.map((t) => ({ ...t, category: 'Short Task' })),
    ...maintenanceTasks.map((t) => ({ ...t, category: 'Maintenance' })),
  ];
  const rankedTasks = [...allTasks].sort((a, b) => (taskTimers[b.id] || 0) - (taskTimers[a.id] || 0));

  // Handle add task form submit
  const handleAddTaskForm = (e) => {
    e.preventDefault();
    const inputName =
      selectedCategory === 'deep'
        ? 'deepWork'
        : selectedCategory === 'short'
        ? 'shortTask'
        : 'maintenanceTask';
    const text = e.target.elements[inputName].value.trim();
    if (text) {
      addTask(selectedCategory, text);
      e.target.reset();
    }
  };

  const placeholderText =
    selectedCategory === 'deep'
      ? 'Add deep work task'
      : selectedCategory === 'short'
      ? 'Add short task'
      : 'Add maintenance task';

  let mainContent;
  if (activeTab === 'timer') {
    mainContent = (
      <div className="space-y-6">
        {/* Timer Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 font-[Inter]">
            3-3-3 Method Timer
          </h2>
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="transparent" r="48" cx="50" cy="50" />
                <circle
                  className="text-purple-500"
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
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#C084FC', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl md:text-5xl font-mono text-gray-800 font-[Inter]">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isTimerActive ? (
              <button
                onClick={() => setIsTimerActive(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition-all duration-300 shadow-lg text-base sm:text-lg"
              >
                Start
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsTimerActive(false);
                  setActiveTask(null);
                }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition-all duration-300 shadow-lg text-base sm:text-lg"
              >
                Pause
              </button>
            )}
            <button
              onClick={() => {
                setTimeLeft(3 * 60 * 60);
                setIsTimerActive(false);
                setActiveTask(null);
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition-all duration-300 shadow-lg text-base sm:text-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Task Input and Lists Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-[Inter] mb-4 md:mb-0">Manage Tasks</h3>
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-[Inter] bg-white shadow-sm text-sm sm:text-base md:text-lg w-full md:w-auto"
              >
                <option value="deep">Deep Work</option>
                <option value="short">Short Tasks</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <form onSubmit={handleAddTaskForm} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <input
                  type="text"
                  name={
                    selectedCategory === 'deep'
                      ? 'deepWork'
                      : selectedCategory === 'short'
                      ? 'shortTask'
                      : 'maintenanceTask'
                  }
                  placeholder={placeholderText}
                  className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-[Inter] bg-white shadow-sm text-sm sm:text-base md:text-lg"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-300 shadow-lg text-sm sm:text-base md:text-lg"
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {/* Task Categories */}
          <div className="grid grid-cols-1 gap-6">
            {/* Deep Work Tasks */}
            <div className="bg-gray-50 rounded-xl shadow-md p-4">
              <div className="flex items-center space-x-3 mb-4">
                <FaClock className="text-purple-500 text-xl sm:text-2xl" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 font-[Inter]">Deep Work Tasks</h3>
              </div>
              {deepWorkTasks.length === 0 ? (
                <p className="text-gray-600 font-[Inter] text-sm sm:text-base">No deep work tasks added yet.</p>
              ) : (
                <div className="space-y-3">
                  {deepWorkTasks.map((task) => (
                    <div key={task.id} className="flex flex-col p-3 bg-white rounded-lg shadow-sm">
                      {editingTask && editingTask.id === task.id ? (
                        <div className="w-full flex flex-col space-y-3">
                          <input
                            type="text"
                            value={editingTask.text}
                            onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-[Inter] bg-white text-sm sm:text-base"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEditedTask('deep', task.id)}
                              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-gray-700 font-[Inter] text-sm sm:text-base break-words max-w-[60%] sm:max-w-[70%]">{task.text}</span>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              {activeTask && activeTask.id === task.id && isTimerActive ? (
                                <>
                                  <span className="text-gray-600 text-sm sm:text-base font-[Inter]">{formatTaskTime(taskTimers[task.id] || 0)}</span>
                                  <button
                                    onClick={() => toggleTaskTimer('deep', task.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                                  >
                                    Pause
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => toggleTaskTimer('deep', task.id)}
                                  className={`font-semibold py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                                    activeTask && activeTask.id !== task.id
                                      ? 'bg-gray-400 text-white cursor-not-allowed'
                                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                                  }`}
                                  disabled={activeTask && activeTask.id !== task.id}
                                >
                                  {activeTask && activeTask.id === task.id ? 'Resume' : 'Start'}
                                </button>
                              )}
                              <button onClick={() => startEditingTask('deep', task)} className="text-gray-600 hover:text-gray-800 text-base sm:text-lg" title="Edit">
                                ✏️
                              </button>
                              <button onClick={() => deleteTask('deep', task.id)} className="text-red-500 hover:text-red-600 text-base sm:text-lg" title="Delete">
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Short Tasks */}
            <div className="bg-gray-50 rounded-xl shadow-md p-4">
              <div className="flex items-center space-x-3 mb-4">
                <FaTasks className="text-purple-500 text-xl sm:text-2xl" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 font-[Inter]">Short Tasks</h3>
              </div>
              {shortTasks.length === 0 ? (
                <p className="text-gray-600 font-[Inter] text-sm sm:text-base">No short tasks added yet.</p>
              ) : (
                <div className="space-y-3">
                  {shortTasks.map((task) => (
                    <div key={task.id} className="flex flex-col p-3 bg-white rounded-lg shadow-sm">
                      {editingTask && editingTask.id === task.id ? (
                        <div className="w-full flex flex-col space-y-3">
                          <input
                            type="text"
                            value={editingTask.text}
                            onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-[Inter] bg-white text-sm sm:text-base"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEditedTask('short', task.id)}
                              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-gray-700 font-[Inter] text-sm sm:text-base break-words max-w-[60%] sm:max-w-[70%]">{task.text}</span>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              {activeTask && activeTask.id === task.id && isTimerActive ? (
                                <>
                                  <span className="text-gray-600 text-sm sm:text-base font-[Inter]">{formatTaskTime(taskTimers[task.id] || 0)}</span>
                                  <button
                                    onClick={() => toggleTaskTimer('short', task.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                                  >
                                    Pause
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => toggleTaskTimer('short', task.id)}
                                  className={`font-semibold py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                                    activeTask && activeTask.id !== task.id
                                      ? 'bg-gray-400 text-white cursor-not-allowed'
                                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                                  }`}
                                  disabled={activeTask && activeTask.id !== task.id}
                                >
                                  {activeTask && activeTask.id === task.id ? 'Resume' : 'Start'}
                                </button>
                              )}
                              <button onClick={() => startEditingTask('short', task)} className="text-gray-600 hover:text-gray-800 text-base sm:text-lg" title="Edit">
                                ✏️
                              </button>
                              <button onClick={() => deleteTask('short', task.id)} className="text-red-500 hover:text-red-600 text-base sm:text-lg" title="Delete">
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Maintenance Tasks */}
            <div className="bg-gray-50 rounded-xl shadow-md p-4">
              <div className="flex items-center space-x-3 mb-4">
                <FaCogs className="text-purple-500 text-xl sm:text-2xl" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 font-[Inter]">Maintenance Tasks</h3>
              </div>
              {maintenanceTasks.length === 0 ? (
                <p className="text-gray-600 font-[Inter] text-sm sm:text-base">No maintenance tasks added yet.</p>
              ) : (
                <div className="space-y-3">
                  {maintenanceTasks.map((task) => (
                    <div key={task.id} className="flex flex-col p-3 bg-white rounded-lg shadow-sm">
                      {editingTask && editingTask.id === task.id ? (
                        <div className="w-full flex flex-col space-y-3">
                          <input
                            type="text"
                            value={editingTask.text}
                            onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-[Inter] bg-white text-sm sm:text-base"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEditedTask('maintenance', task.id)}
                              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-gray-700 font-[Inter] text-sm sm:text-base break-words max-w-[60%] sm:max-w-[70%]">{task.text}</span>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              {activeTask && activeTask.id === task.id && isTimerActive ? (
                                <>
                                  <span className="text-gray-600 text-sm sm:text-base font-[Inter]">{formatTaskTime(taskTimers[task.id] || 0)}</span>
                                  <button
                                    onClick={() => toggleTaskTimer('maintenance', task.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                                  >
                                    Pause
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => toggleTaskTimer('maintenance', task.id)}
                                  className={`font-semibold py-1 px-2 sm:px-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                                    activeTask && activeTask.id !== task.id
                                      ? 'bg-gray-400 text-white cursor-not-allowed'
                                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                                  }`}
                                  disabled={activeTask && activeTask.id !== task.id}
                                >
                                  {activeTask && activeTask.id === task.id ? 'Resume' : 'Start'}
                                </button>
                              )}
                              <button onClick={() => startEditingTask('maintenance', task)} className="text-gray-600 hover:text-gray-800 text-base sm:text-lg" title="Edit">
                                ✏️
                              </button>
                              <button onClick={() => deleteTask('maintenance', task.id)} className="text-red-500 hover:text-red-600 text-base sm:text-lg" title="Delete">
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'history') {
    mainContent = (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 font-[Inter]">Session History</h2>
        {history.length === 0 ? (
          <p className="text-gray-600 text-center font-[Inter] text-sm sm:text-base">No sessions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 font-[Inter] font-semibold text-sm sm:text-base md:text-lg">Date</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 text-center font-[Inter] font-semibold text-sm sm:text-base md:text-lg">Deep Tasks</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 text-center font-[Inter] font-semibold text-sm sm:text-base md:text-lg">Short Tasks</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 text-center font-[Inter] font-semibold text-sm sm:text-base md:text-lg">Maintenance Tasks</th>
                </tr>
              </thead>
              <tbody>
                {history.map((session, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 font-[Inter] text-sm sm:text-base">{session.date}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 text-center font-[Inter] text-sm sm:text-base">{session.deepCount}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 text-center font-[Inter] text-sm sm:text-base">{session.shortCount}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 text-center font-[Inter] text-sm sm:text-base">{session.maintenanceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } else if (activeTab === 'ranking') {
    mainContent = (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 font-[Inter]">Task Ranking</h2>
        {rankedTasks.length === 0 ? (
          <p className="text-gray-600 text-center font-[Inter] text-sm sm:text-base">No tasks added yet.</p>
        ) : (
          <ul className="list-decimal list-inside space-y-3">
            {rankedTasks.map((task) => (
              <li key={task.id} className="p-3 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800 font-[Inter] text-sm sm:text-base break-words max-w-[60%] sm:max-w-[70%]">{task.text}</span>
                  <span className="text-xs sm:text-sm text-gray-500 font-[Inter]">({task.category})</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-[Inter] mt-2 sm:mt-0">
                  Time Spent: {formatTaskTime(taskTimers[task.id] || 0)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 font-[Inter] mb-4 sm:mb-0">3-3-3 Method</h1>
        <button
          onClick={() => setShowHelp(true)}
          className="relative bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 text-lg sm:text-xl md:text-2xl transform hover:scale-110"
          title="How it works"
        >
          ?
          <span className="absolute inset-0 rounded-full bg-purple-500 opacity-25 animate-ping"></span>
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex justify-center mb-6">
        <nav className=" text-black p-2 sm:p-3 rounded-full shadow-lg flex flex-col space-y-2 sm:space-y-3 md:flex-row md:space-y-0 md:space-x-4 w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-200 font-[Inter] text-sm sm:text-base md:text-xl ${
              activeTab === 'timer' ? 'bg-purple-700' : 'hover:bg-purple-600'
            }`}
          >
            <FaClock />
            <span>3-3-3 Timer</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-200 font-[Inter] text-sm sm:text-base md:text-xl ${
              activeTab === 'history' ? 'bg-purple-700' : 'hover:bg-purple-600'
            }`}
          >
            <FaHistory />
            <span>History</span>
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-200 font-[Inter] text-sm sm:text-base md:text-xl ${
              activeTab === 'ranking' ? 'bg-purple-700' : 'hover:bg-purple-600'
            }`}
          >
            <FaListOl />
            <span>Ranking</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">{mainContent}</div>

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default DeepWorkTimer;