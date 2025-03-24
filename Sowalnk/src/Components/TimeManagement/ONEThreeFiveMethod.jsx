import React, { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

const ONEThreeFiveMethod = () => {
  const [tasks, setTasks] = useState({
    major: [],
    medium: [],
    small: [],
  });

  const addTask = (category, text) => {
    if (!text.trim()) return;

    const limits = {
      major: 1,
      medium: 3,
      small: 5,
    };

    if (tasks[category].length >= limits[category]) {
      alert(
        `You can only have ${limits[category]} ${category} task${
          limits[category] > 1 ? "s" : ""
        }`
      );
      return;
    }

    setTasks((prev) => ({
      ...prev,
      [category]: [
        ...prev[category],
        { id: Date.now(), text, completed: false },
      ],
    }));
  };

  const toggleTask = (category, id) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const deleteTask = (category, id) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].filter((task) => task.id !== id),
    }));
  };

  const TaskList = ({ category, title, tasks, limit }) => {
    const [newTask, setNewTask] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      addTask(category, newTask);
      setNewTask("");
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500">
            {tasks.length}/{limit}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={100}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleTask(category, task.id)}
                  className={`text-lg ${
                    task.completed ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                <span
                  className={`${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(category, task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            1-3-5 Task Method
          </h1>
          <p className="text-gray-600">
            Prioritize your daily tasks efficiently
          </p>
        </div>

        <div className="grid gap-6 w-full">
          <TaskList
            category="major"
            title="1 Major Task"
            tasks={tasks.major}
            limit={1}
          />
          <TaskList
            category="medium"
            title="3 Medium Tasks"
            tasks={tasks.medium}
            limit={3}
          />
          <TaskList
            category="small"
            title="5 Small Tasks"
            tasks={tasks.small}
            limit={5}
          />
        </div>
      </div>
    </div>
  );
};

export default ONEThreeFiveMethod;
