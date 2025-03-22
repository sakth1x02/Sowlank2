import React, { useState } from "react";
import {
  Circle as CircleLetterA,
  Circle as CircleLetterB,
  UserCircle as CircleLetterC,
  Circle as CircleLetterD,
  Circle as CircleLetterE,
  Plus,
  Trash2,
} from "lucide-react";
const ABCDEMethod = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("A");

  const priorityInfo = {
    A: { label: "Most Important", icon: CircleLetterA, color: "text-red-600" },
    B: { label: "Important", icon: CircleLetterB, color: "text-orange-500" },
    C: { label: "Nice to do", icon: CircleLetterC, color: "text-yellow-500" },
    D: { label: "Delegate", icon: CircleLetterD, color: "text-blue-500" },
    E: { label: "Eliminate", icon: CircleLetterE, color: "text-gray-500" },
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: crypto.randomUUID(),
          text: newTask.trim(),
          priority: selectedPriority,
        },
      ]);
      setNewTask("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const priorityGroups = ["A", "B", "C", "D", "E"].map((priority) => ({
    priority,
    tasks: tasks.filter((task) => task.priority === priority),
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            ABCDE Method Task Manager
          </h1>

          <form onSubmit={addTask} className="flex gap-4 mb-8">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(priorityInfo).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {key} - {label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </form>

          <div className="space-y-6">
            {priorityGroups.map(({ priority, tasks: priorityTasks }) => {
              const { label, icon: Icon, color } = priorityInfo[priority];
              return (
                <div
                  key={priority}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`${color} w-6 h-6`} />
                    <h2 className="text-xl font-semibold">
                      {priority} - {label}
                    </h2>
                  </div>
                  {priorityTasks.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No tasks in this category
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {priorityTasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <span>{task.text}</span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={20} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABCDEMethod;
