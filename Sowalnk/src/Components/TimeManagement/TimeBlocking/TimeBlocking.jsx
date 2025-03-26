import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import TaskList from "./TaskList";
import TimeBlockSchedule from "./TimeBlockSchedule";
import TaskHistory from "./TaskHistory";
import { Info } from "lucide-react";

const initialTimeBlocks = [
  { id: "deepWork", start: "08:00", end: "11:00", title: "Deep Work", description: "Focus on your most important tasks." },
  { id: "quickTasks", start: "11:00", end: "11:30", title: "Quick Tasks", description: "Emails, phone calls, etc." },
  { id: "break", start: "11:30", end: "12:30", title: "Break", description: "Eat, exercise, relax." },
  { id: "importantTasks", start: "12:30", end: "14:00", title: "Important Tasks", description: "Projects, planning, preparation." },
  { id: "meetings", start: "14:00", end: "16:00", title: "Meetings", description: "One-on-ones, follow-ups, external calls." },
];

function TimeBlocking() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("timeBlockingTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [taskHistory, setTaskHistory] = useState(() => {
    const savedHistory = localStorage.getItem("taskHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [taskAssignments, setTaskAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem("taskAssignments");
    return savedAssignments ? JSON.parse(savedAssignments) : {};
  });
  const [timeBlocks, setTimeBlocks] = useState(() => {
    const savedBlocks = localStorage.getItem("timeBlocks");
    return savedBlocks ? JSON.parse(savedBlocks) : initialTimeBlocks;
  });
  const [sortOption, setSortOption] = useState("newest");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    localStorage.setItem("timeBlockingTasks", JSON.stringify(tasks));
    localStorage.setItem("taskAssignments", JSON.stringify(taskAssignments));
    localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
  }, [tasks, taskAssignments, timeBlocks, taskHistory]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
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
          (task) => taskAssignments[task.id] === activeBlock.id && !task.completed
        );
        if (assignedTasks.length > 0) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Time Block: ${activeBlock.title}`, {
              body: `You have ${assignedTasks.length} task(s): ${assignedTasks
                .map((t) => t.text)
                .join(", ")}`,
            });
          }
          toast(`Active: ${activeBlock.title}\nTasks: ${assignedTasks.map((t) => t.text).join(", ")}`, {
            duration: 5000,
            style: { background: "#6d28d9", color: "#fff", fontSize: "1rem" },
          });
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [timeBlocks, tasks, taskAssignments]);

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
      { taskId: taskObj.id, action: "Created", text: taskObj.text, timestamp: new Date().toISOString() },
    ]);
    setNewTask("");
    setNewTaskPriority("Medium");
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
      { taskId, action: "Deleted", text: task.text, timestamp: new Date().toISOString() },
    ]);
    toast.success("Task deleted!");
  };

  const handleToggleComplete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
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
      action: { text: "Undo", onClick: () => {
        setTasks(previousTasks);
        setTaskAssignments(previousAssignments);
      } },
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
          { taskId, action: "Unassigned", text: task.text, timestamp: new Date().toISOString() },
        ]);
        toast.success("Task unassigned.");
        return newAssign;
      }
      setTaskHistory((prevHistory) => [
        ...prevHistory,
        { taskId, action: `Assigned to ${blockId}`, text: task.text, timestamp: new Date().toISOString() },
      ]);
      toast.success(`Task assigned to ${blockId}!`);
      return { ...prev, [taskId]: blockId };
    });
  };

  const handleAssignmentChange = (taskId, e) => handleAssignTask(taskId, e.target.value);

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
    const assignedTasks = tasks.filter((task) => taskAssignments[task.id] === blockId);
    if (assignedTasks.length === 0) return 0;
    const completedTasks = assignedTasks.filter((task) => task.completed).length;
    return (completedTasks / assignedTasks.length) * 100;
  };

  const renderTasksForBlock = (blockId) => {
    const assignedTasks = tasks.filter((task) => taskAssignments[task.id] === blockId);
    return assignedTasks.length > 0 ? (
      <ul className="mt-2 md:mt-4 space-y-2 md:space-y-3">
        {assignedTasks.map((task) => (
          <li
            key={task.id}
            className={`text-gray-800 p-3 md:p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm text-base md:text-lg ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.text} <span className="text-xs md:text-sm text-gray-500">({task.priority})</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic text-base md:text-lg mt-2 md:mt-4">No tasks assigned.</p>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl md:text-5xl font-bold text-black">Time Blocking</h1>
        <button
              onClick={() => setShowHelp(true)}
              className="bg-white p-3 rounded-full hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
              title="Learn about the ABCDE Method"
            >
              <Info size={24} className="text-gray-700" />
            </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1">
            <TaskList
              tasks={tasks}
              newTask={newTask}
              setNewTask={setNewTask}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              handleAddTask={handleAddTask}
              handleToggleComplete={handleToggleComplete}
              handleDeleteTask={handleDeleteTask}
              handleAssignmentChange={handleAssignmentChange}
              timeBlocks={timeBlocks}
              taskAssignments={taskAssignments}
              sortOption={sortOption}
              setSortOption={setSortOption}
              clearAllTasks={clearAllTasks}
            />
          </div>
          <div className="col-span-1">
            <TimeBlockSchedule
              timeBlocks={timeBlocks}
              setTimeBlocks={setTimeBlocks}
              tasks={tasks}
              taskAssignments={taskAssignments}
              handleDeleteBlock={handleDeleteBlock}
              calculateProgress={calculateProgress}
              renderTasksForBlock={renderTasksForBlock}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <TaskHistory taskHistory={taskHistory} />
          </div>
          <div className="col-span-1 lg:col-span-2 flex justify-center lg:justify-start">
            <button
              onClick={() => {
                localStorage.clear();
                setTasks([]);
                setTaskAssignments({});
                setTimeBlocks(initialTimeBlocks);
                setTaskHistory([]);
                toast.success("App reset!");
              }}
              className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-base md:text-lg shadow-md w-full md:w-auto"
            >
              Reset App
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-2 md:mb-0">How to Use Time Blocking</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl md:text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="text-gray-700 text-base md:text-lg">
              <h4 className="text-lg md:text-xl font-semibold text-purple-700 mb-2 md:mb-3">What is Time Blocking?</h4>
              <p className="mb-3 md:mb-4">
                Time Blocking is a time management technique where you divide your day into specific blocks of time, each dedicated to a particular task or group of tasks. Instead of working from an endless to-do list, you assign tasks to fixed time slots, helping you focus on one thing at a time and reduce distractions.
              </p>
              <h4 className="text-lg md:text-xl font-semibold text-purple-700 mb-2 md:mb-3">What are the Benefits?</h4>
              <ul className="list-disc list-inside space-y-2 md:space-y-3 mb-3 md:mb-4">
                <li><strong>Increased Focus:</strong> By dedicating time to specific tasks, you minimize multitasking and improve concentration.</li>
                <li><strong>Better Productivity:</strong> Structured time slots help you prioritize and complete tasks more efficiently.</li>
                <li><strong>Reduced Stress:</strong> Knowing when you’ll tackle each task prevents overwhelm and procrastination.</li>
                <li><strong>Improved Time Awareness:</strong> You gain a clearer sense of how long tasks take and how your day is spent.</li>
                <li><strong>Work-Life Balance:</strong> Scheduling breaks and personal time ensures you don’t overwork.</li>
              </ul>
              <h4 className="text-lg md:text-xl font-semibold text-purple-700 mb-2 md:mb-3">How to Use It?</h4>
              <ul className="list-disc list-inside space-y-2 md:space-y-3">
                <li><strong>Add Tasks:</strong> Use the form to add tasks with a priority (High, Medium, Low).</li>
                <li><strong>Assign Tasks:</strong> Use the dropdown in the task list to assign tasks to a time block.</li>
                <li><strong>Add Time Blocks:</strong> Click "Add Time Block" to create new time slots as needed.</li>
                <li><strong>Edit/Delete Time Blocks:</strong> Click "Edit" or "Delete" on any time block to modify or remove it.</li>
                <li><strong>Mark Completed:</strong> Check the box next to a task to mark it as done.</li>
                <li><strong>Notifications:</strong> Receive alerts when a time block is active with pending tasks.</li>
                <li><strong>History:</strong> View the history of task actions (create, complete, delete) below the schedule.</li>
              </ul>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 md:mt-6 px-4 py-2 md:px-6 md:py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 w-full text-base md:text-lg shadow-md"
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