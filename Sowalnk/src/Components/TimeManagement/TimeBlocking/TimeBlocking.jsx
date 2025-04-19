import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import TaskList from "./TaskList";
import TimeBlockSchedule from "./TimeBlockSchedule";
import TaskHistory from "./TaskHistory";
import { Info } from "lucide-react";
import Confetti from "react-confetti";

const initialTimeBlocks = [
  {
    id: "deepWork",
    start: "08:00",
    end: "11:00",
    title: "Deep Work",
    description: "Focus on your most important tasks.",
  },
  {
    id: "quickTasks",
    start: "11:00",
    end: "11:30",
    title: "Quick Tasks",
    description: "Emails, phone calls, etc.",
  },
  {
    id: "break",
    start: "11:30",
    end: "12:30",
    title: "Break",
    description: "Eat, exercise, relax.",
  },
  {
    id: "importantTasks",
    start: "12:30",
    end: "14:00",
    title: "Important Tasks",
    description: "Projects, planning, preparation.",
  },
  {
    id: "meetings",
    start: "14:00",
    end: "16:00",
    title: "Meetings",
    description: "One-on-ones, follow-ups, external calls.",
  },
];

function TimeBlocking() {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("timeBlockingTasks")) || []
  );
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [taskHistory, setTaskHistory] = useState(
    () => JSON.parse(localStorage.getItem("taskHistory")) || []
  );
  const [taskAssignments, setTaskAssignments] = useState(
    () => JSON.parse(localStorage.getItem("taskAssignments")) || {}
  );
  const [timeBlocks, setTimeBlocks] = useState(
    () => JSON.parse(localStorage.getItem("timeBlocks")) || initialTimeBlocks
  );
  const [sortOption, setSortOption] = useState("newest");
  const [showHelp, setShowHelp] = useState(false);
  const [points, setPoints] = useState(
    () => parseInt(localStorage.getItem("points")) || 0
  );
  const [level, setLevel] = useState(
    () => parseInt(localStorage.getItem("level")) || 1
  );
  const [badges, setBadges] = useState(
    () => JSON.parse(localStorage.getItem("badges")) || []
  );
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem("timeBlockingTasks", JSON.stringify(tasks));
    localStorage.setItem("taskAssignments", JSON.stringify(taskAssignments));
    localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
    localStorage.setItem("points", points);
    localStorage.setItem("level", level);
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [tasks, taskAssignments, timeBlocks, taskHistory, points, level, badges]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted")
      Notification.requestPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const activeBlock = timeBlocks.find(
        (block) => currentTime >= block.start && currentTime <= block.end
      );
      if (activeBlock) {
        const assignedTasks = tasks.filter(
          (task) =>
            taskAssignments[task.id] === activeBlock.id && !task.completed
        );
        if (assignedTasks.length > 0 && Notification.permission === "granted") {
          new Notification(`Time Block: ${activeBlock.title}`, {
            body: `You have ${assignedTasks.length} task(s): ${assignedTasks
              .map((t) => t.text)
              .join(", ")}`,
          });
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [timeBlocks, tasks, taskAssignments]);

  const checkGamification = (action) => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setBadges((prev) => [...prev, `Level ${newLevel} Achieved`]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    const addedTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    if (action === "add" && addedTasks >= 5 && !badges.includes("Task Starter"))
      setBadges((prev) => [...prev, "Task Starter"]);
    if (
      action === "complete" &&
      completedTasks >= 5 &&
      !badges.includes("Task Finisher")
    )
      setBadges((prev) => [...prev, "Task Finisher"]);
    if (
      action === "complete" &&
      completedTasks >= 10 &&
      !badges.includes("Productivity Pro")
    )
      setBadges((prev) => [...prev, "Productivity Pro"]);
    if (timeBlocks.length >= 5 && !badges.includes("Time Master"))
      setBadges((prev) => [...prev, "Time Master"]);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return toast.error("Task name cannot be empty!");
    const taskObj = {
      id: Date.now().toString(),
      text: newTask.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      priority: newTaskPriority,
    };
    setTasks((prev) => [...prev, taskObj]);
    setTaskHistory((prev) => [
      ...prev,
      {
        taskId: taskObj.id,
        action: "Created",
        text: taskObj.text,
        timestamp: new Date().toISOString(),
      },
    ]);
    setPoints((prev) => prev + 10);
    checkGamification("add");
    setNewTask("");
    toast.success("Task added!");
  };

  const handleDeleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setTaskAssignments((prev) => {
      const newAssignments = { ...prev };
      delete newAssignments[taskId];
      return newAssignments;
    });
    setTaskHistory((prev) => [
      ...prev,
      {
        taskId,
        action: "Deleted",
        text: task.text,
        timestamp: new Date().toISOString(),
      },
    ]);
    toast.success("Task deleted!");
  };

  const handleToggleComplete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newCompleted = !t.completed;
          if (newCompleted) {
            setPoints((prev) => prev + 25);
            checkGamification("complete");
          }
          return { ...t, completed: newCompleted };
        }
        return t;
      })
    );
    setTaskHistory((prev) => [
      ...prev,
      {
        taskId,
        action: task.completed ? "Uncompleted" : "Completed",
        text: task.text,
        timestamp: new Date().toISOString(),
      },
    ]);
    toast.success("Task status updated!");
  };

  const clearAllTasks = () => {
    const previousTasks = [...tasks];
    const previousAssignments = { ...taskAssignments };
    setTasks([]);
    setTaskAssignments({});
    setTaskHistory((prev) => [
      ...prev,
      ...previousTasks.map((task) => ({
        taskId: task.id,
        action: "Deleted (Clear All)",
        text: task.text,
        timestamp: new Date().toISOString(),
      })),
    ]);
    toast("All tasks cleared!", {
      duration: 3000,
      action: {
        text: "Undo",
        onClick: () => {
          setTasks(previousTasks);
          setTaskAssignments(previousAssignments);
        },
      },
    });
  };

  const handleAssignTask = (taskId, blockId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTaskAssignments((prev) => {
      if (prev[taskId] === blockId) {
        const newAssign = { ...prev };
        delete newAssign[taskId];
        setTaskHistory((prevHistory) => [
          ...prevHistory,
          {
            taskId,
            action: "Unassigned",
            text: task.text,
            timestamp: new Date().toISOString(),
          },
        ]);
        toast.success("Task unassigned.");
        return newAssign;
      }
      setTaskHistory((prevHistory) => [
        ...prevHistory,
        {
          taskId,
          action: `Assigned to ${blockId}`,
          text: task.text,
          timestamp: new Date().toISOString(),
        },
      ]);
      toast.success(`Task assigned to ${blockId}!`);
      return { ...prev, [taskId]: blockId };
    });
  };

  const handleDeleteBlock = (blockId) => {
    setTimeBlocks((prev) => prev.filter((block) => block.id !== blockId));
    setTaskAssignments((prev) => {
      const newAssignments = { ...prev };
      Object.keys(newAssignments).forEach((taskId) => {
        if (newAssignments[taskId] === blockId) delete newAssignments[taskId];
      });
      return newAssignments;
    });
    toast.success("Time block deleted!");
  };

  const calculateProgress = (blockId) => {
    const assignedTasks = tasks.filter(
      (task) => taskAssignments[task.id] === blockId
    );
    if (assignedTasks.length === 0) return 0;
    const completedTasks = assignedTasks.filter(
      (task) => task.completed
    ).length;
    return (completedTasks / assignedTasks.length) * 100;
  };

  const renderTasksForBlock = (blockId) => {
    const assignedTasks = tasks.filter(
      (task) => taskAssignments[task.id] === blockId
    );
    return assignedTasks.length > 0 ? (
      <ul className="mt-4 space-y-2">
        {assignedTasks.map((task) => (
          <li
            key={task.id}
            className={`p-2 rounded-lg bg-gray-100 ${
              task.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.text}{" "}
            <span className="text-xs text-gray-500">({task.priority})</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic mt-4">No tasks assigned.</p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {showConfetti && <Confetti />}
      {/* Header */}
      <header className="bg-purple-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Time Blocking App</h1>
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 rounded-full hover:bg-purple-600"
        >
          <Info size={24} />
        </button>
      </header>

      {/* Main Layout */}
      <div className="">
        {/* Sidebar (Gamification) */}
        <aside className=" bg-white p-4 shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">
            Your Progress
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg">Level: {level}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${points % 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {points % 100}/100 to next level
              </p>
            </div>
            <p className="text-lg">Points: {points}</p>
            <div>
              <h3 className="text-lg font-semibold">Badges</h3>
              {badges.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {badges.map((badge, index) => (
                    <li
                      key={index}
                      className="bg-yellow-400 text-white p-2 rounded-lg text-sm"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No badges yet!</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskList
              tasks={tasks}
              newTask={newTask}
              setNewTask={setNewTask}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              handleAddTask={handleAddTask}
              handleToggleComplete={handleToggleComplete}
              handleDeleteTask={handleDeleteTask}
              handleAssignTask={handleAssignTask}
              timeBlocks={timeBlocks}
              taskAssignments={taskAssignments}
              sortOption={sortOption}
              setSortOption={setSortOption}
              clearAllTasks={clearAllTasks}
            />
            <TimeBlockSchedule
              timeBlocks={timeBlocks}
              setTimeBlocks={setTimeBlocks}
              tasks={tasks}
              taskAssignments={taskAssignments}
              handleDeleteBlock={handleDeleteBlock}
              calculateProgress={calculateProgress}
              renderTasksForBlock={renderTasksForBlock}
            />
            <div className="col-span-1 lg:col-span-2">
              <TaskHistory taskHistory={taskHistory} />
            </div>
            <div className="col-span-1 lg:col-span-2 flex justify-center">
              <button
                onClick={() => {
                  localStorage.clear();
                  setTasks([]);
                  setTaskAssignments({});
                  setTimeBlocks(initialTimeBlocks);
                  setTaskHistory([]);
                  setPoints(0);
                  setLevel(1);
                  setBadges([]);
                  toast.success("App reset!");
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow-md"
              >
                Reset App
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">
              How to Use Time Blocking
            </h3>
            <p className="text-gray-700 mb-4">
              Time Blocking is a time management technique where you divide your
              day into specific blocks of time, each dedicated to a particular
              task or group of tasks.
            </p>
            <h4 className="text-lg font-semibold text-purple-700 mb-2">
              Gamification
            </h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Earn 10 points for adding a task, 25 points for completing a
                task.
              </li>
              <li>Level up every 100 points.</li>
              <li>
                Badges: Task Starter (5 tasks), Task Finisher (5 completed),
                Productivity Pro (10 completed), Time Master (5 blocks).
              </li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default TimeBlocking;
