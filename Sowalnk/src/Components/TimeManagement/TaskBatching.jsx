import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import Confetti from "react-confetti";

function TaskBatchingApp() {
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("batchTasks")) || []);
  const [showInfo, setShowInfo] = useState(false);
  const [filter, setFilter] = useState("all");
  const [timers, setTimers] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("batchPoints")) || 0);
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem("batchLevel")) || 1);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("batchBadges")) || []);
  const [rewards, setRewards] = useState(() => JSON.parse(localStorage.getItem("batchRewards")) || []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showSummary, setShowSummary] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  const categories = ["Emails", "Calls", "Writing", "Admin", "Errands", "Communication", "Creative task"];

  useEffect(() => {
    localStorage.setItem("batchTasks", JSON.stringify(tasks));
    localStorage.setItem("batchPoints", points);
    localStorage.setItem("batchLevel", level);
    localStorage.setItem("batchBadges", JSON.stringify(badges));
    localStorage.setItem("batchRewards", JSON.stringify(rewards));
  }, [tasks, points, level, badges, rewards]);

  const checkGamification = (action, task = {}) => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    const addedTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const highPriorityCompleted = tasks.filter((t) => t.completed && t.priority === "high").length;

    if (action === "add" && addedTasks >= 5 && !badges.includes("Batch Starter")) setBadges((prev) => [...prev, "Batch Starter"]);
    if (action === "complete" && completedTasks >= 5 && !badges.includes("Batch Finisher")) setBadges((prev) => [...prev, "Batch Finisher"]);
    if (action === "complete" && task.timeBlock && new Date().toLocaleTimeString([], { hour12: false }).slice(0, 5) <= task.timeBlock.end && !badges.includes("Time Master")) setBadges((prev) => [...prev, "Time Master"]);
    if (action === "complete" && completedTasks >= 10 && !badges.includes("Task Champion")) setBadges((prev) => [...prev, "Task Champion"]);
    if (action === "complete" && highPriorityCompleted >= 3 && !badges.includes("Priority Pro")) setBadges((prev) => [...prev, "Priority Pro"]);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim() || !category || !startTime || !endTime) return;
    const taskObj = {
      id: editingTask ? editingTask.id : Date.now(),
      text: newTask.trim(),
      category,
      timeBlock: { start: startTime, end: endTime },
      completed: editingTask ? editingTask.completed : false,
      priority,
      notes,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
    };
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? taskObj : t)));
      setEditingTask(null);
    } else {
      setTasks((prev) => [...prev, taskObj]);
      setPoints((prev) => prev + 10);
      checkGamification("add");
    }
    resetForm();
  };

  const resetForm = () => {
    setNewTask("");
    setCategory("");
    setStartTime("");
    setEndTime("");
    setPriority("medium");
    setNotes("");
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (newCompleted) {
            setPoints((prev) => prev + 25);
            checkGamification("complete", task);
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setPoints((prev) => Math.max(0, prev - 5));
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setCategory(task.category);
    setStartTime(task.timeBlock.start);
    setEndTime(task.timeBlock.end);
    setPriority(task.priority);
    setNotes(task.notes);
  };

  const clearAllTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
      setTimers({});
      localStorage.removeItem("batchTasks");
    }
  };

  const startTimer = (category) => {
    if (!timers[category]) {
      setTimers((prev) => ({
        ...prev,
        [category]: {
          time: 0,
          interval: setInterval(() => {
            setTimers((p) => ({ ...p, [category]: { ...p[category], time: p[category].time + 1 } }));
          }, 1000),
        },
      }));
    }
  };

  const stopTimer = (category) => {
    if (timers[category]) {
      clearInterval(timers[category].interval);
      setTimers((prev) => ({ ...prev, [category]: { ...prev[category], interval: null } }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getBatches = () => {
    const batches = {};
    const filteredTasks = tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });
    filteredTasks.forEach((task) => {
      if (!batches[task.category]) batches[task.category] = [];
      batches[task.category].push(task);
    });
    Object.keys(batches).forEach((cat) => batches[cat].sort((a, b) => a.text.localeCompare(b.text)));
    return batches;
  };

  const renderBatch = (category, batchTasks) => {
    const completedTasks = batchTasks.filter((task) => task.completed).length;
    const totalTasks = batchTasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
      <div className="p-4 bg-white rounded-lg shadow-lg border border-purple-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">{category}</h3>
        <p className="text-sm text-gray-600 mb-2">
          Time: {batchTasks[0]?.timeBlock ? `${batchTasks[0].timeBlock.start} - ${batchTasks[0].timeBlock.end}` : "Not scheduled"}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => startTimer(category)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Start</button>
          <button onClick={() => stopTimer(category)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Stop</button>
          <span className="text-sm font-medium text-gray-700">{timers[category] ? formatTime(timers[category].time) : "00:00"}</span>
        </div>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{completedTasks}/{totalTasks} completed</p>
        </div>
        {batchTasks.map((task) => (
          <div key={task.id} className="flex flex-col p-3 mb-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500" />
                <span className={`text-base ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>{task.text}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editTask(task)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Priority: <span className={`${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>{task.priority}</span> | 
              Added: {new Date(task.createdAt).toLocaleString()} | 
              {task.notes && `Notes: ${task.notes}`}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const redeemReward = (reward) => {
    if (rewards.includes(reward.name)) return alert("Reward already redeemed!");
    if (points < reward.cost) return alert("Not enough points!");
    setPoints((prev) => prev - reward.cost);
    setRewards((prev) => [...prev, reward.name]);
    if (reward.name === "Dark Theme") setTheme("dark");
    if (reward.name === "Bonus 50 Points") setPoints((prev) => prev + 50);
    if (reward.name === "Custom Badge") setBadges((prev) => [...prev, "Custom Star"]);
    alert(`${reward.name} redeemed successfully!`);
  };

  const getRewardsList = () => [
    { name: "Dark Theme", cost: 500, description: "Switch to a sleek dark mode." },
    { name: "Bonus 50 Points", cost: 300, description: "Get an extra 50 points." },
    { name: "Custom Badge", cost: 700, description: "Earn a unique 'Custom Star' badge." },
  ];

  const getProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const getSummaryData = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const byCategory = {};
    tasks.forEach((task) => {
      if (!byCategory[task.category]) {
        byCategory[task.category] = { total: 0, completed: 0 };
      }
      byCategory[task.category].total += 1;
      if (task.completed) byCategory[task.category].completed += 1;
    });
    return { totalTasks, completedTasks, pendingTasks, byCategory };
  };

  const getRankingData = () => {
    const categoryStats = {};
    tasks.forEach((task) => {
      if (!categoryStats[task.category]) {
        categoryStats[task.category] = { completed: 0, total: 0 };
      }
      categoryStats[task.category].total += 1;
      if (task.completed) categoryStats[task.category].completed += 1;
    });
    return Object.entries(categoryStats)
      .map(([category, { completed, total }]) => ({
        category,
        completed,
        total,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      }))
      .sort((a, b) => b.completed - a.completed || b.completionRate - a.completionRate);
  };

  const batches = getBatches();
  const rewardsList = getRewardsList();
  const progress = getProgress();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 via-white to-indigo-50 text-gray-800"} flex flex-col`}>
      {showConfetti && <Confetti />}
      {/* Header */}
      <header className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg p-6 flex items-center justify-between sticky top-0 z-10 mb-4`}>
        <h1 className={`text-3xl font-extrabold ${theme === "dark" ? "text-purple-300" : "text-purple-500"}`}>Task Batching</h1>
        <button onClick={() => setShowInfo(true)} className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-purple-200 hover:bg-purple-300"} p-3 rounded-full transition-all`}>
          <Info size={24} className={theme === "dark" ? "text-purple-300" : "text-purple-500"} />
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar: Gamification & Rewards */}
        <aside className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} w-full md:w-96 shadow-lg p-6 flex-shrink-0 overflow-y-auto border-r ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <div className="space-y-6">
            <div className={`${theme === "dark" ? "bg-purple-700" : "bg-purple-500"} text-white p-6 rounded-xl shadow-lg`}>
              <h3 className="text-2xl font-semibold">Level {level}</h3>
              <p className="text-sm mt-2">Points: {points.toLocaleString()}</p>
              <div className="mt-4">
                <div className={`${theme === "dark" ? "bg-purple-600" : "bg-purple-400"} w-full rounded-full h-3`}>
                  <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${points % 100}%` }}></div>
                </div>
                <p className="text-xs mt-1 text-purple-100">{points % 100}/100 to Level {level + 1}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Badges</h4>
              <div className="flex flex-wrap gap-3">
                {badges.length ? badges.map((badge, idx) => (
                  <span key={idx} className="bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">{badge}</span>
                )) : (
                  <p className="text-sm italic">Earn badges by batching tasks!</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Rewards</h4>
              <ul className="space-y-2">
                {rewardsList.map((reward) => (
                  <li key={reward.name} className="flex justify-between items-center">
                    <span>{reward.name} ({reward.cost} pts): {reward.description}</span>
                    <button
                      onClick={() => redeemReward(reward)}
                      disabled={rewards.includes(reward.name) || points < reward.cost}
                      className={`px-2 py-1 text-sm rounded ${rewards.includes(reward.name) ? "bg-gray-400" : points < reward.cost ? "bg-gray-300" : "bg-green-500 hover:bg-green-600"} text-white`}
                    >
                      {rewards.includes(reward.name) ? "Redeemed" : "Redeem"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Overall Progress</h2>
              <span className="text-base font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Form */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg mb-6`}>
            <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className={`${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"} p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"} p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`${theme === "dark" ? "bg-gray-700 border-purple-600 text-white" : "bg-purple-50 border-purple-300"} p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`${theme === "dark" ? "bg-gray-700 border-purple-600 text-white" : "bg-purple-50 border-purple-300"} p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"} p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <textarea
                placeholder="Task notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300"} p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none md:col-span-2`}
              />
              <button
                type="submit"
                className="md:col-span-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors font-semibold"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>
            </form>
          </div>

          {/* Batches Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Your Batches</h2>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-purple-200 hover:bg-purple-300"} px-4 py-2 rounded-lg transition-all text-sm font-semibold`}
                >
                  {showSummary ? "Hide Summary" : "Show Summary"}
                </button>
                <button
                  onClick={() => setShowRanking(!showRanking)}
                  className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-purple-200 hover:bg-purple-300"} px-4 py-2 rounded-lg transition-all text-sm font-semibold`}
                >
                  {showRanking ? "Hide Ranking" : "Show Ranking"}
                </button>
              </div>
              {tasks.length > 0 && (
                <div className="flex gap-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} p-2 border rounded-lg focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="all">Show All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button
                    onClick={clearAllTasks}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(batches).length > 0 ? (
                Object.entries(batches).map(([category, batchTasks]) => renderBatch(category, batchTasks))
              ) : (
                <p className="text-gray-500 italic col-span-full text-center py-8">No tasks yet. Add some above to get started!</p>
              )}
            </div>

            {/* Summary Section */}
            {showSummary && (
              <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg mt-6`}>
                <h3 className="text-2xl font-bold mb-4">Task Summary</h3>
                <div className="space-y-4">
                  {(() => {
                    const { totalTasks, completedTasks, pendingTasks, byCategory } = getSummaryData();
                    return (
                      <>
                        <div>
                          <p><strong>Total Tasks:</strong> {totalTasks}</p>
                          <p><strong>Completed:</strong> {completedTasks}</p>
                          <p><strong>Pending:</strong> {pendingTasks}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-purple-600">By Category</h4>
                          {Object.keys(byCategory).length > 0 ? (
                            <ul className="list-disc pl-6 space-y-2">
                              {Object.entries(byCategory).map(([cat, { total, completed }]) => (
                                <li key={cat}>
                                  {cat}: {completed}/{total} completed ({((completed / total) * 100).toFixed(1)}%)
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No tasks yet.</p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Ranking Section */}
            {showRanking && (
              <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg mt-6`}>
                <h3 className="text-2xl font-bold mb-4">Category Rankings</h3>
                <div className="space-y-4">
                  {(() => {
                    const rankings = getRankingData();
                    return rankings.length > 0 ? (
                      <ul className="space-y-3">
                        {rankings.map((rank, idx) => (
                          <li key={rank.category} className="flex items-center gap-3">
                            <span className="text-lg font-bold text-purple-600">{idx + 1}.</span>
                            <div>
                              <p><strong>{rank.category}</strong></p>
                              <p className="text-sm">Completed: {rank.completed}/{rank.total} ({rank.completionRate.toFixed(1)}%)</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tasks to rank yet.</p>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Info Modal - Keeping this as a popup */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-700"} p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-t-4 border-purple-500`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Task Batching Guide</h3>
              <button onClick={() => setShowInfo(false)} className="text-3xl font-bold hover:text-gray-500">×</button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-purple-600">What is Task Batching?</h4>
                <p>Group similar tasks into time blocks to reduce context switching.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-600">Benefits</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Increased Focus:</strong> Less context switching.</li>
                  <li><strong>Time Savings:</strong> Reduces setup time.</li>
                  <li><strong>Reduced Stress:</strong> Organized approach.</li>
                  <li><strong>Higher Productivity:</strong> More in less time.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-600">Gamification & Rewards</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>+10 pts (add), +25 pts (complete), -5 pts (delete).</li>
                  <li>Level up every 100 points.</li>
                  <li>Badges: Starter (5 added), Finisher (5 completed), Time Master, Champion (10 completed), Priority Pro (3 high-priority).</li>
                  <li>Rewards: Dark Theme (500 pts), Bonus 50 Points (300 pts), Custom Badge (700 pts).</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600"
            >
              Start Batching!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskBatchingApp;