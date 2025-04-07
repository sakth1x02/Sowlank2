import React from "react";

function TaskList({
  tasks,
  newTask,
  setNewTask,
  newTaskPriority,
  setNewTaskPriority,
  handleAddTask,
  handleToggleComplete,
  handleDeleteTask,
  handleAssignTask,
  timeBlocks,
  taskAssignments,
  sortOption,
  setSortOption,
  clearAllTasks,
}) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "alphabetical") return a.text.localeCompare(b.text);
    if (sortOption === "priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Task List</h2>
      <form onSubmit={handleAddTask} className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold">Add Task</button>
      </form>
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-2">
        {tasks.length > 0 && (
          <button onClick={clearAllTasks} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold">Clear All Tasks</button>
        )}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="alphabetical">Sort: Alphabetical</option>
          <option value="priority">Sort: Priority (High to Low)</option>
        </select>
      </div>
      {sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div key={task.id} className="flex flex-col p-4 rounded-lg border shadow-md bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="h-5 w-5 text-purple-700 focus:ring-purple-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{task.text}</span>
                    <span className={`text-xs font-semibold ${task.priority === "High" ? "text-red-500" : task.priority === "Medium" ? "text-yellow-500" : "text-green-500"}`}>({task.priority})</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <select
                  value={taskAssignments[task.id] || ""}
                  onChange={(e) => handleAssignTask(task.id, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 flex-1"
                >
                  <option value="">Unassigned</option>
                  {timeBlocks.map((block) => (
                    <option key={block.id} value={block.id}>{block.title}</option>
                  ))}
                </select>
                <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-600 font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center">No tasks added yet.</p>
      )}
    </div>
  );
}

export default TaskList;