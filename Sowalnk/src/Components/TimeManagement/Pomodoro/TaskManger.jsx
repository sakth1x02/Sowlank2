import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Define default task structure
const defaultTask = {
  text: "",
  completed: false,
  deadline: null,
  reminderInterval: "5",
  notified: false,
  priority: "medium",
  progress: 0,
};

// Define default props
const defaultProps = {
  tasks: [],
  setTasks: () => console.warn("setTasks not provided"),
  currentTask: null,
  setCurrentTask: () => {},
  phase: "Work",
  world: "Forest",
  reminderSound: "/default-sound.mp3",
  onPointsUpdate: () => {},
};

function TaskManagerComponent({
  tasks = defaultProps.tasks,
  setTasks = defaultProps.setTasks,
  currentTask = defaultProps.currentTask,
  setCurrentTask = defaultProps.setCurrentTask,
  phase = defaultProps.phase,
  world = defaultProps.world,
  reminderSound = defaultProps.reminderSound,
  onPointsUpdate = defaultProps.onPointsUpdate,
}) {
  const [newTask, setNewTask] = useState("");

  // World-specific colors
  const colors = {
    Forest: ["bg-green-100", "bg-yellow-100", "bg-blue-100", "bg-pink-100"],
    Mountain: ["bg-orange-100", "bg-purple-100", "bg-teal-100"],
    Sky: ["bg-cyan-100", "bg-indigo-100", "bg-rose-100"],
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          ...defaultTask,
          text: newTask,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    if (!tasks[index].completed) onPointsUpdate(20);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    if (currentTask === tasks[index]?.text) setCurrentTask(null);
  };

  const setTaskDeadline = (index, deadline, reminderInterval) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, deadline, reminderInterval, notified: false } : t
      )
    );
  };

  const updateTaskProgress = (index, progress) => {
    setTasks(
      tasks.map((t, i) =>
        i === index
          ? { ...t, progress: Math.min(100, Math.max(0, progress)) }
          : t
      )
    );
  };

  useEffect(() => {
    const checkDeadlines = () => {
      tasks.forEach((task, index) => {
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
            setTasks((prev) =>
              prev.map((t, i) => (i === index ? { ...t, notified: true } : t))
            );
          }
        }
      });
    };
    const interval = setInterval(checkDeadlines, 1000);
    return () => clearInterval(interval);
  }, [tasks, reminderSound]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  // Memoized Task Item component for better performance
  const TaskItem = React.memo(
    ({ task, index, world, isActive, timeLeft, handlers }) => {
      const color = colors[world][index % colors[world].length];

      return (
        <div
          className={`${color} p-4 rounded-lg shadow-md relative ${
            isActive ? "ring-2 ring-purple-500" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handlers.toggleTaskCompletion(index)}
              className="h-5 w-5 text-purple-600 rounded"
              aria-label={`Mark task "${task.text}" as ${
                task.completed ? "incomplete" : "complete"
              }`}
            />
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {task.text}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="datetime-local"
              value={task.deadline || ""}
              onChange={(e) =>
                handlers.setTaskDeadline(
                  index,
                  e.target.value,
                  task.reminderInterval
                )
              }
              className="p-1 rounded border border-gray-300 text-sm"
              aria-label="Set task deadline"
            />
            <select
              value={task.reminderInterval}
              onChange={(e) =>
                handlers.setTaskDeadline(index, task.deadline, e.target.value)
              }
              className="p-1 rounded border border-gray-300 text-sm"
              aria-label="Set reminder interval"
            >
              <option value="5">5 min</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
            </select>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={task.progress}
            onChange={(e) =>
              handlers.updateTaskProgress(index, parseInt(e.target.value))
            }
            className="w-full mb-2"
            aria-label="Update task progress"
          />
          {timeLeft !== null && (
            <span
              className={`text-xs ${
                timeLeft <= 5 ? "text-red-600" : "text-gray-600"
              }`}
            >
              {timeLeft > 0 ? `${timeLeft} min left` : "Overdue!"}
            </span>
          )}
          <div className="flex justify-between mt-2">
            <button
              onClick={() => handlers.setCurrentTask(task.text)}
              className="text-purple-600 hover:text-purple-800 text-sm"
              aria-label={`Select task "${task.text}" for focus`}
            >
              Select
            </button>
            <button
              onClick={() => handlers.deleteTask(index)}
              className="text-red-500 hover:text-red-600 text-lg"
              aria-label={`Delete task "${task.text}"`}
            >
              ×
            </button>
          </div>
        </div>
      );
    }
  );

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
        />
        <button
          onClick={addTask}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          aria-label="Add task"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4 max-h-[500px] overflow-y-auto"
            >
              {tasks.map((task, index) => {
                const isActive = task.text === currentTask && phase === "Work";
                const timeLeft = task.deadline
                  ? Math.max(
                      0,
                      Math.floor((new Date(task.deadline) - new Date()) / 60000)
                    )
                  : null;

                return (
                  <Draggable
                    key={task.text}
                    draggableId={task.text}
                    index={index}
                  >
                    {(provided) => (
                      <TaskItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        task={task}
                        index={index}
                        world={world}
                        isActive={isActive}
                        timeLeft={timeLeft}
                        handlers={{
                          toggleTaskCompletion,
                          setTaskDeadline,
                          updateTaskProgress,
                          setCurrentTask,
                          deleteTask,
                        }}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default React.memo(TaskManagerComponent);
