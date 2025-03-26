import { Info } from 'lucide-react';
import React, { useState, useEffect } from 'react';

function TaskBatchingApp() {
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('batchTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showInfo, setShowInfo] = useState(false);
  const [filter, setFilter] = useState('all');
  const [timers, setTimers] = useState({});
  const [editingTask, setEditingTask] = useState(null);

  const categories = ['Emails', 'Calls', 'Writing', 'Admin', 'Errands', 'Communication', 'Creative task'];

  useEffect(() => {
    localStorage.setItem('batchTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() && category && startTime && endTime) {
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
        setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? taskObj : task)));
        setEditingTask(null);
      } else {
        setTasks((prev) => [...prev, taskObj]);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setNewTask('');
    setCategory('');
    setStartTime('');
    setEndTime('');
    setPriority('medium');
    setNotes('');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
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
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      setTasks([]);
      localStorage.removeItem('batchTasks');
      setTimers({});
    }
  };

  const startTimer = (category) => {
    if (!timers[category]) {
      setTimers((prev) => ({
        ...prev,
        [category]: { time: 0, interval: setInterval(() => {
          setTimers((p) => ({ ...p, [category]: { ...p[category], time: p[category].time + 1 } }));
        }, 1000) }
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
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getBatches = () => {
    const batches = {};
    const filteredTasks = tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    });
    
    filteredTasks.forEach((task) => {
      if (!batches[task.category]) {
        batches[task.category] = [];
      }
      batches[task.category].push(task);
    });
    Object.keys(batches).forEach((cat) => {
      batches[cat].sort((a, b) => a.text.localeCompare(b.text));
    });
    return batches;
  };

  const renderBatch = (category, batchTasks) => {
    const completedTasks = batchTasks.filter((task) => task.completed).length;
    const totalTasks = batchTasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
      <div className="p-4 sm:p-6 rounded-xl shadow-lg w-full bg-gradient-to-br from-white to-purple-50 border border-purple-100">
        <h3 className="text-lg sm:text-2xl font-bold text-black mb-2 capitalize tracking-tight">
          {category}
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 mb-3 font-medium">
          Time: {batchTasks[0]?.timeBlock
            ? `${batchTasks[0].timeBlock.start} - ${batchTasks[0].timeBlock.end}`
            : 'Not scheduled'}
        </p>
        {/* Timer Controls: vertical on mobile, horizontal on larger screens */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <button
            onClick={() => startTimer(category)}
            className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-xs sm:text-sm"
          >
            Start
          </button>
          <button
            onClick={() => stopTimer(category)}
            className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm"
          >
            Stop
          </button>
          <span className="font-medium text-gray-700 text-xs sm:text-sm">
            {timers[category] ? formatTime(timers[category].time) : '00:00'}
          </span>
        </div>
        <div className="mb-4 sm:mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">
            {completedTasks}/{totalTasks} completed
          </p>
        </div>
        {batchTasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col p-3 sm:p-4 mb-3 sm:mb-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <span
                  className={`text-sm sm:text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                >
                  {task.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editTask(task)}
                  className="text-blue-500 hover:text-blue-700 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              Priority: <span className={`font-semibold ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.priority}</span> | 
              Added: {new Date(task.createdAt).toLocaleString()} | 
              {task.notes && <span>Notes: {task.notes}</span>}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const batches = getBatches();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-3 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg">
          <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-black tracking-tight">
            Task Batching
          </h1>
          <button
              onClick={() => setShowInfo(true)}
              className="bg-white p-3 rounded-full hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
              title="Learn about the ABCDE Method"
            >
              <Info size={24} className="text-gray-700" />
            </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleAddTask}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg space-y-3 sm:space-y-4 lg:space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full p-2 sm:p-3 lg:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-xl bg-gray-50"
              />
              <textarea
                placeholder="Task notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 sm:p-3 lg:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm lg:text-lg bg-gray-50 h-16 sm:h-20 lg:h-24 resize-none"
              />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 sm:p-3 lg:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-xl bg-gray-50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 sm:p-3 lg:p-4 border border-purple-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 hover:bg-purple-100 text-sm sm:text-base lg:text-xl transition-all"
                />
                <span className="text-gray-700 text-xs sm:text-sm lg:text-lg font-medium">→</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 sm:p-3 lg:p-4 border border-purple-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 hover:bg-purple-100 text-sm sm:text-base lg:text-xl transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 sm:p-3 lg:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-xl bg-gray-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  type="submit"
                  className="w-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all font-semibold text-sm sm:text-base lg:text-xl shadow-md"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Batches Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-2xl lg:text-4xl font-semibold text-black tracking-tight">
              Your Batches
            </h2>
            {tasks.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-lg bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Show All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={clearAllTasks}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm sm:text-xl shadow-md"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Object.keys(batches).length > 0 ? (
              Object.entries(batches).map(([category, batchTasks]) =>
                renderBatch(category, batchTasks)
              )
            ) : (
              <p className="text-gray-500 italic col-span-full text-center py-6 sm:py-8 lg:py-10 text-sm sm:text-lg lg:text-xl bg-white rounded-xl sm:rounded-2xl shadow-lg">
                No tasks yet. Add some above to get started!
              </p>
            )}
          </div>
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-3 sm:px-4">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-md sm:max-w-lg lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-purple-500">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-black tracking-tight">
                  Task Batching Guide
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-600 hover:text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-sm sm:text-lg lg:text-xl font-semibold text-purple-600 mb-1 sm:mb-2">What is Task Batching?</h4>
                  <p className="text-gray-700 text-xs sm:text-base lg:text-lg">
                    Task batching is a productivity technique where you group similar tasks together and complete them in a dedicated time block. Instead of switching between different types of work, you focus on one category at a time.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg lg:text-xl font-semibold text-purple-600 mb-1 sm:mb-2">Benefits</h4>
                  <ul className="list-disc pl-4 sm:pl-6 text-gray-700 text-xs sm:text-base lg:text-lg space-y-1 sm:space-y-2">
                    <li><strong>Increased Focus:</strong> Less context switching improves concentration</li>
                    <li><strong>Time Savings:</strong> Reduces setup time between tasks</li>
                    <li><strong>Reduced Stress:</strong> Organized approach feels less overwhelming</li>
                    <li><strong>Higher Productivity:</strong> Complete more in less time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg lg:text-xl font-semibold text-purple-600 mb-1 sm:mb-2">How to Use</h4>
                  <ol className="list-decimal pl-4 sm:pl-6 text-gray-700 text-xs sm:text-base lg:text-lg space-y-1 sm:space-y-2">
                    <li>Add tasks with a category and time block</li>
                    <li>Set priorities and add optional notes</li>
                    <li>Work on one batch at a time during its scheduled period</li>
                    <li>Check off tasks or edit them as needed</li>
                    <li>Use filters and timers to manage your workflow</li>
                  </ol>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-4 sm:mt-6 lg:mt-8 w-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all font-semibold text-sm sm:text-base lg:text-xl shadow-md"
              >
                Start Batching!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskBatchingApp;
