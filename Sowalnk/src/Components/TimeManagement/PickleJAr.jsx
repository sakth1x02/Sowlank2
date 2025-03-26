import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaEdit, FaCheck, FaUndo, FaQuestionCircle, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { Info, X } from 'lucide-react';

const Pickle = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('pickleTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isMajor, setIsMajor] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsMajor, setEditIsMajor] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    localStorage.setItem('pickleTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      toast.error('Task cannot be empty!');
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
    setNewTask('');
    setNewTaskDescription('');
    toast.success('Task added successfully!');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
    toast.success('Task reordered!');
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    toast.success(`Task ${tasks.find((task) => task.id === taskId).completed ? 'restored' : 'completed'}!`);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    if (editingTask && editingTask.id === taskId) setEditingTask(null);
    setExpandedTasks((prev) => { const newExpanded = { ...prev }; delete newExpanded[taskId]; return newExpanded; });
    toast.success('Task deleted!');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditText(task.content);
    setEditDescription(task.description || '');
    setEditIsMajor(task.isMajor);
  };

  const handleSaveEdit = (taskId) => {
    if (editText.trim() === '') {
      toast.error('Task cannot be empty!');
      return;
    }
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, content: editText, description: editDescription, isMajor: editIsMajor } : task
    ));
    setEditingTask(null);
    toast.success('Task updated!');
  };

  const toggleTaskDescription = (taskId) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const majorTasks = tasks.filter((task) => task.isMajor).length;
  const minorTasks = tasks.filter((task) => !task.isMajor).length;

  const handleHelpClick = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="p-4 md:p-8 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold font-[Inter] text-black">Pickle Jar</h1>
        <button
              onClick={() => setShowPopup(true)}
              className="bg-white p-3 rounded-full hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
              title="Learn about the ABCDE Method"
            >
              <Info size={24} className="text-gray-700" />
            </button>
      </header>

      {/* Help Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button onClick={handleClosePopup} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl md:text-2xl font-bold text-purple-500 mb-4 font-[Inter]">What is the Pickle Jar Method?</h3>
            <p className="text-gray-700 text-sm md:text-lg mb-4">
              The Pickle Jar Method is a time management technique that helps you prioritize tasks. Imagine your day as a jar, and your tasks as pickles of different sizes...
            </p>
            <h4 className="text-lg md:text-xl font-semibold text-purple-500 mb-2 font-[Inter]">How to Use It</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm md:text-lg">
              <li>Add tasks using the form.</li>
              <li>Mark tasks as Major or Minor.</li>
              <li>Drag and drop tasks to reorder.</li>
              <li>Complete or delete tasks.</li>
              <li>Filter tasks as needed.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 md:p-10 gap-6 md:gap-10">
        {/* Sidebar: Task Management */}
        <div className="w-full lg:w-2/5 bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6 md:space-y-10">
          <h2 className="text-xl md:text-3xl font-bold text-purple-600 font-[Inter]">Add and Prioritize Tasks</h2>

          {/* Task Input */}
          <div className="space-y-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a task..."
              className="w-full p-3 md:p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg md:text-xl"
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              className="w-full p-3 md:p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg md:text-xl resize-none h-20 md:h-24"
            />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <label className="flex items-center text-gray-700 text-lg">
                <input
                  type="radio"
                  checked={isMajor}
                  onChange={() => setIsMajor(true)}
                  className="mr-2 md:mr-4 text-purple-500 focus:ring-purple-600 w-5 h-5 md:w-6 md:h-6"
                />
                Major Task
              </label>
              <label className="flex items-center text-gray-700 text-lg">
                <input
                  type="radio"
                  checked={!isMajor}
                  onChange={() => setIsMajor(false)}
                  className="mr-2 md:mr-4 text-purple-500 focus:ring-purple-600 w-5 h-5 md:w-6 md:h-6"
                />
                Minor Task
              </label>
            </div>
            <button
              onClick={handleAddTask}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 md:py-5 rounded-lg transition-all duration-300 shadow-md text-lg md:text-xl"
            >
              Add Task
            </button>
          </div>

          {/* Task Summary */}
          <div className="bg-purple-50 p-4 md:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-3 md:mb-4 font-[Inter]">Task Summary</h3>
            <ul className="text-gray-700 text-sm md:text-lg space-y-2">
              <li>Total Tasks: {totalTasks}</li>
              <li>Completed Tasks: {completedTasks}</li>
              <li>Major Tasks: {majorTasks}</li>
              <li>Minor Tasks: {minorTasks}</li>
            </ul>
          </div>

          {/* Filter Tasks */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <h3 className="text-lg md:text-2xl font-semibold text-gray-800 font-[Inter]">Tasks</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 md:px-5 md:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-lg"
            >
              <option value="all">All</option>
              <option value="incomplete">Incomplete</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Task List with Drag-and-Drop */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {filteredTasks.length === 0 ? (
                    <p className="text-gray-600 font-[Inter] text-center text-lg">No tasks to display.</p>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 md:p-6 rounded-lg shadow-sm transition-all duration-300 ${
                              task.isMajor ? 'bg-purple-100' : 'bg-purple-50'
                            } ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                          >
                            {editingTask && editingTask.id === task.id ? (
                              <div className="w-full flex flex-col space-y-4">
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                                />
                                <textarea
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  placeholder="Add a description (optional)..."
                                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg resize-none h-20 md:h-24"
                                />
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                                  <label className="flex items-center text-gray-700 text-lg">
                                    <input
                                      type="radio"
                                      checked={editIsMajor}
                                      onChange={() => setEditIsMajor(true)}
                                      className="mr-2 md:mr-4 text-purple-600 focus:ring-purple-500 w-5 h-5 md:w-6 md:h-6"
                                    />
                                    Major
                                  </label>
                                  <label className="flex items-center text-gray-700 text-lg">
                                    <input
                                      type="radio"
                                      checked={!editIsMajor}
                                      onChange={() => setEditIsMajor(false)}
                                      className="mr-2 md:mr-4 text-purple-600 focus:ring-purple-500 w-5 h-5 md:w-6 md:h-6"
                                    />
                                    Minor
                                  </label>
                                </div>
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => handleSaveEdit(task.id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 md:py-4 px-4 md:px-8 rounded-lg transition-all duration-200 text-lg"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingTask(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 md:py-4 px-4 md:px-8 rounded-lg transition-all duration-200 text-lg"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-purple-700 font-semibold text-sm md:text-lg">#{index + 1}</span>
                                    <span className="flex-1 font-[Inter] text-lg">{task.content}</span>
                                  </div>
                                  <div className="flex items-center space-x-3 md:space-x-5">
                                    <button
                                      onClick={() => toggleTaskDescription(task.id)}
                                      className="text-gray-600 hover:text-gray-800"
                                      title={expandedTasks[task.id] ? 'Hide Description' : 'Show Description'}
                                    >
                                      {expandedTasks[task.id] ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                                    </button>
                                    <button
                                      onClick={() => handleCompleteTask(task.id)}
                                      className="text-purple-600 hover:text-purple-800"
                                      title={task.completed ? 'Undo' : 'Complete'}
                                    >
                                      {task.completed ? <FaUndo size={20} /> : <FaCheck size={20} />}
                                    </button>
                                    <button
                                      onClick={() => handleEditTask(task)}
                                      className="text-gray-600 hover:text-gray-800"
                                      title="Edit"
                                    >
                                      <FaEdit size={20} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-500 hover:text-red-600"
                                      title="Delete"
                                    >
                                      <FaTrash size={20} />
                                    </button>
                                  </div>
                                </div>
                                {expandedTasks[task.id] && task.description && (
                                  <p className="text-gray-600 text-sm md:text-lg mt-2">{task.description}</p>
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
        </div>

        {/* Main Section: Pickle Jar Visualization */}
        <div className="w-full lg:flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col items-center">
          <h2 className="text-xl md:text-3xl font-bold text-purple-700 mb-6 md:mb-10 font-[Inter]">Your Pickle Jar</h2>
          <div className="relative w-full max-w-xs md:w-96 h-[400px] md:h-[1000px] flex items-center justify-center">
            {/* Jar Outline */}
            <div className="relative w-48 md:w-64 h-[300px] md:h-[400px] bg-gradient-to-b from-purple-200 to-purple-400 rounded-t-full rounded-b-md opacity-70 border-4 md:border-6 border-purple-700 shadow-lg"></div>

            {/* Tasks as Pickles */}
            {tasks.filter((task) => !task.completed).map((task, index) => (
              <div
                key={task.id}
                className={`absolute transition-all duration-500 transform ${
                  task.isMajor
                    ? 'w-20 md:w-32 h-32 md:h-48 bg-purple-600 rounded-tl-[50%] rounded-br-[50%]'
                    : 'w-12 md:w-16 h-16 md:h-24 bg-purple-400 rounded-tl-[40%] rounded-br-[40%]'
                }`}
                style={{
                  top: `${80 + index * 40}px`,
                  left: task.isMajor ? '60px' : '100px',
                  transform: `rotate(${task.isMajor ? 15 : -15}deg) scale(${task.completed ? 0 : 1})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 opacity-50 rounded-tl-[50%] rounded-br-[50%]" />
              </div>
            ))}
          </div>
          <p className="mt-6 md:mt-10 text-gray-600 text-center font-[Inter] text-sm md:text-xl">
            Major tasks (big pickles) go first, minor tasks (small pickles) fit around them.
          </p>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Pickle;