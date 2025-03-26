import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Pareto80_20() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskValue, setTaskValue] = useState('');
  const [editingTask, setEditingTask] = useState(null); // { id, name, value }
  const [showVisualization, setShowVisualization] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false); // Info modal state
  const [formError, setFormError] = useState(''); // For validation errors

  // Load tasks from local storage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('paretoTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to local storage on update
  useEffect(() => {
    localStorage.setItem('paretoTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    setFormError('');

    if (!taskName.trim() || !taskValue.trim()) {
      setFormError('Please enter both a task name and an impact value.');
      return;
    }

    const value = parseFloat(taskValue);
    if (isNaN(value) || value <= 0) {
      setFormError('Please enter a valid positive number for the impact value.');
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      value,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskName('');
    setTaskValue('');
  };

  // Toggle task completion
  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
      }
    }
  };

  // Begin editing a task
  const startEditingTask = (task) => {
    setEditingTask({ id: task.id, name: task.name, value: task.value });
  };

  // Save the edited task
  const saveEditedTask = () => {
    setFormError('');
    const updatedName = editingTask.name.trim();
    const updatedValue = parseFloat(editingTask.value);
    if (!updatedName || isNaN(updatedValue) || updatedValue <= 0) {
      setFormError('Please enter a valid task name and a positive impact value.');
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? { ...task, name: updatedName, value: updatedValue }
          : task
      )
    );
    setEditingTask(null);
  };

  // Calculate total impact from incomplete tasks
  const totalValue = tasks
    .filter((task) => !task.completed)
    .reduce((sum, t) => sum + t.value, 0);

  // Sort incomplete tasks by descending impact
  const sortedTasks = [...tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => b.value - a.value);

  // Determine tasks making up ~80% of total impact
  let cumulative = 0;
  let vitalTasks = [];
  let trivialTasks = [];
  for (let i = 0; i < sortedTasks.length; i++) {
    const task = sortedTasks[i];
    cumulative += task.value;
    if (cumulative <= 0.8 * totalValue) {
      vitalTasks.push(task);
    } else {
      trivialTasks.push(task);
    }
  }

  // Pie chart data (only incomplete tasks)
  const vitalImpact = vitalTasks.reduce((sum, t) => sum + t.value, 0);
  const trivialImpact = trivialTasks.reduce((sum, t) => sum + t.value, 0);
  const chartData = {
    labels: ['Vital Few (20%)', 'Trivial Many (80%)'],
    datasets: [
      {
        data: [vitalImpact, trivialImpact],
        backgroundColor: ['#8B5CF6', '#D1D5DB'],
        borderColor: ['#8B5CF6', '#D1D5DB'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-12 flex items-center justify-center">
      <div className="max-w-full md:max-w-6xl w-full bg-white rounded-2xl shadow-xl p-4 md:p-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            80/20 Method
          </h1>
          <button
            onClick={() => setShowInfoModal(true)}
            className="relative bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 text-2xl md:text-3xl transform hover:scale-110 mt-4 md:mt-0"
            title="How it works"
          >
            ?
            <span className="absolute inset-0 rounded-full bg-purple-500 opacity-25 animate-ping"></span>
          </button>
        </div>

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-5xl w-full shadow-2xl border-t-4 border-purple-500 max-h-[80vh] flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Understanding the 80/20 Rule
              </h2>
              <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
                <div className="space-y-6 text-gray-700 text-base md:text-lg">
                  <div>
                    <h3 className="text-2xl font-semibold text-purple-700 mb-3">
                      What is the 80/20 Rule?
                    </h3>
                    <p>
                      The 80/20 Rule, also known as the Pareto Principle, states that 80% of your results often come from just 20% of your efforts. In this app, tasks are prioritized so that the "Vital Few" (approximately 20% of tasks) contribute to roughly 80% of the total impact.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-purple-700 mb-3">
                      Benefits of the 80/20 Rule
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Prioritization:</strong> Focus on the tasks that truly matter.</li>
                      <li><strong>Efficiency:</strong> Reduce time spent on low-value tasks.</li>
                      <li><strong>Clarity:</strong> Understand what drives the majority of your results.</li>
                      <li><strong>Stress Reduction:</strong> Achieve more with less effort.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-purple-700 mb-3">
                      How to Use This App
                    </h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><strong>Add Tasks:</strong> Enter a task name and its impact value.</li>
                      <li><strong>View Categorization:</strong> The app sorts tasks by impact and identifies the "Vital Few".</li>
                      <li><strong>Prioritize:</strong> Focus on the high-impact tasks to maximize results.</li>
                      <li><strong>Visualize:</strong> Switch to the Visualization tab to view a pie chart of impact distribution.</li>
                      <li><strong>Manage Tasks:</strong> Edit, delete, or mark tasks as completed.</li>
                      <li><strong>Clear All:</strong> Reset the app using the "Clear All Tasks" button.</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-purple-700 mb-3">
                      Additional Information
                    </h3>
                    <p>
                      The Pareto Principle is widely applicable, from business to personal productivity. Identifying the key 20% of tasks can significantly boost your efficiency.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="flex flex-col space-y-6 mb-12">
          <input
            type="text"
            placeholder="Task name (e.g., 'Develop feature')"
            className={`w-full border rounded-lg px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              formError && !taskName.trim() ? 'border-red-500' : 'border-gray-300'
            }`}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Impact value (e.g., 10)"
            className={`w-full border rounded-lg px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              formError && (!taskValue.trim() || parseFloat(taskValue) <= 0)
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            value={taskValue}
            onChange={(e) => setTaskValue(e.target.value)}
            step="0.1"
            min="0"
          />
          <button
            type="submit"
            className="w-full md:w-1/3 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-10 rounded-lg transition duration-200 text-xl"
          >
            Add Task
          </button>
        </form>

        {/* Form Error Message */}
        {formError && (
          <p className="text-red-500 text-xl text-center mb-8">{formError}</p>
        )}

        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
          <button
            onClick={() => setShowVisualization(false)}
            className={`px-10 py-4 rounded-lg font-semibold transition duration-200 text-xl ${
              !showVisualization
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setShowVisualization(true)}
            className={`px-10 py-4 rounded-lg font-semibold transition duration-200 text-xl ${
              showVisualization
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Visualization
          </button>
        </div>

        {/* Main Content */}
        {showVisualization ? (
          <div className="bg-gray-50 p-8 md:p-14 rounded-lg shadow">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-800 text-center">
              Impact Distribution
            </h2>
            {totalValue === 0 ? (
              <p className="text-gray-600 text-center text-xl">
                No tasks added yet.
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 md:w-[500px] md:h-[500px]">
                  <Pie data={chartData} />
                </div>
                <div className="mt-8 text-center text-gray-700">
                  <p className="text-xl">
                    <strong>Vital Few Impact:</strong> {vitalImpact.toFixed(1)} (
                    {totalValue !== 0 ? ((vitalImpact / totalValue) * 100).toFixed(1) : '0'}%)
                  </p>
                  <p className="text-xl">
                    <strong>Trivial Many Impact:</strong> {trivialImpact.toFixed(1)} (
                    {totalValue !== 0 ? ((trivialImpact / totalValue) * 100).toFixed(1) : '0'}%)
                  </p>
                  <p className="text-lg text-gray-600 mt-4">
                    The vital few tasks drive most of your results.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Vital Few (20%) */}
            <div className="bg-gray-50 p-8 md:p-14 rounded-lg shadow">
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-purple-700">
                Vital Few (20%) Tasks
              </h2>
              {vitalTasks.length === 0 ? (
                <p className="text-gray-600 text-xl">
                  No high-impact tasks yet.
                </p>
              ) : (
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
                  <ul className="space-y-6">
                    {vitalTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow w-full"
                      >
                        {editingTask && editingTask.id === task.id ? (
                          <div className="flex flex-col space-y-4 w-full">
                            <input
                              type="text"
                              value={editingTask.name}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, name: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded-lg px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                              type="number"
                              value={editingTask.value}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, value: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded-lg px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                              step="0.1"
                              min="0"
                            />
                            <div className="flex space-x-4">
                              <button
                                onClick={saveEditedTask}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-xl"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingTask(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-xl"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`text-xl font-medium text-gray-800 ${
                                task.completed ? 'line-through text-gray-500' : ''
                              }`}
                            >
                              {task.name}
                            </span>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg text-gray-500">
                                Impact: {task.value}
                              </span>
                              <button
                                onClick={() => handleToggleComplete(task.id)}
                                className="transition duration-200 hover:text-green-600 text-gray-600"
                                title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                              >
                                <FaCheck size={24} />
                              </button>
                              <button
                                onClick={() => startEditingTask(task)}
                                className="text-purple-500 hover:text-purple-700 transition duration-200"
                                title="Edit"
                              >
                                <FaEdit size={24} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-500 hover:text-red-600 transition duration-200"
                                title="Delete"
                              >
                                <FaTrash size={24} />
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trivial Many (80%) */}
            <div className="bg-gray-50 p-8 md:p-14 rounded-lg shadow">
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-700">
                Trivial Many (80%) Tasks
              </h2>
              {trivialTasks.length === 0 ? (
                <p className="text-gray-600 text-xl">
                  No low-impact tasks yet.
                </p>
              ) : (
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
                  <ul className="space-y-6">
                    {trivialTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow w-full"
                      >
                        {editingTask && editingTask.id === task.id ? (
                          <div className="flex flex-col space-y-4 w-full">
                            <input
                              type="text"
                              value={editingTask.name}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, name: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded-lg px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                              type="number"
                              value={editingTask.value}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, value: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded-lg px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                              step="0.1"
                              min="0"
                            />
                            <div className="flex space-x-4">
                              <button
                                onClick={saveEditedTask}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-xl"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingTask(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-xl"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`text-xl font-medium text-gray-800 ${
                                task.completed ? 'line-through text-gray-500' : ''
                              }`}
                            >
                              {task.name}
                            </span>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg text-gray-500">
                                Impact: {task.value}
                              </span>
                              <button
                                onClick={() => handleToggleComplete(task.id)}
                                className="transition duration-200 hover:text-green-600 text-gray-600"
                                title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                              >
                                <FaCheck size={24} />
                              </button>
                              <button
                                onClick={() => startEditingTask(task)}
                                className="text-purple-500 hover:text-purple-700 transition duration-200"
                                title="Edit"
                              >
                                <FaEdit size={24} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-500 hover:text-red-600 transition duration-200"
                                title="Delete"
                              >
                                <FaTrash size={24} />
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {tasks.some((task) => task.completed) && (
              <div className="bg-gray-50 p-8 md:p-14 rounded-lg shadow">
                <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-700">
                  Completed Tasks
                </h2>
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
                  <ul className="space-y-6">
                    {tasks
                      .filter((task) => task.completed)
                      .map((task) => (
                        <li
                          key={task.id}
                          className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow w-full"
                        >
                          <span className="text-gray-500 line-through text-xl">
                            {task.name}
                          </span>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg text-gray-500">
                              Impact: {task.value}
                            </span>
                            <button
                              onClick={() => handleToggleComplete(task.id)}
                              className="hover:text-green-600 text-gray-600 transition duration-200"
                              title="Mark as Incomplete"
                            >
                              <FaCheck size={24} />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="hover:text-red-600 text-red-500 transition duration-200"
                              title="Delete"
                            >
                              <FaTrash size={24} />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="mt-12 text-center text-gray-700">
          <p className="text-2xl font-semibold">
            <strong>Total Impact (Incomplete Tasks):</strong> {totalValue.toFixed(1)}
          </p>
          <p className="text-xl mt-4">
            {tasks.length} total tasks, {tasks.filter((task) => !task.completed).length} incomplete, with {vitalTasks.length} in the “Vital Few” (~20%).
          </p>
        </div>

        {/* Clear All Tasks Button */}
        {tasks.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all tasks?')) {
                  setTasks([]);
                  setEditingTask(null);
                }
              }}
              className="w-full md:w-1/3 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-10 rounded-lg transition duration-200 text-xl"
            >
              Clear All Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pareto80_20;
