import React, { useState, useEffect } from "react";
import {
  Circle as CircleLetterA,
  Circle as CircleLetterB,
  UserCircle as CircleLetterC,
  Circle as CircleLetterD,
  Circle as CircleLetterE,
  Plus,
  Trash2,
  Info,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "react-toastify";
import abcdmethodService from "../../services/abcdmethodService";

const ABCDEMethod = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("A");
  const [showInfo, setShowInfo] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetchTasks();
    fetchUserPoints();
  }, []);

  const fetchTasks = async () => {
    const response = await abcdmethodService.getAllTasks();
    if (response.success) {
      setTasks(response.data);
    } else {
      toast.error(response.error || "Error fetching tasks");
    }
  };

  const fetchUserPoints = async () => {
    const response = await abcdmethodService.getUserPoints();
    if (response.success) {
      setUserPoints(response.data.points);
    } else {
      toast.error(response.error || "Error fetching points");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const response = await abcdmethodService.createTask({
      text: newTask.trim(),
      priority: selectedPriority,
    });

    if (response.success) {
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask("");
      toast.success("Task added successfully");
    } else {
      toast.error(response.error || "Error adding task");
    }
  };

  const deleteTask = async (taskId) => {
    const response = await abcdmethodService.deleteTask(taskId);
    if (response.success) {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } else {
      toast.error(response.error || "Error deleting task");
    }
  };

  const updateTaskCompletion = async (taskId, isCompleted) => {
    const response = await abcdmethodService.updateTaskStatus(
      taskId,
      isCompleted
    );
    if (response.success) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...response.data.task } : task
        )
      );
      setUserPoints(response.data.points);
      toast.success(
        isCompleted
          ? "Task completed! +10 points! 🎉"
          : "Task marked as incomplete"
      );
    } else {
      toast.error(response.error || "Error updating task status");
    }
  };

  const priorityInfo = {
    A: { label: "Most Important", icon: CircleLetterA, color: "text-red-600" },
    B: { label: "Important", icon: CircleLetterB, color: "text-orange-500" },
    C: { label: "Nice to do", icon: CircleLetterC, color: "text-yellow-500" },
    D: { label: "Delegate", icon: CircleLetterD, color: "text-blue-500" },
    E: { label: "Eliminate", icon: CircleLetterE, color: "text-gray-500" },
  };

  const priorityGroups = ["A", "B", "C", "D", "E"].map((priority) => ({
    priority,
    tasks: tasks.filter((task) => task.priority === priority),
  }));

  const InfoModal = () => (
    <div className="fixed inset-0 overflow-scroll max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 top-44 max-w-2xl w-full mx-4 relative shadow-2xl">
        <button
          onClick={() => setShowInfo(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          The ABCDE Method
        </h2>
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              What is it?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The ABCDE Method is a powerful prioritization technique developed
              by productivity expert Brian Tracy. It helps you organize tasks
              based on their importance and consequences, ensuring you focus on
              what truly matters.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Priority Levels
            </h3>
            <ul className="space-y-4">
              <li className="p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <CircleLetterA className="text-red-600" />
                  <span className="font-semibold text-red-600">
                    A - Most Important
                  </span>
                </div>
                <p className="text-gray-700">
                  Tasks with serious consequences if not completed. Must be done
                  first.
                </p>
              </li>
              <li className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <CircleLetterB className="text-orange-500" />
                  <span className="font-semibold text-orange-600">
                    B - Important
                  </span>
                </div>
                <p className="text-gray-700">
                  Tasks with mild consequences. Should be done after A tasks.
                </p>
              </li>
              <li className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="flex items-center gap-2 mb-1">
                  <CircleLetterC className="text-yellow-500" />
                  <span className="font-semibold text-yellow-600">
                    C - Nice to Do
                  </span>
                </div>
                <p className="text-gray-700">
                  Tasks with no consequences. Can be done after B tasks.
                </p>
              </li>
              <li className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <CircleLetterD className="text-blue-500" />
                  <span className="font-semibold text-blue-600">
                    D - Delegate
                  </span>
                </div>
                <p className="text-gray-700">
                  Tasks that can be delegated to others to free up your time.
                </p>
              </li>
              <li className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <CircleLetterE className="text-gray-500" />
                  <span className="font-semibold text-gray-600">
                    E - Eliminate
                  </span>
                </div>
                <p className="text-gray-700">
                  Tasks that can be eliminated with little or no consequence.
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Benefits
            </h3>
            <ul className="grid grid-cols-2 gap-4">
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Increased productivity</span>
              </li>
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Better time management</span>
              </li>
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Reduced stress</span>
              </li>
              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Clear prioritization</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ABCDE Method Task Manager
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Your Points:</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                  {userPoints} 🏆
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(true)}
              className="bg-white p-3 rounded-full hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
              title="Learn about the ABCDE Method"
            >
              <Info size={24} className="text-gray-700" />
            </button>
          </div>

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
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md"
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
                  className="border border-gray-200 rounded-lg p-4 transition-transform hover:scale-[1.01]"
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
                          key={task._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() =>
                                updateTaskCompletion(
                                  task._id,
                                  !task.isCompleted
                                )
                              }
                              className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              {task.isCompleted ? (
                                <CheckSquare className="h-5 w-5" />
                              ) : (
                                <Square className="h-5 w-5" />
                              )}
                            </button>
                            <span
                              className={`text-gray-700 ${
                                task.isCompleted
                                  ? "line-through text-gray-400"
                                  : ""
                              }`}
                            >
                              {task.text}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors opacity-0 group-hover:opacity-100"
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
      {showInfo && <InfoModal />}
    </div>
  );
};

export default ABCDEMethod;
