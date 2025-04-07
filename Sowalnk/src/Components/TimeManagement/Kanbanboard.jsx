import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Info, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import Confetti from "react-confetti";

function KanbanBoard() {
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [deletedTasks, setDeletedTasks] = useState(() => {
    const savedDeleted = localStorage.getItem("kanbanDeletedTasks");
    return savedDeleted ? JSON.parse(savedDeleted) : [];
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("kanbanPoints")) || 0);
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem("kanbanLevel")) || 1);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("kanbanBadges")) || []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSummarySection, setShowSummarySection] = useState(false);
  const [showRankingsSection, setShowRankingsSection] = useState(false);
  const stages = ["To Do", "Working On", "Completed"];
  const priorities = ["High", "Medium", "Low"];

  // Load and save data to localStorage
  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
    localStorage.setItem("kanbanDeletedTasks", JSON.stringify(deletedTasks));
    localStorage.setItem("kanbanPoints", points);
    localStorage.setItem("kanbanLevel", level);
    localStorage.setItem("kanbanBadges", JSON.stringify(badges));
  }, [tasks, deletedTasks, points, level, badges]);

  // Check for due date alerts
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        if (task.dueDate && task.status !== "Completed" && !task.alerted) {
          const dueTime = new Date(task.dueDate).getTime();
          const now = Date.now();
          if (now >= dueTime) {
            toast.error(`Task "${task.text}" is due now!`, { duration: 5000 });
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, alerted: true } : t))
            );
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Add a task with gamification
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("Task name cannot be empty!");
      return;
    }
    const taskObj = {
      id: Date.now().toString(),
      text: newTask.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : "",
      status: "To Do",
      createdAt: new Date().toISOString(),
      alerted: false,
    };
    setTasks((prev) => [...prev, taskObj]);
    setNewTask("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewDueDate("");
    setPoints((prev) => prev + 10);
    toast.success("Task added! +10 points");
    checkGamification();
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask.text.trim()) {
      toast.error("Task name cannot be empty!");
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id ? { ...editingTask } : task
      )
    );
    toast.success("Task updated successfully!");
    setEditingTask(null);
  };

  // Delete task with undo
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setDeletedTasks((prev) => [...prev, { ...taskToDelete, deletedAt: new Date().toISOString() }]);
    toast("Task deleted!", {
      icon: "🗑️",
      duration: 3000,
      position: "top-right",
      action: {
        text: "Undo",
        onClick: () => {
          setTasks((prev) => [...prev, taskToDelete]);
          setDeletedTasks((prev) => prev.filter((task) => task.id !== taskId));
        },
      },
    });
  };

  // Restore deleted task
  const restoreTask = (taskId) => {
    const taskToRestore = deletedTasks.find((task) => task.id === taskId);
    setTasks((prev) => [...prev, { ...taskToRestore, alerted: false }]);
    setDeletedTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task restored!");
  };

  // Move task with gamification and completion timestamp
  const moveTask = (taskId, currentStatus) => {
    let newStatus;
    if (currentStatus === "To Do") {
      newStatus = "Working On";
    } else if (currentStatus === "Working On") {
      newStatus = "Completed";
    } else {
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedAt: newStatus === "Completed" ? new Date().toISOString() : task.completedAt,
            }
          : task
      )
    );
    if (newStatus === "Completed") {
      setPoints((prev) => prev + 25);
      toast.success("Task completed! +25 points");
      checkGamification();
    } else {
      toast.success(`Task moved to ${newStatus}!`);
    }
  };

  // Drag-and-drop handler
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    if (destination.droppableId === "Completed") {
      movedTask.completedAt = new Date().toISOString();
    }
    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);

    if (destination.droppableId === "Completed") {
      setPoints((prev) => prev + 25);
      toast.success("Task completed! +25 points");
      checkGamification();
    } else {
      toast.success(`Task moved to ${destination.droppableId}!`);
    }
  };

  // Gamification logic
  const checkGamification = () => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    const addedTasks = tasks.length + deletedTasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    if (addedTasks >= 5 && !badges.includes("Task Starter")) {
      setBadges((prev) => [...prev, "Task Starter"]);
    }
    if (completedTasks >= 5 && !badges.includes("Task Finisher")) {
      setBadges((prev) => [...prev, "Task Finisher"]);
    }
  };

  // Kanban data
  const getKanban = () => {
    const kanban = {};
    stages.forEach((stage) => {
      kanban[stage] = tasks.filter((task) => task.status === stage);
    });
    return kanban;
  };

  const getProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  // Calculate completion regularity (mocked for single user)
  const getCompletionRegularity = () => {
    const completedTasks = tasks.filter((task) => task.status === "Completed" && task.completedAt);
    if (completedTasks.length === 0) return [];

    const completionByDay = {};
    completedTasks.forEach((task) => {
      const date = new Date(task.completedAt).toLocaleDateString();
      completionByDay[date] = (completionByDay[date] || 0) + 1;
    });

    const days = Object.keys(completionByDay).length;
    const totalCompleted = completedTasks.length;
    const avgPerDay = totalCompleted / days;

    return [
      {
        rank: 1,
        name: "You",
        completions: totalCompleted,
        regularity: `${avgPerDay.toFixed(1)} tasks/day over ${days} days`,
      },
    ];
  };

  // Sticky Note Task Component
  const Task = ({ task, index }) => {
    const isOverdue =
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 mb-4 rounded-lg shadow-lg transform transition-all hover:shadow-xl cursor-move sticky-note ${
              isOverdue
                ? "bg-red-200 border-red-500 rotate-2"
                : task.priority === "High"
                ? "bg-red-100 border-red-300 -rotate-1"
                : task.priority === "Medium"
                ? "bg-yellow-100 border-yellow-300 rotate-1"
                : "bg-green-100 border-green-300 -rotate-2"
            } border-2`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-800 font-semibold text-base">{task.text}</span>
                <p className="text-sm text-gray-600 mt-1">{task.description || "No description"}</p>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {new Date(task.dueDate).toLocaleString()}
                    {isOverdue && <span className="text-red-600 font-semibold"> (Overdue)</span>}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {task.status !== "Completed" && (
                  <button
                    onClick={() => moveTask(task.id, task.status)}
                    className="text-green-500 hover:text-green-700 text-sm"
                  >
                    {task.status === "To Do" ? "Start" : "Complete"}
                  </button>
                )}
                <button
                  onClick={() => handleEditTask(task)}
                  className="text-purple-500 hover:text-purple-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const renderKanbanStage = (stage, stageTasks) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 capitalize">{stage}</h3>
        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2 py-1 rounded-full">
          {stageTasks.length}
        </span>
      </div>
      <Droppable droppableId={stage}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[200px]">
            {stageTasks.length > 0 ? (
              stageTasks.map((task, index) => <Task key={task.id} task={task} index={index} />)
            ) : (
              <p className="text-gray-500 italic text-center py-4">No tasks in this stage.</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  const kanban = getKanban();
  const progress = getProgress();
  const completionRegularity = getCompletionRegularity();

  // Feature ranking data
  const featureRankings = [
    { rank: 1, name: "Task Management", description: "Add, edit, delete, and move tasks across stages." },
    { rank: 2, name: "Drag-and-Drop Sticky Notes", description: "Organize tasks visually with draggable sticky notes." },
    { rank: 3, name: "Gamification", description: "Earn points, level up, and unlock badges." },
    { rank: 4, name: "Time-Based Reminders", description: "Get alerts for overdue tasks." },
    { rank: 5, name: "Progress Bar", description: "Track completion percentage." },
    { rank: 6, name: "Full-Page Layout", description: "Structured, responsive design." },
    { rank: 7, name: "Undo Delete", description: "Revert task deletion via toast." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
      {showConfetti && <Confetti />}
      {/* Header */}
      <header className="bg-white shadow-lg p-6 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-purple-500">Kanban Board</h1>
        <button
          onClick={() => setShowInfo(true)}
          className="p-3 rounded-full bg-purple-200 hover:bg-purple-300 transition-all"
        >
          <Info size={24} className="text-purple-500" />
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 gap-x-6 overflow-hidden">
        {/* Sidebar: Gamification */}
        <aside className="w-full md:w-72 bg-white shadow-lg p-6 flex-shrink-0 overflow-y-auto border-r border-gray-200">
          <div className="space-y-6">
            <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold">Level {level}</h3>
              <p className="text-sm mt-2">Points: {points.toLocaleString()}</p>
              <div className="mt-4">
                <div className="w-full bg-purple-400 rounded-full h-3">
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Badges</h4>
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
                  <p className="text-sm text-gray-500 italic">Earn badges by managing tasks!</p>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800">Overall Progress</h2>
              <span className="text-base font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Task Input Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Task name..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      Priority: {priority}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors font-semibold"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages.map((stage) => (
                <div key={stage}>{renderKanbanStage(stage, kanban[stage])}</div>
              ))}
            </div>
          </DragDropContext>

          {/* Summary and Rankings Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                setShowSummarySection(!showSummarySection);
                setShowRankingsSection(false); // Close rankings if open
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Summary {showSummarySection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={() => {
                setShowRankingsSection(!showRankingsSection);
                setShowSummarySection(false); // Close summary if open
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Rankings {showRankingsSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Summary Section */}
          {showSummarySection && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
              <div className="space-y-6">
                {/* Current Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Current Tasks</h3>
                  <p className="text-gray-700 mb-2">
                    Total: {tasks.length} | Completed: {tasks.filter((t) => t.status === "Completed").length} | In Progress: {tasks.filter((t) => t.status === "Working On").length} | To Do: {tasks.filter((t) => t.status === "To Do").length}
                  </p>
                </div>

                {/* Previous (Deleted) Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Previous Tasks</h3>
                  {deletedTasks.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      {deletedTasks.map((task) => (
                        <li key={task.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                          <div>
                            <span className="font-semibold">{task.text}</span>
                            <p className="text-sm text-gray-600">
                              Priority: {task.priority} | Deleted: {new Date(task.deletedAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => restoreTask(task.id)}
                            className="text-green-500 hover:text-green-700 text-sm font-semibold"
                          >
                            Restore
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No deleted tasks yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rankings Section */}
          {showRankingsSection && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Rankings</h2>
              <div className="space-y-6">
                {/* Feature Rankings */}
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">Feature Rankings</h3>
                  <ul className="space-y-3">
                    {featureRankings.map((feature) => (
                      <li
                        key={feature.rank}
                        className={`flex items-start gap-2 p-2 rounded-lg ${
                          feature.rank <= 3 ? "bg-indigo-50" : "bg-gray-50"
                        }`}
                      >
                        <span
                          className={`font-semibold text-lg ${
                            feature.rank === 1
                              ? "text-yellow-500"
                              : feature.rank === 2
                              ? "text-gray-500"
                              : feature.rank === 3
                              ? "text-orange-500"
                              : "text-indigo-500"
                          }`}
                        >
                          #{feature.rank}
                        </span>
                        <div>
                          <span className="font-semibold text-gray-800">{feature.name}:</span>{" "}
                          <span className="text-gray-600">{feature.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Task Completion Regularity */}
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">Task Completion Regularity</h3>
                  {completionRegularity.length > 0 ? (
                    <ul className="space-y-3">
                      {completionRegularity.map((user) => (
                        <li
                          key={user.rank}
                          className={`flex items-start gap-2 p-2 rounded-lg ${
                            user.rank <= 3 ? "bg-indigo-50" : "bg-gray-50"
                          }`}
                        >
                          <span
                            className={`font-semibold text-lg ${
                              user.rank === 1
                                ? "text-yellow-500"
                                : user.rank === 2
                                ? "text-gray-500"
                                : user.rank === 3
                                ? "text-orange-500"
                                : "text-indigo-500"
                            }`}
                          >
                            #{user.rank}
                          </span>
                          <div>
                            <span className="font-semibold text-gray-800">{user.name}:</span>{" "}
                            <span className="text-gray-600">
                              Completed {user.completions} tasks - {user.regularity}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No completed tasks yet to rank regularity.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-t-4 border-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <input
                type="text"
                value={editingTask.text}
                onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                placeholder="Description (optional)"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
              />
              <select
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    Priority: {priority}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={editingTask.dueDate}
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    Status: {stage}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-t-4 border-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">About Kanban Board</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="text-gray-700 space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-purple-600 mb-2">What is a Kanban Board?</h4>
                <p>
                  A Kanban Board is a visual tool to manage tasks and workflows, organizing them into stages like "To Do," "Working On," and "Completed."
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-600 mb-2">Benefits</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Visual Clarity:</strong> See task status instantly.</li>
                  <li><strong>Workflow:</strong> Optimize task flow.</li>
                  <li><strong>Focus:</strong> Prioritize effectively.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-600 mb-2">How to Use</h4>
                <ul className="list-decimal list-inside space-y-2">
                  <li>Add tasks with name, description, priority, and due date.</li>
                  <li>Move tasks by clicking "Start"/"Complete" or dragging.</li>
                  <li>Edit or delete tasks as needed.</li>
                  <li>Set reminders for timely alerts.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-600 mb-2">Gamification</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>+10 points for adding a task.</li>
                  <li>+25 points for completing a task.</li>
                  <li>Level up every 100 points.</li>
                  <li>Badges: "Task Starter" (5 added), "Task Finisher" (5 completed).</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
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

export default KanbanBoard;