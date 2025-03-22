import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const EisenhowerMethod = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("do");

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now().toString(),
      text: newTask,
      quadrant: selectedQuadrant,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const getQuadrantTasks = (quadrant) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  const QuadrantSection = ({ title, type, description, bgColor }) => (
    <div className={`${bgColor} p-4 rounded-lg shadow-md`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm mb-3 text-gray-700">{description}</p>
      <ul className="space-y-2">
        {getQuadrantTasks(type).map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-white p-2 rounded shadow-sm"
          >
            <span>{task.text}</span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className=" bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Eisenhower Matrix
        </h1>

        <form
          onSubmit={addTask}
          className="mb-8 bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
              className="flex-1 p-2 border rounded"
            />
            <select
              value={selectedQuadrant}
              onChange={(e) => setSelectedQuadrant(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="do">Urgent & Important</option>
              <option value="decide">Not Urgent & Important</option>
              <option value="delegate">Urgent & Not Important</option>
              <option value="delete">Not Urgent & Not Important</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Add Task
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-6">
          <QuadrantSection
            title="Do First"
            type="do"
            description="Urgent and Important - Do these tasks immediately"
            bgColor="bg-red-100"
          />
          <QuadrantSection
            title="Decide"
            type="decide"
            description="Not Urgent but Important - Schedule these tasks"
            bgColor="bg-blue-100"
          />
          <QuadrantSection
            title="Delegate"
            type="delegate"
            description="Urgent but Not Important - Delegate these tasks"
            bgColor="bg-yellow-100"
          />
          <QuadrantSection
            title="Delete"
            type="delete"
            description="Not Urgent and Not Important - Eliminate these tasks"
            bgColor="bg-green-100"
          />
        </div>
      </div>
    </div>
  );
};

export default EisenhowerMethod;
