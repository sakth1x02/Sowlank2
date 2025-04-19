import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaUndo,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Info, X } from "lucide-react";
import Confetti from "react-confetti";

const Pickle = () => {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("pickleTasks")) || []
  );
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isMajor, setIsMajor] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsMajor, setEditIsMajor] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [points, setPoints] = useState(
    () => parseInt(localStorage.getItem("picklePoints")) || 0
  );
  const [level, setLevel] = useState(
    () => parseInt(localStorage.getItem("pickleLevel")) || 1
  );
  const [badges, setBadges] = useState(
    () => JSON.parse(localStorage.getItem("pickleBadges")) || []
  );
  const [rewards, setRewards] = useState(
    () => JSON.parse(localStorage.getItem("pickleRewards")) || []
  );
  const [streak, setStreak] = useState(
    () => parseInt(localStorage.getItem("pickleStreak")) || 0
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPage, setCurrentPage] = useState("tasks");
  const [lastTaskDate, setLastTaskDate] = useState(
    () => localStorage.getItem("pickleLastTaskDate") || null
  );

  useEffect(() => {
    localStorage.setItem("pickleTasks", JSON.stringify(tasks));
    localStorage.setItem("picklePoints", points);
    localStorage.setItem("pickleLevel", level);
    localStorage.setItem("pickleBadges", JSON.stringify(badges));
    localStorage.setItem("pickleRewards", JSON.stringify(rewards));
    localStorage.setItem("pickleStreak", streak);
    localStorage.setItem("pickleLastTaskDate", lastTaskDate);
  }, [tasks, points, level, badges, rewards, streak, lastTaskDate]);

  const checkGamification = (action) => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
      setRewards((prev) => [...prev, `Reward: ${newLevel * 10} Bonus Points`]);
      setPoints((prev) => prev + newLevel * 10);
      setShowConfetti(true);
      toast.success(
        `Level ${newLevel} reached! +${newLevel * 10} Bonus Points!`,
        { duration: 4000 }
      );
      setTimeout(() => setShowConfetti(false), 4000);
    }
    const completedTasks = tasks.filter((t) => t.completed).length;
    const majorTasks = tasks.filter((t) => t.isMajor).length;

    if (action === "complete") {
      const today = new Date().toDateString();
      if (lastTaskDate && lastTaskDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (
          new Date(lastTaskDate).toDateString() === yesterday.toDateString()
        ) {
          setStreak((prev) => prev + 1);
          if (streak + 1 === 3) {
            setBadges((prev) => [...prev, "3-Day Streak"]);
            setPoints((prev) => prev + 30);
            toast.success("3-Day Streak! +30 Points!");
          }
          if (streak + 1 === 7) {
            setBadges((prev) => [...prev, "7-Day Streak"]);
            setPoints((prev) => prev + 70);
            toast.success("7-Day Streak! +70 Points!");
          }
        } else {
          setStreak(1);
        }
      } else if (!lastTaskDate) {
        setStreak(1);
      }
      setLastTaskDate(today);

      if (completedTasks >= 5 && !badges.includes("Task Finisher")) {
        setBadges((prev) => [...prev, "Task Finisher"]);
        setRewards((prev) => [...prev, "Reward: Task Finisher Medal"]);
        toast.success("Badge earned: Task Finisher! + Medal Reward!");
      }
    }
    if (
      action === "addMajor" &&
      majorTasks >= 3 &&
      !badges.includes("Major Planner")
    ) {
      setBadges((prev) => [...prev, "Major Planner"]);
      setRewards((prev) => [...prev, "Reward: 50 Bonus Points"]);
      setPoints((prev) => prev + 50);
      toast.success("Badge earned: Major Planner! +50 Bonus Points!");
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      toast.error("Task cannot be empty!");
      return;
    }
    const newTaskObj = {
      id: `task-${Date.now()}`,
      content: newTask,
      description: newTaskDescription,
      isMajor,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setPoints((prev) => prev + (isMajor ? 20 : 10));
    checkGamification(isMajor ? "addMajor" : "add");
    setNewTask("");
    setNewTaskDescription("");
    toast.success("Task added successfully!");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
    setPoints((prev) => prev + 5);
    toast.success("Task relocated! +5 Points");
  };

  const handleCompleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
    if (!task.completed) {
      setPoints((prev) => prev + (task.isMajor ? 50 : 25));
      checkGamification("complete");
    }
    toast.success(`Task ${task.completed ? "restored" : "completed"}!`);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    if (editingTask && editingTask.id === taskId) setEditingTask(null);
    setExpandedTasks((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[taskId];
      return newExpanded;
    });
    toast.success("Task deleted!");
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditText(task.content);
    setEditDescription(task.description || "");
    setEditIsMajor(task.isMajor);
  };

  const handleSaveEdit = (taskId) => {
    if (editText.trim() === "") {
      toast.error("Task cannot be empty!");
      return;
    }
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              content: editText,
              description: editDescription,
              isMajor: editIsMajor,
            }
          : task
      )
    );
    setEditingTask(null);
    toast.success("Task updated!");
  };

  const toggleTaskDescription = (taskId) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const majorTasks = tasks.filter((task) => task.isMajor).length;
  const minorTasks = tasks.filter((task) => !task.isMajor).length;

  const handleReset = () => {
    setTasks([]);
    setPoints(0);
    setLevel(1);
    setBadges([]);
    setRewards([]);
    setStreak(0);
    setLastTaskDate(null);
    setExpandedTasks({});
    toast.success("App reset!");
  };

  const getSummaryData = () => ({
    totalTasks,
    completedTasks,
    majorTasks,
    minorTasks,
    streak,
  });

  const getRankingData = () => {
    const majorCompleted = tasks.filter((t) => t.isMajor && t.completed).length;
    const minorCompleted = tasks.filter(
      (t) => !t.isMajor && t.completed
    ).length;
    const majorTotal = majorTasks;
    const minorTotal = minorTasks;
    return [
      {
        type: "Major Tasks",
        completed: majorCompleted,
        total: majorTotal,
        completionRate:
          majorTotal > 0 ? (majorCompleted / majorTotal) * 100 : 0,
      },
      {
        type: "Minor Tasks",
        completed: minorCompleted,
        total: minorTotal,
        completionRate:
          minorTotal > 0 ? (minorCompleted / minorTotal) * 100 : 0,
      },
    ].sort(
      (a, b) => b.completed - a.completed || b.completionRate - a.completionRate
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      {/* Header */}
      <header className="p-4 md:p-6 shadow-lg flex justify-between items-center bg-white sticky top-0 z-10">
        <h1 className="text-2xl md:text-4xl font-bold font-[Inter] text-purple-700">
          Pickle Jar
        </h1>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
          title="Learn about the Pickle Jar Method"
        >
          <Info size={24} className="text-gray-700" />
        </button>
      </header>

      {/* Help Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl md:text-2xl font-bold text-purple-500 mb-4 font-[Inter]">
              What is the Pickle Jar Method?
            </h3>
            <p className="text-gray-700 text-sm md:text-lg mb-4">
              The Pickle Jar Method is a time management technique that helps
              you prioritize tasks. Major tasks (big pickles) fill the jar
              first, followed by minor tasks (small pickles) that fit around
              them.
            </p>
            <h4 className="text-lg md:text-xl font-semibold text-purple-500 mb-2 font-[Inter]">
              How to Play
            </h4>
            <ul className="list-disc list-inside text-gray-700 text-sm md:text-lg">
              <li>Add tasks and earn points.</li>
              <li>Complete tasks for bigger rewards.</li>
              <li>Maintain a streak for bonus points!</li>
              <li>Level up to unlock badges and bonuses.</li>
              <li>Check your summary and ranking!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="">
        {/* Left Side: Pickle Jar Visualization and Gamification Stats */}
        <aside className="w-full  bg-white rounded-2xl shadow-lg p-4 md:p-6 space-y-6 md:space-y-8 sticky top-20 h-fit max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Pickle Jar Visualization */}
          <section className="flex flex-col items-center">
            <h2 className="text-lg md:text-2xl font-bold text-purple-700 mb-4 font-[Inter]">
              Your Pickle Jar
            </h2>
            <div className="relative w-full max-w-[200px] h-[250px] flex items-center justify-center">
              <div className="relative w-24 md:w-32 h-[180px] md:h-[200px] bg-gradient-to-b from-purple-200 to-purple-400 rounded-t-full rounded-b-md opacity-70 border-4 border-purple-700 shadow-lg"></div>
              {tasks
                .filter((task) => !task.completed)
                .map((task, index) => (
                  <div
                    key={task.id}
                    className={`absolute transition-all duration-500 transform ${
                      task.isMajor
                        ? "w-10 md:w-14 h-14 md:h-20 bg-purple-600 rounded-tl-[50%] rounded-br-[50%]"
                        : "w-6 md:w-8 h-8 md:h-12 bg-purple-400 rounded-tl-[40%] rounded-br-[40%]"
                    }`}
                    style={{
                      top: `${40 + index * 20}px`,
                      left: task.isMajor
                        ? "calc(50% - 35px)"
                        : "calc(50% - 15px)",
                      transform: `rotate(${task.isMajor ? 15 : -15}deg) scale(${
                        task.completed ? 0 : 1
                      })`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 opacity-50 rounded-tl-[50%] rounded-br-[50%]" />
                  </div>
                ))}
            </div>
            <p className="mt-4 text-gray-600 text-center font-[Inter] text-sm">
              Major tasks (big pickles) fill first, minor tasks (small pickles)
              fit around them.
            </p>
          </section>

          {/* Gamification Stats */}
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-3 font-[Inter]">
              Your Progress
            </h3>
            <p className="text-gray-700 text-sm md:text-lg">Level: {level}</p>
            <p className="text-gray-700 text-sm md:text-lg">Points: {points}</p>
            <p className="text-gray-700 text-sm md:text-lg">
              Streak: {streak} days
            </p>
            <div className="mt-3">
              <h4 className="text-md md:text-lg font-semibold text-purple-600">
                Badges
              </h4>
              {badges.length > 0 ? (
                <ul className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {badges.map((badge, index) => (
                    <li
                      key={index}
                      className="bg-yellow-500 text-white p-2 rounded-lg text-sm"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm md:text-lg">
                  No badges yet!
                </p>
              )}
            </div>
            <div className="mt-3">
              <h4 className="text-md md:text-lg font-semibold text-purple-600">
                Rewards
              </h4>
              {rewards.length > 0 ? (
                <ul className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {rewards.map((reward, index) => (
                    <li
                      key={index}
                      className="bg-green-500 text-white p-2 rounded-lg text-sm"
                    >
                      {reward}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm md:text-lg">
                  No rewards yet!
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Right Side: Task Management and Other Pages */}
        <main className="w-full flex flex-col gap-6 md:gap-8 h-full overflow-y-auto overflow-x-hidden">
          {/* Navigation */}
          <div className="flex gap-6 mb-4 sticky top-20 bg-white z-10 p-2 rounded-lg shadow-md w-full">
            <button
              onClick={() => setCurrentPage("tasks")}
              className={`flex-1 px-4 py-2 rounded-lg text-md md:text-lg font-semibold ${
                currentPage === "tasks"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-200 text-purple-700 hover:bg-purple-300"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setCurrentPage("summary")}
              className={`flex-1 px-4 py-2 rounded-lg text-md md:text-lg font-semibold ${
                currentPage === "summary"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-200 text-purple-700 hover:bg-purple-300"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setCurrentPage("ranking")}
              className={`flex-1 px-4 py-2 rounded-lg text-md md:text-lg font-semibold ${
                currentPage === "ranking"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-200 text-purple-700 hover:bg-purple-300"
              }`}
            >
              Ranking
            </button>
          </div>

          {/* Tasks Page */}
          {currentPage === "tasks" && (
            <>
              {/* Task Input */}
              <section className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mt-5">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl mt-5 font-bold text-purple-600 font-[Inter]">
                    Add a Task
                  </h2>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter a task..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-md md:text-lg"
                  />
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Add a description (optional)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-md md:text-lg resize-none h-16 md:h-20"
                  />
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <label className="flex items-center text-gray-700 text-md md:text-lg">
                      <input
                        type="radio"
                        checked={isMajor}
                        onChange={() => setIsMajor(true)}
                        className="mr-2 text-purple-500 focus:ring-purple-600 w-4 h-4 md:w-5 md:h-5"
                      />
                      Major Task
                    </label>
                    <label className="flex items-center text-gray-700 text-md md:text-lg">
                      <input
                        type="radio"
                        checked={!isMajor}
                        onChange={() => setIsMajor(false)}
                        className="mr-2 text-purple-500 focus:ring-purple-600 w-4 h-4 md:w-5 md:h-5"
                      />
                      Minor Task
                    </label>
                  </div>
                  <button
                    onClick={handleAddTask}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md text-md md:text-lg"
                  >
                    Add Task
                  </button>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex-1 overflow-x-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <h2 className="text-xl md:text-3xl font-bold text-purple-600 font-[Inter]">
                    Your Tasks
                  </h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-md md:text-lg"
                  >
                    <option value="all">All</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="tasks">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto overflow-x-hidden"
                      >
                        {filteredTasks.length === 0 ? (
                          <p className="text-gray-600 font-[Inter] text-center text-md md:text-lg">
                            No tasks to display.
                          </p>
                        ) : (
                          filteredTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
                                    task.isMajor
                                      ? "bg-purple-100"
                                      : "bg-purple-50"
                                  } ${
                                    task.completed
                                      ? "line-through text-gray-500"
                                      : "text-gray-800"
                                  } w-full break-words`}
                                >
                                  {editingTask && editingTask.id === task.id ? (
                                    <div className="w-full flex flex-col space-y-4">
                                      <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) =>
                                          setEditText(e.target.value)
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-md md:text-lg"
                                      />
                                      <textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                          setEditDescription(e.target.value)
                                        }
                                        placeholder="Add a description (optional)..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-md md:text-lg resize-none h-16 md:h-20"
                                      />
                                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <label className="flex items-center text-gray-700 text-md md:text-lg">
                                          <input
                                            type="radio"
                                            checked={editIsMajor}
                                            onChange={() =>
                                              setEditIsMajor(true)
                                            }
                                            className="mr-2 text-purple-600 focus:ring-purple-500 w-4 h-4 md:w-5 md:h-5"
                                          />
                                          Major
                                        </label>
                                        <label className="flex items-center text-gray-700 text-md md:text-lg">
                                          <input
                                            type="radio"
                                            checked={!editIsMajor}
                                            onChange={() =>
                                              setEditIsMajor(false)
                                            }
                                            className="mr-2 text-purple-600 focus:ring-purple-500 w-4 h-4 md:w-5 md:h-5"
                                          />
                                          Minor
                                        </label>
                                      </div>
                                      <div className="flex space-x-3">
                                        <button
                                          onClick={() =>
                                            handleSaveEdit(task.id)
                                          }
                                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-md md:text-lg"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingTask(null)}
                                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-md md:text-lg"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <span className="text-purple-700 font-semibold text-sm md:text-lg">
                                            #{index + 1}
                                          </span>
                                          <span className="flex-1 font-[Inter] text-md md:text-lg">
                                            {task.content}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2 md:space-x-4">
                                          <button
                                            onClick={() =>
                                              toggleTaskDescription(task.id)
                                            }
                                            className="text-gray-600 hover:text-gray-800"
                                            title={
                                              expandedTasks[task.id]
                                                ? "Hide Description"
                                                : "Show Description"
                                            }
                                          >
                                            {expandedTasks[task.id] ? (
                                              <FaChevronUp size={16} />
                                            ) : (
                                              <FaChevronDown size={16} />
                                            )}
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleCompleteTask(task.id)
                                            }
                                            className="text-purple-600 hover:text-purple-800"
                                            title={
                                              task.completed
                                                ? "Undo"
                                                : "Complete"
                                            }
                                          >
                                            {task.completed ? (
                                              <FaUndo size={18} />
                                            ) : (
                                              <FaCheck size={18} />
                                            )}
                                          </button>
                                          <button
                                            onClick={() => handleEditTask(task)}
                                            className="text-gray-600 hover:text-gray-800"
                                            title="Edit"
                                          >
                                            <FaEdit size={18} />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteTask(task.id)
                                            }
                                            className="text-red-500 hover:text-red-600"
                                            title="Delete"
                                          >
                                            <FaTrash size={18} />
                                          </button>
                                        </div>
                                      </div>
                                      {expandedTasks[task.id] &&
                                        task.description && (
                                          <p className="text-gray-600 text-sm md:text-md mt-2">
                                            {task.description}
                                          </p>
                                        )}
                                    </div>
                                  )}
                                </li>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </section>
            </>
          )}

          {/* Summary Page */}
          {currentPage === "summary" && (
            <section className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex-1 overflow-x-hidden">
              <h2 className="text-xl md:text-3xl mt-8 font-bold text-purple-600 mb-4 md:mb-6 font-[Inter]">
                Task Summary
              </h2>
              <ul className="text-gray-700 text-md md:text-lg space-y-4">
                <li>
                  <span className="font-semibold">Total Tasks:</span>{" "}
                  {getSummaryData().totalTasks}
                </li>
                <li>
                  <span className="font-semibold">Completed Tasks:</span>{" "}
                  {getSummaryData().completedTasks}
                </li>
                <li>
                  <span className="font-semibold">Major Tasks:</span>{" "}
                  {getSummaryData().majorTasks}
                </li>
                <li>
                  <span className="font-semibold">Minor Tasks:</span>{" "}
                  {getSummaryData().minorTasks}
                </li>
                <li>
                  <span className="font-semibold">Streak:</span>{" "}
                  {getSummaryData().streak} days
                </li>
                <li>
                  <span className="font-semibold">Completion Rate:</span>{" "}
                  {totalTasks > 0
                    ? ((completedTasks / totalTasks) * 100).toFixed(1)
                    : 0}
                  %
                </li>
              </ul>
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-2">
                  Progress Overview
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </section>
          )}

          {/* Ranking Page */}
          {currentPage === "ranking" && (
            <section className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex-1 overflow-x-hidden">
              <h2 className="text-xl mt-8 md:text-3xl font-bold text-purple-600 mb-4 md:mb-6 font-[Inter]">
                Task Ranking
              </h2>
              <ul className="text-gray-700 text-md md:text-lg space-y-4">
                {getRankingData().map((rank, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-purple-700 font-semibold text-lg">
                      #{index + 1}
                    </span>
                    <span>
                      {rank.type}: {rank.completed}/{rank.total} (
                      {rank.completionRate.toFixed(1)}%)
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${rank.completionRate}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-2">
                  Your Rewards
                </h3>
                {rewards.length > 0 ? (
                  <ul className="space-y-2">
                    {rewards.map((reward, index) => (
                      <li
                        key={index}
                        className="bg-green-100 text-green-700 p-2 rounded-lg text-sm md:text-md"
                      >
                        {reward}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm md:text-md">
                    Complete tasks to earn rewards!
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mt-6 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-md md:text-lg shadow-md self-center"
          >
            Reset App
          </button>
        </main>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Pickle;
