import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Info, X, Award, BarChart2 } from "lucide-react";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import eisenhowerService from "../../services/eisenhowerService";

const EisenhowerMethod = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("do");
  const [showInfo, setShowInfo] = useState(false);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const detectWindowSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectWindowSize);
    return () => {
      window.removeEventListener("resize", detectWindowSize);
    };
  }, []);

  // Load tasks from backend on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await eisenhowerService.getAllTasks();
    if (response.success) {
      // Ensure we're working with an array
      const fetchedTasks = Array.isArray(response.data) ? response.data : [];
      setTasks(fetchedTasks);

      // Calculate total points and level from tasks
      const totalPoints = fetchedTasks.reduce(
        (sum, task) => sum + (task.points || 0),
        0
      );
      const calculatedLevel = Math.floor(totalPoints / 100) + 1;

      setPoints(totalPoints);
      setLevel(calculatedLevel);

      // Get unique badges from all tasks
      const allBadges = fetchedTasks.reduce((acc, task) => {
        if (task.badges && Array.isArray(task.badges)) {
          return [...acc, ...task.badges];
        }
        return acc;
      }, []);
      setBadges([...new Set(allBadges)]);
    } else {
      toast.error(response.error || "Error fetching tasks");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const response = await eisenhowerService.createTask({
      text: newTask,
      quadrant: selectedQuadrant,
    });

    if (response.success) {
      const newTaskData = response.data;
      setTasks((prevTasks) => [...prevTasks, newTaskData]);
      setNewTask("");

      // Update points and badges from response
      if (newTaskData.points) {
        setPoints((prev) => prev + newTaskData.points);
      }
      if (newTaskData.badges && Array.isArray(newTaskData.badges)) {
        setBadges((prev) => [...new Set([...prev, ...newTaskData.badges])]);
      }

      toast.success("Task added successfully");
    } else {
      toast.error(response.error || "Error adding task");
    }
  };

  const deleteTask = async (taskId) => {
    const response = await eisenhowerService.deleteTask(taskId);

    if (response.success) {
      const {
        points: newPoints,
        badges: newBadges,
        level: newLevel,
      } = response.data;

      const oldLevel = level;

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      // Update points, badges, and level from response
      if (newPoints !== undefined) setPoints(newPoints);
      if (newBadges && Array.isArray(newBadges)) setBadges(newBadges);
      if (newLevel !== undefined) setLevel(newLevel);

      // Show confetti if level up occurred due to deletion
      if (newLevel > oldLevel) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      toast.success("Task deleted successfully");
    } else {
      toast.error(response.error || "Error deleting task");
    }
  };

  const updateTaskStatus = async (taskId, isCompleted) => {
    const response = await eisenhowerService.updateTaskStatus(
      taskId,
      isCompleted
    );

    if (response.success) {
      const {
        task: updatedTask,
        points: newPoints,
        level: newLevel,
        badges: newBadges,
      } = response.data;

      const oldLevel = level;

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );

      // Update points, badges, and level from response
      if (newPoints !== undefined) setPoints(newPoints);
      if (newBadges && Array.isArray(newBadges)) setBadges(newBadges);
      if (newLevel !== undefined) setLevel(newLevel);

      // Show confetti if level up occurred due to completion
      if (newLevel > oldLevel) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      toast.success("Task status updated");
    } else {
      toast.error(response.error || "Error updating task status");
    }
  };

  const getQuadrantTasks = (quadrant) => {
    return Array.isArray(tasks)
      ? tasks.filter((task) => task.quadrant === quadrant)
      : [];
  };

  const InfoModal = () => (
    <div className="fixed overflow-scroll inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white top-10 rounded-lg p-8 max-w-2xl w-full mx-4 relative">
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
                  consequences.
                </p>
              </li>
              <li>
                <span className="font-semibold text-blue-600">
                  Decide (Not Urgent & Important):
                </span>
                <p className="text-gray-700">
                  Tasks that contribute to long-term goals and should be
                  scheduled.
                </p>
              </li>
              <li>
                <span className="font-semibold text-yellow-600">
                  Delegate (Urgent & Not Important):
                </span>
                <p className="text-gray-700">
                  Tasks that need to be done soon but can be delegated.
                </p>
              </li>
              <li>
                <span className="font-semibold text-green-600">
                  Delete (Not Urgent & Not Important):
                </span>
                <p className="text-gray-700">
                  Tasks that are distractions and should be eliminated.
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
            key={task._id}
            className="flex items-center justify-between bg-white p-2 rounded shadow-sm"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={(e) => updateTaskStatus(task._id, e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span
                className={task.isCompleted ? "line-through text-gray-500" : ""}
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen place-items-center">
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
        />
      )}
      {/* Sidebar for Gamification */}
      <aside className="w-full bg-gradient-to-br my-6 from-blue-500 to-purple-600 text-white  p-6 shadow-xl flex-shrink-0">
        <h2 className="text-2xl font-extrabold mb-6 text-center tracking-wide">
          Your Progress
        </h2>
        <div className="space-y-5 md:space-y-0 md:flex md:justify-between md:items-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold flex items-center">
                <BarChart2 size={20} className="mr-2" /> Level:
              </p>
              <span className="text-xl font-bold">{level}</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5">
              <div
                className="bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${points % 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-100 mt-1">
              {points % 100}/100 to next level
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 shadow-inner">
            <p className="text-lg font-semibold flex items-center">
              <Award size={20} className="mr-2" /> Points:
            </p>
            <p className="text-xl font-bold mt-2">{points}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 shadow-inner">
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <Award size={20} className="mr-2" /> Badges
            </h3>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-200 text-sm">No badges yet!</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
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
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedQuadrant}
                onChange={(e) => setSelectedQuadrant(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="do">Urgent & Important</option>
                <option value="decide">Not Urgent & Important</option>
                <option value="delegate">Urgent & Not Important</option>
                <option value="delete">Not Urgent & Not Important</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <PlusCircle size={20} />
                Add Task
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default EisenhowerMethod;
