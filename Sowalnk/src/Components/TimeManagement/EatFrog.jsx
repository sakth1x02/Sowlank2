import { useState, useEffect } from "react";
import { FaFrog, FaTrash, FaStar, FaRegStar } from "react-icons/fa";

const EatFrog = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      priority,
      completed: false,
      isFrog: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setPriority("medium");
  };

  const toggleFrog = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, isFrog: !task.isFrog };
        }
        return { ...task, isFrog: false };
      })
    );
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-500";
      case "medium":
        return "bg-yellow-100 border-yellow-500";
      case "low":
        return "bg-green-100 border-green-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  return (
    <div className="w-full bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-8">
            <FaFrog className="text-frog-green text-4xl mr-4" />
            <h1 className="text-3xl font-bold text-frog-dark">Eat the Frog</h1>
          </div>

          <form onSubmit={addTask} className="mb-8">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter your task..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-frog-green"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-frog-green"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-400 text-white py-3 rounded-lg hover:bg-frog-dark transition-colors"
            >
              Add Task
            </button>
          </form>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center p-4 border-2 rounded-lg ${getPriorityColor(
                  task.priority
                )} ${task.completed ? "opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="mr-4 h-5 w-5"
                />
                <span
                  className={`flex-1 ${task.completed ? "line-through" : ""}`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => toggleFrog(task.id)}
                  className="mx-2 text-xl"
                  title={
                    task.isFrog
                      ? "Remove frog status"
                      : "Mark as frog (most important task)"
                  }
                >
                  {task.isFrog ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EatFrog;
