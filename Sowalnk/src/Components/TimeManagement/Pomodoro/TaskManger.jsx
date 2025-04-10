import React, { useState, useEffect, useCallback, useRef } from "react";
import pomodoroService from "../../../services/pomodoroService";
import { toast } from "react-toastify";

function TaskManagerComponent({
  loading,
  tasks,
  setTasks,
  currentTask,
  setCurrentTask,
  phase,
  world,
  reminderSound,
  onPointsUpdate,
}) {
  const [newTask, setNewTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [updatingDeadlineId, setUpdatingDeadlineId] = useState(null);
  const deadlineUpdateTimeoutRef = useRef(null);
  const tasksRef = useRef(tasks);

  // Update ref when tasks change
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // Calculate progress based on deadline - memoized with useCallback
  const calculateProgress = useCallback((task) => {
    if (!task.deadline) return 0;
    if (task.completed) return 100;

    const deadlineDate = new Date(task.deadline);
    const currentDate = new Date();

    // If deadline has passed, return 100%
    if (currentDate >= deadlineDate) return 100;

    // Calculate total duration in milliseconds
    const totalDuration =
      deadlineDate - new Date(task.createdAt || currentDate);

    // Calculate elapsed time in milliseconds
    const elapsedTime = currentDate - new Date(task.createdAt || currentDate);

    // Calculate progress percentage
    const progressPercentage = Math.min(
      100,
      Math.max(0, (elapsedTime / totalDuration) * 100)
    );

    return Math.round(progressPercentage);
  }, []);

  // Format time remaining until deadline - memoized with useCallback
  const formatTimeRemaining = useCallback((deadline) => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const currentDate = new Date();

    // If deadline has passed
    if (currentDate >= deadlineDate) return "Overdue";

    // Calculate time difference in milliseconds
    const timeDiff = deadlineDate - currentDate;

    // Convert to hours, minutes, seconds
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Format the time remaining
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    } else {
      return `${seconds}s remaining`;
    }
  }, []);

  // Handle deadline change with debounce
  const handleDeadlineChange = useCallback(
    (taskId, newDeadlineValue) => {
      // Clear any existing timeout
      if (deadlineUpdateTimeoutRef.current) {
        clearTimeout(deadlineUpdateTimeoutRef.current);
      }

      // Set a new timeout to update the deadline after 500ms
      deadlineUpdateTimeoutRef.current = setTimeout(async () => {
        try {
          setUpdatingDeadlineId(taskId);

          // Validate deadline is at least 5 minutes in the future
          if (newDeadlineValue) {
            const deadlineDate = new Date(newDeadlineValue);
            const currentDate = new Date();
            const minDeadlineDate = new Date(currentDate.getTime() + 5 * 60000); // 5 minutes from now

            if (deadlineDate < minDeadlineDate) {
              toast.error("Deadline must be at least 5 minutes in the future");
              return;
            }
          }

          // Call API to update deadline
          await pomodoroService.updateDeadline(taskId, newDeadlineValue);

          // Update the task in the local state
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === taskId
                ? { ...task, deadline: newDeadlineValue }
                : task
            )
          );
        } catch (error) {
          toast.error("Failed to update deadline");
        } finally {
          setUpdatingDeadlineId(null);
        }
      }, 500);
    },
    [setTasks]
  );

  // World-specific colors
  const colors = {
    Forest: ["bg-green-100", "bg-yellow-100", "bg-blue-100", "bg-pink-100"],
    Mountain: ["bg-orange-100", "bg-purple-100", "bg-teal-100"],
    Sky: ["bg-cyan-100", "bg-indigo-100", "bg-rose-100"],
  };

  // Function to add a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const taskData = {
        text: newTask,
        priority: "medium",
        reminderInterval: "5",
      };

      const response = await pomodoroService.createpomodoros(taskData);

      if (response.success) {
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setNewTask("");
        toast.success("Task added successfully");
      } else {
        toast.error(response.message || "Failed to add task");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = async (index) => {
    const task = tasks[index];

    // If task is already completed, don't allow uncompleting
    if (task.completed) {
      toast.info("Completed tasks cannot be marked as incomplete");
      return;
    }

    // If task has no deadline, don't allow completing
    if (!task.deadline) {
      toast.error("Please set a deadline before completing the task");
      return;
    }

    try {
      setCompletingTaskId(task._id);
      const response = await pomodoroService.markAsCompleted(task._id);

      if (response.success) {
        const updatedTasks = tasks.map((t, i) =>
          i === index ? { ...t, completed: true, progress: 100 } : t
        );
        setTasks(updatedTasks);
        onPointsUpdate(20);
        toast.success("Task completed!");
      } else {
        toast.error("Failed to mark task as completed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to mark task as completed");
    } finally {
      setCompletingTaskId(null);
    }
  };

  // Function to delete a task
  const deleteTask = async (index) => {
    const task = tasks[index];
    try {
      setDeletingTaskId(task._id);
      const response = await pomodoroService.deletepomodoros(task._id);

      if (response.success) {
        setTasks(tasks.filter((_, i) => i !== index));
        if (currentTask === task.text) setCurrentTask(null);
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Check deadlines for notifications - using ref to avoid dependency on tasks
  useEffect(() => {
    const checkDeadlines = () => {
      const currentTasks = tasksRef.current;
      currentTasks.forEach((task, index) => {
        if (task.deadline) {
          const deadlineTime = new Date(task.deadline).getTime();
          const currentTime = new Date().getTime();
          const timeDiff = deadlineTime - currentTime;
          const reminderInterval = parseInt(task.reminderInterval) * 60 * 1000;

          if (timeDiff > 0 && timeDiff <= reminderInterval && !task.notified) {
            if (Notification.permission === "granted") {
              new Notification(`Task Reminder: ${task.text}`, {
                body: `Due in ${task.reminderInterval} minutes!`,
                tag: `task-${index}`,
              });
              new Audio(reminderSound).play();
            }
            // Update notification status without causing re-render
            const updatedTasks = currentTasks.map((t, i) =>
              i === index ? { ...t, notified: true } : t
            );
            setTasks(updatedTasks);
          }
        }
      });
    };

    const interval = setInterval(checkDeadlines, 1000);
    return () => clearInterval(interval);
  }, [reminderSound]);

  // Update progress based on deadline every minute - using ref to avoid dependency on tasks
  useEffect(() => {
    const updateProgress = () => {
      const currentTasks = tasksRef.current;
      const hasTasksWithDeadlines = currentTasks.some(
        (task) => task.deadline && !task.completed
      );

      if (!hasTasksWithDeadlines) return;

      const updatedTasks = currentTasks.map((task) => {
        if (task.completed || !task.deadline) return task;

        const progress = calculateProgress(task);
        // Only update if progress has changed
        if (progress === task.progress) return task;

        return { ...task, progress };
      });

      // Only update state if there are actual changes
      const hasChanges = updatedTasks.some(
        (task, index) => task.progress !== currentTasks[index].progress
      );

      if (hasChanges) {
        setTasks(updatedTasks);
      }
    };

    // Update immediately
    updateProgress();

    // Then update every minute
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, [calculateProgress]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (deadlineUpdateTimeoutRef.current) {
        clearTimeout(deadlineUpdateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">Task Board</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          aria-label="Add new task"
          className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300"
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          disabled={isSubmitting}
          autoFocus
        />
        <button
          onClick={addTask}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          aria-label="Add task"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-4">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          tasks.map((task, index) => {
            const color = colors[world][index % colors[world].length];
            const isActive = task.text === currentTask && phase === "Work";
            const isCompleting = completingTaskId === task._id;
            const isDeleting = deletingTaskId === task._id;
            const isUpdatingDeadline = updatingDeadlineId === task._id;
            const progress = calculateProgress(task);

            return (
              <div
                key={task._id || index}
                className={`${color} p-4 space-y-9 rounded-lg shadow-md relative ${
                  isActive ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(index)}
                    className={`h-5 w-5 rounded ${
                      task.completed
                        ? "text-purple-600"
                        : !task.deadline
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-purple-600"
                    }`}
                    aria-label={`Mark task "${task.text}" as ${
                      task.completed ? "incomplete" : "complete"
                    }`}
                    disabled={
                      isCompleting ||
                      isDeleting ||
                      task.completed ||
                      !task.deadline
                    }
                    title={
                      !task.deadline
                        ? "Set a deadline before completing this task"
                        : task.completed
                        ? "Completed tasks cannot be marked as incomplete"
                        : ""
                    }
                  />
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.text}
                  </span>
                  {/* Deadline time input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={
                        task.deadline
                          ? new Date(task.deadline).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        const newDeadline = e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null;
                        handleDeadlineChange(task._id, newDeadline);
                      }}
                      className={`text-xs p-1 rounded border ${
                        task.completed
                          ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                          : "border-gray-300"
                      }`}
                      aria-label="Set task deadline"
                      disabled={
                        isCompleting ||
                        isDeleting ||
                        task.completed ||
                        isUpdatingDeadline
                      }
                      title={
                        task.completed
                          ? "Deadline cannot be changed for completed tasks"
                          : ""
                      }
                    />
                    {isUpdatingDeadline && (
                      <span className="text-xs text-gray-500">Updating...</span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${
                      task.completed ? "bg-green-500" : "bg-purple-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {task.deadline && !task.completed && (
                  <div className="flex justify-between items-center text-xs">
                    <span
                      className={`${
                        new Date(task.deadline) < new Date()
                          ? "text-red-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {formatTimeRemaining(task.deadline)}
                    </span>
                    <span className="text-gray-500">{progress}% complete</span>
                  </div>
                )}

                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => setCurrentTask(task.text)}
                    className={`text-sm ${
                      !task.deadline || task.completed
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-purple-600 hover:text-purple-800"
                    }`}
                    aria-label={`Select task "${task.text}" for focus`}
                    disabled={task.completed || isDeleting || !task.deadline}
                    title={
                      !task.deadline
                        ? "Set a deadline before selecting this task"
                        : ""
                    }
                  >
                    Select
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className={` text-lg ${
                      task.completed
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-600"
                    }`}
                    aria-label={`Delete task "${task.text}"`}
                    disabled={task.completed || isDeleting}
                  >
                    {isDeleting ? "..." : "×"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default React.memo(TaskManagerComponent);
