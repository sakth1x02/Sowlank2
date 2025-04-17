import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaLightbulb,
  FaRocket,
  FaClock,
  FaListOl,
} from "react-icons/fa";
import { Info } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Confetti from "react-confetti";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Pareto80_20() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskValue, setTaskValue] = useState("");
  const [taskReminder, setTaskReminder] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load data from local storage
  useEffect(() => {
    const savedTasks = localStorage.getItem("paretoTasks");
    const savedPoints = localStorage.getItem("paretoPoints");
    const savedLevel = localStorage.getItem("paretoLevel");
    const savedBadges = localStorage.getItem("paretoBadges");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
  }, []);

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem("paretoTasks", JSON.stringify(tasks));
    localStorage.setItem("paretoPoints", points);
    localStorage.setItem("paretoLevel", level);
    localStorage.setItem("paretoBadges", JSON.stringify(badges));
  }, [tasks, points, level, badges]);

  // Check reminders and trigger alerts
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        if (task.reminder && !task.completed && !task.alerted) {
          const reminderTime = new Date(task.reminder).getTime();
          const now = Date.now();
          if (now >= reminderTime) {
            alert(`Reminder: "${task.name}" is due now!`);
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, alerted: true } : t))
            );
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    setFormError("");

    if (!taskName.trim() || !taskValue.trim()) {
      setFormError("Please enter both a task name and an impact value.");
      return;
    }

    const value = parseFloat(taskValue);
    if (isNaN(value) || value <= 0) {
      setFormError(
        "Please enter a valid positive number for the impact value."
      );
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      value,
      completed: false,
      reminder: taskReminder ? new Date(taskReminder).toISOString() : null,
      alerted: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskName("");
    setTaskValue("");
    setTaskReminder("");
    setPoints((prev) => prev + 10);
    checkLevelUp();
  };

  // Toggle task completion
  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    setPoints((prev) => prev + 25);
    checkLevelUp();
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (editingTask && editingTask.id === id) setEditingTask(null);
    }
  };

  // Start editing a task
  const startEditingTask = (task) => {
    setEditingTask({
      id: task.id,
      name: task.name,
      value: task.value,
      reminder: task.reminder
        ? new Date(task.reminder).toISOString().slice(0, 16)
        : "",
    });
  };

  // Save edited task
  const saveEditedTask = () => {
    setFormError("");
    const updatedName = editingTask.name.trim();
    const updatedValue = parseFloat(editingTask.value);
    if (!updatedName || isNaN(updatedValue) || updatedValue <= 0) {
      setFormError(
        "Please enter a valid task name and a positive impact value."
      );
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              name: updatedName,
              value: updatedValue,
              reminder: editingTask.reminder
                ? new Date(editingTask.reminder).toISOString()
                : null,
            }
          : task
      )
    );
    setEditingTask(null);
  };

  // Handle drag-and-drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  // Gamification: Check for level up
  const checkLevelUp = () => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    if (
      tasks.filter((t) => t.completed).length >= 5 &&
      !badges.includes("Task Master")
    ) {
      setBadges((prev) => [...prev, "Task Master"]);
    }
  };

  // Pareto calculations
  const totalValue = tasks
    .filter((task) => !task.completed)
    .reduce((sum, t) => sum + t.value, 0);
  const sortedTasks = [...tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => b.value - a.value);

  // Identify the "Vital Few" (~20% of tasks)
  const vitalFewCount = Math.ceil(sortedTasks.length * 0.2); // Top 20% of tasks
  const vitalTasks = sortedTasks.slice(0, vitalFewCount);
  const trivialTasks = sortedTasks.slice(vitalFewCount);

  // Pie chart data
  const vitalImpact = vitalTasks.reduce((sum, t) => sum + t.value, 0);
  const trivialImpact = trivialTasks.reduce((sum, t) => sum + t.value, 0);
  const chartData = {
    labels: ["Vital Few (~20%)", "Trivial Many (~80%)"],
    datasets: [
      {
        data: [vitalImpact, trivialImpact],
        backgroundColor: ["#8B5CF6", "#D1D5DB"],
        borderColor: ["#8B5CF6", "#D1D5DB"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
      {showConfetti && <Confetti />}
      {/* Header */}
      <header className="bg-white shadow-lg p-6 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-4xl font-extrabold text-purple-500">
          80/20 Method
        </h1>
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-3 rounded-full bg-purple-200 hover:bg-purple-300 transition-all"
        >
          <Info size={28} className="text-purple-500" />
        </button>
      </header>

      {/* Main Layout */}
      <div className="">
        {/* Sidebar: Gamification */}
        <aside className="w-full  bg-white shadow-lg p-6 flex-shrink-0 overflow-y-auto border-r border-gray-200">
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
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
                    Earn badges by completing tasks!
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Add Task Form */}
          <form
            onSubmit={handleAddTask}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4"
          >
            <input
              type="text"
              placeholder="Task name (e.g., 'Develop feature')"
              className={`w-full border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formError && !taskName.trim()
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Impact value (e.g., 10)"
              className={`w-full border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formError && (!taskValue.trim() || parseFloat(taskValue) <= 0)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={taskValue}
              onChange={(e) => setTaskValue(e.target.value)}
              step="0.1"
              min="0"
            />
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={taskReminder}
              onChange={(e) => setTaskReminder(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Add Task
            </button>
            {formError && (
              <p className="text-red-500 text-center">{formError}</p>
            )}
          </form>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowVisualization(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                !showVisualization
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setShowVisualization(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                showVisualization
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Visualization
            </button>
          </div>

          {/* Content */}
          {showVisualization ? (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
                Impact Distribution
              </h2>
              {totalValue === 0 ? (
                <p className="text-gray-600 text-center">
                  No incomplete tasks added yet.
                </p>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64 md:w-96 md:h-96">
                    <Pie data={chartData} />
                  </div>
                  <div className="mt-6 text-center text-gray-700">
                    <p>
                      <strong>Vital Few Impact:</strong>{" "}
                      {vitalImpact.toFixed(1)} (
                      {totalValue !== 0
                        ? ((vitalImpact / totalValue) * 100).toFixed(1)
                        : "0"}
                      %)
                    </p>
                    <p>
                      <strong>Trivial Many Impact:</strong>{" "}
                      {trivialImpact.toFixed(1)} (
                      {totalValue !== 0
                        ? ((trivialImpact / totalValue) * 100).toFixed(1)
                        : "0"}
                      %)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-8">
                {/* Vital Few */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-purple-500">
                    Vital Few (~20%) Tasks
                  </h2>
                  <Droppable droppableId="vitalTasks">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4 min-h-[100px]"
                      >
                        {vitalTasks.length === 0 ? (
                          <p className="text-gray-600">
                            No high-impact tasks yet.
                          </p>
                        ) : (
                          vitalTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-yellow-100 p-4 rounded-lg shadow flex flex-col space-y-2"
                                >
                                  {editingTask && editingTask.id === task.id ? (
                                    <>
                                      <input
                                        type="text"
                                        value={editingTask.name}
                                        onChange={(e) =>
                                          setEditingTask({
                                            ...editingTask,
                                            name: e.target.value,
                                          })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                      />
                                      <input
                                        type="number"
                                        value={editingTask.value}
                                        onChange={(e) =>
                                          setEditingTask({
                                            ...editingTask,
                                            value: e.target.value,
                                          })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                        step="0.1"
                                        min="0"
                                      />
                                      <input
                                        type="datetime-local"
                                        value={editingTask.reminder}
                                        onChange={(e) =>
                                          setEditingTask({
                                            ...editingTask,
                                            reminder: e.target.value,
                                          })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                      />
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={saveEditedTask}
                                          className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingTask(null)}
                                          className="bg-gray-500 text-white px-3 py-1 rounded-lg"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                          {task.name}
                                        </span>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              handleToggleComplete(task.id)
                                            }
                                            className="text-green-500 hover:text-green-600"
                                          >
                                            <FaCheck />
                                          </button>
                                          <button
                                            onClick={() =>
                                              startEditingTask(task)
                                            }
                                            className="text-purple-500 hover:text-purple-600"
                                          >
                                            <FaEdit />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteTask(task.id)
                                            }
                                            className="text-red-500 hover:text-red-600"
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        Impact: {task.value}
                                      </p>
                                      {task.reminder && (
                                        <p className="text-sm text-gray-500">
                                          Reminder:{" "}
                                          {new Date(
                                            task.reminder
                                          ).toLocaleString()}
                                        </p>
                                      )}
                                    </>
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
                </div>

                {/* Trivial Many */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    Trivial Many (~80%) Tasks
                  </h2>
                  <Droppable droppableId="trivialTasks">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4 min-h-[100px]"
                      >
                        {trivialTasks.length === 0 ? (
                          <p className="text-gray-600">
                            No low-impact tasks yet.
                          </p>
                        ) : (
                          trivialTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-100 p-4 rounded-lg shadow flex flex-col space-y-2"
                                >
                                  {editingTask && editingTask.id === task.id ? (
                                    <>
                                      <input
                                        type="text"
                                        value={editingTask.name}
                                        onChange={(e) =>
                                          setEditingTask({
                                            ...editingTask,
                                            name: e.target.value,
                                          })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                      />
                                      <input
                                        type="number"
                                        value={editingTask.value}
                                        onChange={(e) =>
                                          setEditingTask({
                                            ...editingTask,
                                            value: e.target.value,
                                          })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                        step="0.1"
                                        min="0"
                                      />
                                      <input
                                        type="datetime-local"
                                        value={editingTask.reminder}
                                        onChange={(e) =>
                                          setEditingTask({
                                            ...editingTask,
                                            reminder: e.target.value,
                                          })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                      />
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={saveEditedTask}
                                          className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingTask(null)}
                                          className="bg-gray-500 text-white px-3 py-1 rounded-lg"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                          {task.name}
                                        </span>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              handleToggleComplete(task.id)
                                            }
                                            className="text-green-500 hover:text-green-600"
                                          >
                                            <FaCheck />
                                          </button>
                                          <button
                                            onClick={() =>
                                              startEditingTask(task)
                                            }
                                            className="text-purple-500 hover:text-purple-600"
                                          >
                                            <FaEdit />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteTask(task.id)
                                            }
                                            className="text-red-500 hover:text-red-600"
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        Impact: {task.value}
                                      </p>
                                      {task.reminder && (
                                        <p className="text-sm text-gray-500">
                                          Reminder:{" "}
                                          {new Date(
                                            task.reminder
                                          ).toLocaleString()}
                                        </p>
                                      )}
                                    </>
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
                </div>

                {/* Completed Tasks */}
                {tasks.some((task) => task.completed) && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                      Completed Tasks
                    </h2>
                    <Droppable droppableId="completedTasks">
                      {(provided) => (
                        <ul
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4 min-h-[100px]"
                        >
                          {tasks
                            .filter((task) => task.completed)
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-green-100 p-4 rounded-lg shadow flex flex-col space-y-2"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-500 line-through">
                                        {task.name}
                                      </span>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() =>
                                            handleToggleComplete(task.id)
                                          }
                                          className="text-green-500 hover:text-green-600"
                                        >
                                          <FaCheck />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteTask(task.id)
                                          }
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Impact: {task.value}
                                    </p>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>
            </DragDropContext>
          )}

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 text-center">
            <p className="text-xl font-semibold">
              Total Impact (Incomplete Tasks): {totalValue.toFixed(1)}
            </p>
            <p className="text-lg mt-2">
              {tasks.length} total tasks,{" "}
              {tasks.filter((task) => !task.completed).length} incomplete, with{" "}
              {vitalTasks.length} in the "Vital Few" (~20%).
            </p>
          </div>

          {/* Clear All Tasks */}
          {tasks.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to clear all tasks?")
                  ) {
                    setTasks([]);
                    setEditingTask(null);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Clear All Tasks
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding the 80/20 Rule
            </h2>
            <div className="space-y-6 text-gray-700">
              {/* What is the 80/20 Rule */}
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <FaLightbulb className="text-yellow-500 mr-2" /> What is the
                  80/20 Rule?
                </h3>
                <p className="mt-2">
                  The 80/20 Rule, also known as the{" "}
                  <strong>Pareto Principle</strong>, states that approximately
                  80% of your results come from just 20% of your efforts. For
                  example, in a list of tasks, the top 20% (the "Vital Few")
                  typically contribute to 80% of the total impact or value,
                  while the remaining 80% (the "Trivial Many") contribute only
                  20%.
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <FaRocket className="text-purple-500 mr-2" /> Benefits of the
                  80/20 Rule
                </h3>
                <ul className="mt-2 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Improved Productivity:</strong> Focus on high-impact
                    tasks to maximize output with less effort.
                  </li>
                  <li>
                    <strong>Better Time Management:</strong> Reduce time spent
                    on low-value activities.
                  </li>
                  <li>
                    <strong>Enhanced Decision-Making:</strong> Prioritize what
                    truly matters for better outcomes.
                  </li>
                  <li>
                    <strong>Stress Reduction:</strong> Achieve more by
                    concentrating on fewer, more effective tasks.
                  </li>
                </ul>
              </div>

              {/* How to Use */}
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <FaClock className="text-blue-500 mr-2" /> How to Use the
                  80/20 Rule
                </h3>
                <ol className="mt-2 space-y-2 list-decimal list-inside">
                  <li>
                    <strong>List Your Tasks:</strong> Add tasks with a name and
                    an impact value (e.g., revenue generated, time saved).
                  </li>
                  <li>
                    <strong>Set Reminders (Optional):</strong> Use the datetime
                    picker to schedule alerts for deadlines.
                  </li>
                  <li>
                    <strong>Analyze Impact:</strong> The app automatically sorts
                    tasks by impact and identifies the top ~20% as the "Vital
                    Few."
                  </li>
                  <li>
                    <strong>Prioritize:</strong> Focus on completing the "Vital
                    Few" tasks first to achieve 80% of your results.
                  </li>
                  <li>
                    <strong>Visualize:</strong> Switch to the "Visualization"
                    tab to see a pie chart of impact distribution.
                  </li>
                  <li>
                    <strong>Manage:</strong> Drag tasks to reorder, edit, or
                    mark them as completed to earn points.
                  </li>
                </ol>
              </div>

              {/* Gamification */}
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <FaListOl className="text-green-500 mr-2" /> Gamification
                </h3>
                <p className="mt-2">Stay motivated with points and badges:</p>
                <ul className="mt-2 space-y-2 list-disc list-inside">
                  <li>
                    Earn <strong>10 points</strong> for adding a task.
                  </li>
                  <li>
                    Earn <strong>25 points</strong> for completing a task.
                  </li>
                  <li>
                    Level up every <strong>100 points</strong> with a confetti
                    celebration.
                  </li>
                  <li>
                    Unlock the "Task Master" badge after completing 5 tasks.
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pareto80_20;
