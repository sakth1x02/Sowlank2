import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  CalendarClock,
  Plus,
  Trash2,
  Timer,
  Info,
  X,
  Trophy,
  Star,
  Award,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import Confetti from "react-confetti";

const TwoMinuteRule = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(1);
  const [showInfo, setShowInfo] = useState(false);

  // Enhanced gamification states
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const pointsToNextLevel = level * 50; // Reduced points needed for level up

  // Animation for points
  useEffect(() => {
    if (showPointsAnimation) {
      const timer = setTimeout(() => {
        setShowPointsAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPointsAnimation]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj = {
        id: crypto.randomUUID(),
        text: newTask.trim(),
        minutes: estimatedTime,
        status: estimatedTime <= 2 ? "do-now" : "deferred",
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks([...tasks, newTaskObj]);
      setNewTask("");
      setEstimatedTime(1);

      // Add points for creating a task
      const newPoints = points + 1;
      setPoints(newPoints);
      setPointsToAdd(1);
      setShowPointsAnimation(true);

      // Check for level up
      const newLevel = Math.floor(newPoints / 50) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;

          // Add points for completing a task
          if (newCompleted) {
            const newPoints = points + 2;
            setPoints(newPoints);
            setPointsToAdd(2);
            setShowPointsAnimation(true);

            // Check for level up
            const newLevel = Math.floor(newPoints / 50) + 1;
            if (newLevel > level) {
              setLevel(newLevel);
              setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 4000);
            }

            // Add badges for completing tasks
            if (task.status === "do-now") {
              setBadges((prev) => {
                if (!prev.includes("Quick Task Master")) {
                  return [...prev, "Quick Task Master"];
                }
                return prev;
              });
            } else {
              setBadges((prev) => {
                if (!prev.includes("Task Completionist")) {
                  return [...prev, "Task Completionist"];
                }
                return prev;
              });
            }
          }

          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const taskGroups = {
    "do-now": tasks.filter(
      (task) => task.status === "do-now" && !task.completed
    ),
    deferred: tasks.filter(
      (task) => task.status === "deferred" && !task.completed
    ),
    completed: tasks.filter((task) => task.completed),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Timer className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                2 Minute Rule Task Manager
              </h1>
            </div>
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Show information about 2 Minute Rule"
            >
              <Info className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-blue-800 mb-2">How it works:</h2>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>If a task takes less than 2 minutes, do it now</li>
              <li>If a task takes more than 2 minutes, defer or delegate it</li>
            </ul>
          </div>

          <form onSubmit={addTask} className="flex gap-4 mb-8">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">minutes</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </form>

          {/* Enhanced Gamification Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Level {level}
                    </h3>
                    <p className="text-sm text-gray-500">Keep going!</p>
                  </div>
                  <div className="relative">
                    <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
                    {showPointsAnimation && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce text-green-500 font-bold">
                        +{pointsToAdd}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Points: {points}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((points % 50) / 50) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Target className="w-4 h-4 text-purple-500" />
                  {points % 50}/{50} to Level {level + 1}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {badges.length > 0 ? (
                    badges.map((badge, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <Award className="w-4 h-4 text-yellow-500" />
                        {badge}
                      </span>
                    ))
                  ) : (
                    <div className="w-full text-center py-4">
                      <p className="text-gray-500 italic">
                        Complete tasks to earn badges!
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Each task completed gives you 2 points!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Do Now Section */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-green-600 w-6 h-6" />
                <h2 className="text-xl font-semibold text-green-800">
                  Do Now (≤ 2 minutes)
                </h2>
              </div>
              {taskGroups["do-now"].length === 0 ? (
                <p className="text-green-600 italic">No tasks to do now</p>
              ) : (
                <ul className="space-y-2">
                  {taskGroups["do-now"].map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <span>{task.text}</span>
                        <span className="text-sm text-green-600">
                          ({task.minutes} min)
                        </span>
                      </div>
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

            {/* Deferred Section */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="text-orange-600 w-6 h-6" />
                <h2 className="text-xl font-semibold text-orange-800">
                  Deferred (more than 2 minutes)
                </h2>
              </div>
              {taskGroups["deferred"].length === 0 ? (
                <p className="text-orange-600 italic">No deferred tasks</p>
              ) : (
                <ul className="space-y-2">
                  {taskGroups["deferred"].map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <span>{task.text}</span>
                        <span className="text-sm text-orange-600">
                          ({task.minutes} min)
                        </span>
                      </div>
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

            {/* Completed Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-gray-600 w-6 h-6" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Completed
                </h2>
              </div>
              {taskGroups["completed"].length === 0 ? (
                <p className="text-gray-500 italic">No completed tasks</p>
              ) : (
                <ul className="space-y-2">
                  {taskGroups["completed"].map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <span className="line-through text-gray-500">
                          {task.text}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({task.minutes} min)
                        </span>
                      </div>
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
          </div>
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed overflow-scroll inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white top-44 rounded-xl p-8 max-w-2xl mx-4 relative">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                About the 2-Minute Rule
              </h2>

              <div className="space-y-6 text-gray-600">
                <div>
                  <p className="mb-4">
                    The 2-Minute Rule, popularized by David Allen in his book
                    "Getting Things Done," is a simple productivity principle
                    that helps you overcome procrastination and maintain
                    momentum in your work.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Core Principle
                  </h3>
                  <p className="mb-2">
                    If an action takes less than two minutes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Do it immediately</strong> - Don't defer or
                      delegate
                    </li>
                    <li>
                      The time spent managing the task would be longer than
                      completing it
                    </li>
                    <li>Helps build momentum and productivity habits</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Benefits
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reduces mental clutter and task backlog</li>
                    <li>Builds productive habits and momentum</li>
                    <li>Increases efficiency in task management</li>
                    <li>Helps overcome procrastination</li>
                    <li>Creates a sense of accomplishment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    How to Use This Tool
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Add tasks with their estimated completion time</li>
                    <li>
                      Tasks under 2 minutes appear in the "Do Now" section
                    </li>
                    <li>Longer tasks are automatically deferred</li>
                    <li>
                      Complete quick tasks immediately to maintain momentum
                    </li>
                    <li>Track completed tasks for motivation</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Be realistic with time estimates</li>
                    <li>• Don't overthink small tasks</li>
                    <li>• Use the rule for starting larger tasks too</li>
                    <li>• Review deferred tasks regularly</li>
                    <li>• Celebrate small wins</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoMinuteRule;
