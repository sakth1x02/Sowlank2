import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Info } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "react-confetti";

function WarrenBuffett525() {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("warrenBuffettTasks")) || []
  );
  const [newTask, setNewTask] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [showPrioritize, setShowPrioritize] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [topFiveTasks, setTopFiveTasks] = useState(
    () => JSON.parse(localStorage.getItem("warrenBuffettTopFive")) || []
  );
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTasks, setExpandedTasks] = useState({});
  const [points, setPoints] = useState(
    () => parseInt(localStorage.getItem("warrenPoints")) || 0
  );
  const [level, setLevel] = useState(
    () => parseInt(localStorage.getItem("warrenLevel")) || 1
  );
  const [badges, setBadges] = useState(
    () => JSON.parse(localStorage.getItem("warrenBadges")) || []
  );
  const [rewards, setRewards] = useState(
    () => JSON.parse(localStorage.getItem("warrenRewards")) || []
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showSummary, setShowSummary] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    localStorage.setItem("warrenBuffettTasks", JSON.stringify(tasks));
    localStorage.setItem("warrenBuffettTopFive", JSON.stringify(topFiveTasks));
    localStorage.setItem("warrenPoints", points);
    localStorage.setItem("warrenLevel", level);
    localStorage.setItem("warrenBadges", JSON.stringify(badges));
    localStorage.setItem("warrenRewards", JSON.stringify(rewards));
  }, [tasks, topFiveTasks, points, level, badges, rewards]);

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
    const topFiveCompleted = tasks.filter(
      (t) => topFiveTasks.includes(t.id) && t.completed
    ).length;

    if (action === "add" && addedTasks >= 5 && !badges.includes("Task Starter"))
      setBadges((prev) => [...prev, "Task Starter"]);
    if (
      action === "complete" &&
      completedTasks >= 5 &&
      !badges.includes("Task Finisher")
    )
      setBadges((prev) => [...prev, "Task Finisher"]);
    if (
      action === "top5" &&
      topFiveTasks.length === 5 &&
      !badges.includes("Focus Master")
    )
      setBadges((prev) => [...prev, "Focus Master"]);
    if (
      action === "complete" &&
      topFiveCompleted >= 3 &&
      !badges.includes("Top 5 Pro")
    )
      setBadges((prev) => [...prev, "Top 5 Pro"]);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("Task name cannot be empty!");
      return;
    }
    const taskObj = {
      id: Date.now().toString(),
      text: newTask.trim(),
      notes: newTaskNotes,
      priority: newTaskPriority,
      completed: false,
      ignored: false,
    };
    setTasks((prev) => [...prev, taskObj]);
    setPoints((prev) => prev + 10);
    checkGamification("add");
    setNewTask("");
    setNewTaskNotes("");
    setNewTaskPriority("Medium");
    setFilterOption("all");
    setSearchQuery("");
    toast.success("Task added successfully!");
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    setTopFiveTasks((prev) => prev.filter((id) => id !== taskId));
    setPoints((prev) => Math.max(0, prev - 5));
    toast.success("Task deleted!");
  };

  const handleToggleComplete = (taskId) => {
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
    toast.success("Task completion status updated!");
  };

  const handleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else if (selectedTasks.length < 25) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      toast.error("You can only select up to 25 tasks!");
    }
  };

  const handleConfirmTop25 = () => {
    if (selectedTasks.length < 25 && tasks.length >= 25) {
      toast.error("Please select exactly 25 tasks!");
      return;
    }
    const top25Tasks = tasks.filter((task) => selectedTasks.includes(task.id));
    const top5 = top25Tasks.slice(0, 5);
    setTopFiveTasks(top5.map((task) => task.id));
    setPoints((prev) => prev + 50);
    checkGamification("top5");

    const remaining20 = top25Tasks.slice(5).map((task) => task.id);
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        ignored: remaining20.includes(task.id),
      }))
    );
    toast.success("Top 5 tasks selected! Remaining 20 are ignored.");
    setShowPrioritize(false);
    setSelectedTasks([]);
  };

  const clearAllTasks = () => {
    const previousTasks = [...tasks];
    setTasks([]);
    setTopFiveTasks([]);
    setSelectedTasks([]);
    toast("All tasks cleared!", {
      icon: "🗑️",
      duration: 3000,
      action: { text: "Undo", onClick: () => setTasks(previousTasks) },
    });
  };

  const resetPrioritization = () => {
    setTopFiveTasks([]);
    setTasks((prev) => prev.map((task) => ({ ...task, ignored: false })));
    toast.success("Prioritization reset!");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
    toast.success("Task reordered!");
  };

  const toggleTaskNotes = (taskId) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const redeemReward = (reward) => {
    if (rewards.includes(reward.name))
      return toast.error("Reward already redeemed!");
    if (points < reward.cost) return toast.error("Not enough points!");
    setPoints((prev) => prev - reward.cost);
    setRewards((prev) => [...prev, reward.name]);
    if (reward.name === "Dark Theme") setTheme("dark");
    if (reward.name === "Bonus 50 Points") setPoints((prev) => prev + 50);
    if (reward.name === "Custom Badge")
      setBadges((prev) => [...prev, "Custom Star"]);
    toast.success(`${reward.name} redeemed successfully!`);
  };

  const getRewardsList = () => [
    {
      name: "Dark Theme",
      cost: 500,
      description: "Switch to a sleek dark mode.",
    },
    {
      name: "Bonus 50 Points",
      cost: 300,
      description: "Get an extra 50 points.",
    },
    {
      name: "Custom Badge",
      cost: 700,
      description: "Earn a unique 'Custom Star' badge.",
    },
  ];

  const filteredTasks = tasks
    .filter((task) =>
      searchQuery
        ? task.text.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((task) => {
      if (filterOption === "completed") return task.completed;
      if (filterOption === "top5") return topFiveTasks.includes(task.id);
      if (filterOption === "ignored") return task.ignored;
      return true;
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "newest") return parseInt(b.id) - parseInt(a.id);
    if (sortOption === "oldest") return parseInt(a.id) - parseInt(b.id);
    if (sortOption === "alphabetical") return a.text.localeCompare(b.text);
    return 0;
  });

  const getProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const getSummaryData = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const topFiveCompleted = tasks.filter(
      (t) => topFiveTasks.includes(t.id) && t.completed
    ).length;
    return { totalTasks, completedTasks, pendingTasks, topFiveCompleted };
  };

  const getRankingData = () => {
    const priorityStats = {};
    tasks.forEach((task) => {
      if (!priorityStats[task.priority]) {
        priorityStats[task.priority] = { completed: 0, total: 0 };
      }
      priorityStats[task.priority].total += 1;
      if (task.completed) priorityStats[task.priority].completed += 1;
    });
    return Object.entries(priorityStats)
      .map(([priority, { completed, total }]) => ({
        priority,
        completed,
        total,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      }))
      .sort(
        (a, b) =>
          b.completed - a.completed || b.completionRate - a.completionRate
      );
  };

  const progress = getProgress();
  const rewardsList = getRewardsList();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } flex flex-col`}
    >
      {showConfetti && <Confetti />}
      {/* Header */}
      <header
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }  p-6 flex items-center justify-between sticky top-0 z-10 `}
      >
        <h1
          className={`text-3xl font-extrabold ${
            theme === "dark" ? "text-purple-300" : "text-purple-500"
          } font-[Inter]`}
        >
          Warren Buffett 5/25 Rule
        </h1>
        <button
          onClick={() => setShowHelp(true)}
          className={`${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-purple-200 hover:bg-purple-300"
          } p-3 rounded-full transition-all`}
        >
          <Info
            size={24}
            className={theme === "dark" ? "text-purple-300" : "text-purple-500"}
          />
        </button>
      </header>

      {/* Main Layout */}
      <div className="">
        {/* Sidebar: Gamification */}
        <aside
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } w-full  shadow-lg p-6 flex-shrink-0 overflow-y-auto border-r ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="space-y-6">
            <div
              className={`${
                theme === "dark" ? "bg-purple-700" : "bg-purple-500"
              } text-white p-6 rounded-xl shadow-lg`}
            >
              <h3 className="text-2xl font-semibold">Level {level}</h3>
              <p className="text-sm mt-2">Points: {points.toLocaleString()}</p>
              <div className="mt-4">
                <div
                  className={`${
                    theme === "dark" ? "bg-purple-600" : "bg-purple-400"
                  } w-full rounded-full h-3`}
                >
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${points % 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-purple-100">
                  {points % 100}/100 to Level {level + 1}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Badges</h4>
              <div className="flex flex-wrap gap-3">
                {badges.length ? (
                  badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md"
                    >
                      {badge}
                    </span>
                  ))
                ) : (
                  <p className="text-sm italic">
                    Earn badges by managing tasks!
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Rewards</h4>
              <ul className="space-y-2">
                {rewardsList.map((reward) => (
                  <li
                    key={reward.name}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {reward.name} ({reward.cost} pts): {reward.description}
                    </span>
                    <button
                      onClick={() => redeemReward(reward)}
                      disabled={
                        rewards.includes(reward.name) || points < reward.cost
                      }
                      className={`px-2 py-1 text-sm rounded ${
                        rewards.includes(reward.name)
                          ? "bg-gray-400"
                          : points < reward.cost
                          ? "bg-gray-300"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white`}
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
          {/* Progress Tracker */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Overall Progress</h2>
              <span className="text-base font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Task Input Form */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl shadow-lg mb-6`}
          >
            <form
              onSubmit={handleAddTask}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Enter your task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300"
                } p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300"
                } p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="High">Priority: High</option>
                <option value="Medium">Priority: Medium</option>
                <option value="Low">Priority: Low</option>
              </select>
              <textarea
                placeholder="Add notes (optional)..."
                value={newTaskNotes}
                onChange={(e) => setNewTaskNotes(e.target.value)}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300"
                } p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none md:col-span-2`}
              />
              <button
                type="submit"
                className="md:col-span-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors font-semibold"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Action Buttons, Search, and Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {tasks.length > 0 && (
                <>
                  <button
                    onClick={() => setShowPrioritize(true)}
                    className="px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 font-semibold"
                  >
                    Prioritize Tasks (5/25)
                  </button>
                  <button
                    onClick={resetPrioritization}
                    className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 font-semibold"
                  >
                    Reset Prioritization
                  </button>
                  <button
                    onClick={clearAllTasks}
                    className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold"
                  >
                    Clear All Tasks
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-48`}
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-48`}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="alphabetical">Sort: Alphabetical</option>
              </select>
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-48`}
              >
                <option value="all">Filter: All</option>
                <option value="completed">Filter: Completed</option>
                <option value="top5">Filter: Top 5</option>
                <option value="ignored">Filter: Ignored</option>
              </select>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Your Tasks</h2>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-purple-200 hover:bg-purple-300"
                  } px-4 py-2 rounded-lg transition-all text-sm font-semibold`}
                >
                  {showSummary ? "Hide Summary" : "Show Summary"}
                </button>
                <button
                  onClick={() => setShowRanking(!showRanking)}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-purple-200 hover:bg-purple-300"
                  } px-4 py-2 rounded-lg transition-all text-sm font-semibold`}
                >
                  {showRanking ? "Hide Ranking" : "Show Ranking"}
                </button>
              </div>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-6 rounded-xl shadow-lg`}
            >
              {sortedTasks.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="tasks">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {sortedTasks.map((task, index) => {
                          const isTopFive = topFiveTasks.includes(task.id);
                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${
                                    theme === "dark"
                                      ? "bg-gray-700"
                                      : "bg-gray-50"
                                  } flex flex-col p-4 rounded-lg border ${
                                    theme === "dark"
                                      ? "border-gray-600"
                                      : "border-gray-200"
                                  } hover:bg-gray-100 transition-all duration-300`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() =>
                                          handleToggleComplete(task.id)
                                        }
                                        className="h-5 w-5 text-purple-500 border-2 rounded focus:ring-purple-400"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span
                                            className={`text-lg font-medium ${
                                              task.completed
                                                ? "line-through text-gray-500"
                                                : theme === "dark"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            {task.text}
                                          </span>
                                          {isTopFive && (
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-500 text-white">
                                              Top 5
                                            </span>
                                          )}
                                          <span
                                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                                              theme === "dark"
                                                ? "bg-gray-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                            }`}
                                          >
                                            {task.priority}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {task.notes && (
                                        <button
                                          onClick={() =>
                                            toggleTaskNotes(task.id)
                                          }
                                          className="text-gray-600 hover:text-gray-800"
                                        >
                                          {expandedTasks[task.id] ? (
                                            <FaChevronUp size={14} />
                                          ) : (
                                            <FaChevronDown size={14} />
                                          )}
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          handleDeleteTask(task.id)
                                        }
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  {expandedTasks[task.id] && task.notes && (
                                    <p
                                      className={`${
                                        theme === "dark"
                                          ? "text-gray-300"
                                          : "text-gray-600"
                                      } text-sm mt-2 p-2 rounded-lg`}
                                    >
                                      {task.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <p className="text-center text-lg italic text-gray-500">
                  No tasks added yet.
                </p>
              )}
            </div>

            {/* Summary Section */}
            {showSummary && (
              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } p-6 rounded-xl shadow-lg mt-6`}
              >
                <h3 className="text-2xl font-bold mb-4">Task Summary</h3>
                <div className="space-y-4">
                  {(() => {
                    const {
                      totalTasks,
                      completedTasks,
                      pendingTasks,
                      topFiveCompleted,
                    } = getSummaryData();
                    return (
                      <>
                        <div>
                          <p>
                            <strong>Total Tasks:</strong> {totalTasks}
                          </p>
                          <p>
                            <strong>Completed:</strong> {completedTasks}
                          </p>
                          <p>
                            <strong>Pending:</strong> {pendingTasks}
                          </p>
                          <p>
                            <strong>Top 5 Completed:</strong> {topFiveCompleted}
                            /{topFiveTasks.length}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Ranking Section */}
            {showRanking && (
              <div
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } p-6 rounded-xl shadow-lg mt-6`}
              >
                <h3 className="text-2xl font-bold mb-4">Priority Rankings</h3>
                <div className="space-y-4">
                  {(() => {
                    const rankings = getRankingData();
                    return rankings.length > 0 ? (
                      <ul className="space-y-3">
                        {rankings.map((rank, idx) => (
                          <li
                            key={rank.priority}
                            className="flex items-center gap-3"
                          >
                            <span className="text-lg font-bold text-purple-600">
                              {idx + 1}.
                            </span>
                            <div>
                              <p>
                                <strong>{rank.priority}</strong>
                              </p>
                              <p className="text-sm">
                                Completed: {rank.completed}/{rank.total} (
                                {rank.completionRate.toFixed(1)}%)
                              </p>
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

      {/* Prioritize Modal */}
      {showPrioritize && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-White text-gray-700"
            } p-8 rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">
                Prioritize Tasks (5/25)
              </h3>
              <button
                onClick={() => setShowPrioritize(false)}
                className="text-2xl font-bold hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <p>
                Select up to 25 tasks to prioritize. The first 5 will be your
                main focus.
              </p>
              <p className="mt-2">Selected: {selectedTasks.length}/25</p>
            </div>
            <div className="max-h-80 overflow-y-auto border-t border-gray-200 pt-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center p-3 border-b cursor-pointer transition-colors ${
                    selectedTasks.includes(task.id)
                      ? "bg-purple-100"
                      : "border-gray-100"
                  }`}
                  onClick={() => handleTaskSelection(task.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleTaskSelection(task.id)}
                    className="mr-2 h-4 w-4 text-purple-500"
                  />
                  <span className="text-lg">{task.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleConfirmTop25}
                className="px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 flex-1 font-semibold"
              >
                Confirm Selection
              </button>
              <button
                onClick={() => setShowPrioritize(false)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex-1 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-White text-gray-700"
            } p-8 rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">What is the 5/25 Rule?</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-2xl font-bold hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <p>
                The 5/25 Rule is a strategy by Warren Buffett to focus on key
                goals.
              </p>
              <h3 className="text-xl font-semibold">Benefits:</h3>
              <ul className="list-disc list-inside">
                <li>Helps maintain clarity and focus on key goals.</li>
                <li>Prevents spreading yourself too thin.</li>
                <li>Encourages disciplined attention to priorities.</li>
              </ul>
              <h3 className="text-xl font-semibold">How to Use:</h3>
              <p>
                1. List all tasks.
                <br />
                2. Pick top 25.
                <br />
                3. Select top 5.
                <br />
                4. Ignore the rest.
              </p>
              <h3 className="text-xl font-semibold">Gamification:</h3>
              <ul className="list-disc list-inside">
                <li>
                  +10 pts (add), +25 pts (complete), +50 pts (prioritize), -5
                  pts (delete).
                </li>
                <li>Level up every 100 points.</li>
                <li>
                  Badges: Starter (5 tasks), Finisher (5 completed), Focus
                  Master (Top 5 set), Top 5 Pro (3 Top 5 completed).
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 w-full font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}

export default WarrenBuffett525;
