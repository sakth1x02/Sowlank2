import React, { useState } from "react";
import { PlusCircle, Trash2, Info, X } from "lucide-react";

const EisenhowerMethod = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("do");
  const [showInfo, setShowInfo] = useState(false);

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

  const InfoModal = () => (
    <div className="fixed overflow-scroll inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white top-10  rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={() => setShowInfo(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">The Eisenhower Method</h2>
        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">What is it?</h3>
            <p className="text-gray-700">
              The Eisenhower Method is a productivity and time-management
              framework that helps you organize tasks based on their urgency and
              importance. Named after President Dwight D. Eisenhower, this
              method helps you prioritize tasks and make better decisions about
              how to spend your time.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">The Four Quadrants</h3>
            <ul className="space-y-3">
              <li>
                <span className="font-semibold text-red-600">
                  Do First (Urgent & Important):
                </span>
                <p className="text-gray-700">
                  Tasks that require immediate attention and have significant
                  consequences. These are your priorities.
                </p>
              </li>
              <li>
                <span className="font-semibold text-blue-600">
                  Decide (Not Urgent & Important):
                </span>
                <p className="text-gray-700">
                  Tasks that contribute to long-term goals and should be
                  scheduled for later.
                </p>
              </li>
              <li>
                <span className="font-semibold text-yellow-600">
                  Delegate (Urgent & Not Important):
                </span>
                <p className="text-gray-700">
                  Tasks that need to be done soon but can be delegated to
                  others.
                </p>
              </li>
              <li>
                <span className="font-semibold text-green-600">
                  Delete (Not Urgent & Not Important):
                </span>
                <p className="text-gray-700">
                  Tasks that are distractions and should be eliminated or
                  minimized.
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Benefits</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Better time management and productivity</li>
              <li>Reduced stress and overwhelm</li>
              <li>Improved decision-making</li>
              <li>Clear prioritization of tasks</li>
              <li>Better work-life balance</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );

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
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Eisenhower Matrix</h1>
          <button
            onClick={() => setShowInfo(true)}
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Learn about the Eisenhower Method"
          >
            <Info size={24} className="text-gray-700" />
          </button>
        </div>

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
      {showInfo && <InfoModal />}
    </div>
  );
};

export default EisenhowerMethod;
