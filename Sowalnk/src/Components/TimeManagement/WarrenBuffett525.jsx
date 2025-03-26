import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTrash, FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

function WarrenBuffett525() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("warrenBuffettTasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Error parsing tasks from localStorage:", error);
      return [];
    }
  });
  const [newTask, setNewTask] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [showPrioritize, setShowPrioritize] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [topFiveTasks, setTopFiveTasks] = useState(() => {
    try {
      const savedTopFive = localStorage.getItem("warrenBuffettTopFive");
      return savedTopFive ? JSON.parse(savedTopFive) : [];
    } catch (error) {
      console.error("Error parsing topFiveTasks from localStorage:", error);
      return [];
    }
  });
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem("warrenBuffettTasks", JSON.stringify(tasks));
      localStorage.setItem("warrenBuffettTopFive", JSON.stringify(topFiveTasks));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [tasks, topFiveTasks]);

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
    setTasks((prev) => {
      const updatedTasks = [...prev, taskObj];
      console.log("Tasks after adding:", updatedTasks);
      return updatedTasks;
    });
    setNewTask("");
    setNewTaskNotes("");
    setNewTaskPriority("Medium");
    setFilterOption("all"); // Reset filter to show all tasks
    setSearchQuery(""); // Reset search query
    toast.success("Task added successfully!");
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => {
      const updatedTasks = prev.filter((task) => task.id !== taskId);
      console.log("Tasks after deleting:", updatedTasks);
      return updatedTasks;
    });
    setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    setTopFiveTasks((prev) => prev.filter((id) => id !== taskId));
    toast.success("Task deleted!");
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
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

    const remaining20 = top25Tasks.slice(5).map((task) => task.id);
    setTasks((prev) =>
      prev.map((task) => {
        if (remaining20.includes(task.id)) {
          return { ...task, ignored: true };
        }
        return { ...task, ignored: false };
      })
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
      position: "top-right",
      action: {
        text: "Undo",
        onClick: () => {
          setTasks(previousTasks);
        },
      },
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
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const filteredTasks = tasks.filter((task) => {
    console.log("Filtering task:", task);
    if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterOption === "completed") return task.completed;
    if (filterOption === "top5") return topFiveTasks.includes(task.id);
    if (filterOption === "ignored") return task.ignored;
    return true;
  });

  console.log("Filtered tasks:", filteredTasks);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "newest") {
      return parseInt(b.id) - parseInt(a.id);
    } else if (sortOption === "oldest") {
      return parseInt(a.id) - parseInt(b.id);
    } else if (sortOption === "alphabetical") {
      return a.text.localeCompare(b.text);
    }
    return 0;
  });

  console.log("Sorted tasks:", sortedTasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const topFiveCompleted = tasks.filter(
    (task) => topFiveTasks.includes(task.id) && task.completed
  ).length;
  const topFiveProgress = topFiveTasks.length ? (topFiveCompleted / topFiveTasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold font-[Inter] text-gray-900">
            Warren Buffett 5/25 Rule
          </h1>
          <button
          onClick={() => setShowHelp(true)}
          className="relative bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 text-2xl transform hover:scale-110"
          title="How it works"
        >
          ?
          <span className="absolute inset-0 rounded-full bg-purple-500 opacity-25 animate-ping"></span>
        </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Task Input Form */}
          <form
            onSubmit={handleAddTask}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 sm:gap-4"
          >
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 font-[Inter]">
              Add a New Task
            </h2>
            <input
              type="text"
              placeholder="Enter your task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 w-full text-base sm:text-lg placeholder-gray-400"
            />
            <textarea
              placeholder="Add notes (optional)..."
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              className="p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 w-full text-base sm:text-lg placeholder-gray-400 resize-none h-16 sm:h-20"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 w-full text-base sm:text-lg text-gray-700"
            >
              <option value="High">Priority: High</option>
              <option value="Medium">Priority: Medium</option>
              <option value="Low">Priority: Low</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 font-semibold text-base sm:text-lg"
            >
              Add Task
            </button>
          </form>

          {/* Progress Tracker */}
          {topFiveTasks.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 font-[Inter]">
                Top 5 Progress
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-purple-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${topFiveProgress}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                {topFiveCompleted}/{topFiveTasks.length} tasks completed
              </p>
            </div>
          )}

          {/* Action Buttons, Search, and Filters */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {tasks.length > 0 && (
                <>
                  <button
                    onClick={() => setShowPrioritize(true)}
                    className="px-4 py-2 sm:px-5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 font-semibold text-sm sm:text-lg w-full sm:w-auto"
                  >
                    Prioritize Tasks (5/25)
                  </button>
                  <button
                    onClick={resetPrioritization}
                    className="px-4 py-2 sm:px-5 sm:py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 font-semibold text-sm sm:text-lg w-full sm:w-auto"
                  >
                    Reset Prioritization
                  </button>
                  <button
                    onClick={clearAllTasks}
                    className="px-4 py-2 sm:px-5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold text-sm sm:text-lg w-full sm:w-auto"
                  >
                    Clear All Tasks
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-sm sm:text-lg w-full sm:w-48"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-sm sm:text-lg w-full sm:w-48"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="alphabetical">Sort: Alphabetical</option>
              </select>
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-sm sm:text-lg w-full sm:w-48"
              >
                <option value="all">Filter: All</option>
                <option value="completed">Filter: Completed</option>
                <option value="top5">Filter: Top 5</option>
                <option value="ignored">Filter: Ignored</option>
              </select>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 font-[Inter]">
              Your Tasks
            </h2>
            {sortedTasks.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 sm:space-y-3"
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
                                className="flex flex-col p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                    <input
                                      type="checkbox"
                                      checked={task.completed}
                                      onChange={() =>
                                        handleToggleComplete(task.id)
                                      }
                                      className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 border-2 border-gray-300 rounded focus:ring-purple-400"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                        <span
                                          className={`text-base sm:text-lg font-medium ${
                                            task.completed
                                              ? "line-through text-gray-500"
                                              : "text-gray-800"
                                          }`}
                                        >
                                          {task.text}
                                        </span>
                                        {isTopFive && (
                                          <span className="text-xs font-semibold px-1.5 sm:px-2 sm:py-1 rounded-full bg-purple-500 text-white">
                                            Top 5
                                          </span>
                                        )}
                                        <span className="text-xs font-medium px-1.5 sm:px-2 sm:py-1 rounded-full bg-gray-200 text-gray-800">
                                          {task.priority}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    {task.notes && (
                                      <button
                                        onClick={() => toggleTaskNotes(task.id)}
                                        className="text-gray-600 hover:text-gray-800"
                                      >
                                        {expandedTasks[task.id] ? (
                                          <FaChevronUp size={12} className="sm:size-14" />
                                        ) : (
                                          <FaChevronDown size={12} className="sm:size-14" />
                                        )}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                      <FaTrash size={12} className="sm:size-14" />
                                    </button>
                                  </div>
                                </div>
                                {expandedTasks[task.id] && task.notes && (
                                  <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 p-1 sm:p-2 rounded-lg">
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
              <p className="text-center text-base sm:text-lg italic text-gray-500">
                No tasks added yet.
              </p>
            )}
          </div>

          {/* Task Summary */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 font-[Inter]">
              Task Summary
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">Total Tasks: {totalTasks}</p>
            <p className="text-gray-700 text-sm sm:text-base">Completed Tasks: {completedTasks}</p>
            <p className="text-gray-700 text-sm sm:text-base">Top 5 Tasks: {topFiveTasks.length}</p>
          </div>
        </div>

        {/* Prioritize Modal */}
        {showPrioritize && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-md sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 font-[Inter]">
                  Prioritize Tasks (5/25)
                </h3>
                <button
                  onClick={() => setShowPrioritize(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-700 mb-3 sm:mb-4">
                <p className="text-sm sm:text-lg">
                  Select up to 25 tasks to prioritize. The first 5 will be your
                  main focus, and the rest will be ignored.
                </p>
                <p className="mt-1 sm:mt-2 text-sm sm:text-lg">
                  Selected: {selectedTasks.length}/25
                </p>
              </div>
              <div className="max-h-60 sm:max-h-80 overflow-y-auto border-t border-gray-200 pt-2 sm:pt-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center p-2 sm:p-3 border-b cursor-pointer transition-colors ${
                      selectedTasks.includes(task.id) ? "bg-purple-100" : "border-gray-100"
                    }`}
                    onClick={() => handleTaskSelection(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => handleTaskSelection(task.id)}
                      className="mr-2 h-4 w-4 sm:h-4 sm:w-4 text-purple-500"
                    />
                    <span className="text-sm sm:text-lg">{task.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={handleConfirmTop25}
                  className="px-4 py-2 sm:px-5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 flex-1 text-sm sm:text-lg font-semibold"
                >
                  Confirm Selection
                </button>
                <button
                  onClick={() => setShowPrioritize(false)}
                  className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex-1 text-sm sm:text-lg font-semibold"
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
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-md sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 font-[Inter]">
                  What is the 5/25 Rule?
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-700 text-sm sm:text-lg space-y-2 sm:space-y-3">
                <p>
                  The 5/25 Rule is a simple strategy popularized by Warren
                  Buffett to help you identify and focus on the most important
                  tasks or goals. By choosing your top 25 items and then
                  narrowing it down to the top 5 priorities, you can concentrate
                  your efforts on what truly matters and avoid distractions.
                </p>
                <h3 className="text-base sm:text-xl font-semibold">Benefits:</h3>
                <ul className="list-disc list-inside text-gray-700 mb-1 sm:mb-2 ml-4">
                  <li>Helps maintain clarity and focus on key goals.</li>
                  <li>Prevents spreading yourself too thin across many tasks.</li>
                  <li>Encourages disciplined attention to top priorities.</li>
                </ul>
                <h3 className="text-base sm:text-xl font-semibold">How to Use:</h3>
                <p>
                  1. Write down all the tasks you want to accomplish. <br />
                  2. Pick your top 25. <br />
                  3. Select the top 5 out of those 25 as your main focus. <br />
                  4. Ignore or minimize the rest (20 tasks) until you finish the
                  top 5.
                </p>
                <p className="italic">
                  <strong>Pro Tip:</strong> Regularly review and update your
                  list to ensure your top 5 remain aligned with your current
                  goals.
                </p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-3 sm:mt-4 px-4 py-2 sm:px-5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 w-full text-sm sm:text-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Toaster />
      </div>
    </div>
  );
}

export default WarrenBuffett525;