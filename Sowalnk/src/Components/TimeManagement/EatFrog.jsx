import { useState, useEffect } from "react";
import { FaFrog, FaTrash, FaStar, FaRegStar } from "react-icons/fa";
import { Info, X } from "lucide-react";

const EatFrog = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showInfo, setShowInfo] = useState(false);

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
      <div className="max-w-2xl mx-auto relative">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaFrog className="text-green-500 text-4xl mr-4" />
              <h1 className="text-3xl font-bold text-gray-800">Eat the Frog</h1>
            </div>
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Show information about Eat the Frog method"
            >
              <Info className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={addTask} className="mb-8">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter your task..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-400 text-white py-3 rounded-lg hover:bg-green-500 transition-colors"
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

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex overflow-auto items-center justify-center z-50">
            <div className="bg-white top-7 rounded-lg p-8 max-w-2xl mx-4 relative">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                About the Eat the Frog Method
              </h2>

              <div className="space-y-4 text-gray-600">
                <p>
                  The "Eat the Frog" method is a productivity technique based on
                  a quote by Mark Twain: "If it's your job to eat a frog, it's
                  best to do it first thing in the morning."
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  How to Use:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Identify your most important or challenging task (your
                    "frog")
                  </li>
                  <li>
                    Mark it with the star icon to designate it as your frog task
                  </li>
                  <li>
                    Complete this task first before moving on to other tasks
                  </li>
                  <li>Use priority levels to organize remaining tasks</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  Benefits:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Increased productivity and focus</li>
                  <li>Reduced procrastination</li>
                  <li>Better time management</li>
                  <li>Improved sense of accomplishment</li>
                  <li>Reduced stress and anxiety about difficult tasks</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  Tips:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Plan your tasks the night before</li>
                  <li>Focus on one frog (major task) at a time</li>
                  <li>
                    Break down large tasks into smaller, manageable pieces
                  </li>
                  <li>Celebrate completing your frog task</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EatFrog;
