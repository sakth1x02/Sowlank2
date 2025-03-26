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
  handleAssignmentChange,
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
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 mb-4 md:mb-6">Task List</h2>
      <form onSubmit={handleAddTask} className="mb-4 md:mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="p-3 md:p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-full text-base md:text-xl"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="p-3 md:p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-base md:text-lg"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-3 md:px-8 md:py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-base md:text-xl shadow-md"
        >
          Add Task
        </button>
      </form>
      <div className="flex flex-col sm:flex-row justify-between mb-4 md:mb-6 gap-2">
        {tasks.length > 0 && (
          <button
            onClick={clearAllTasks}
            className="px-4 py-2 md:px-6 md:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-base md:text-lg shadow-md"
          >
            Clear All Tasks
          </button>
        )}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 text-base md:text-lg"
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
            <div
              key={task.id}
              className="flex flex-col p-4 rounded-lg border shadow-md border-gray-200 bg-gray-50 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="h-5 w-5 md:h-6 md:w-6 text-purple-700 focus:ring-purple-700"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-gray-800 font-medium text-base md:text-xl ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                    <span
                      className={`text-xs md:text-sm font-semibold ${
                        task.priority === "High"
                          ? "text-red-500"
                          : task.priority === "Medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      ({task.priority})
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <select
                  value={taskAssignments[task.id] || ""}
                  onChange={(e) => handleAssignmentChange(task.id, e)}
                  className="p-2 md:p-3 border border-gray-300 rounded-lg text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-purple-700 flex-1"
                >
                  <option value="">Unassigned</option>
                  {timeBlocks.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 text-base md:text-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center text-base md:text-xl">
          No tasks added yet.
        </p>
      )}
    </div>
  );
}

export default TaskList;