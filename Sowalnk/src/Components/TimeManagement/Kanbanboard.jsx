import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function KanbanBoard() {
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const stages = ["To Do", "Working On", "Completed"];
  const priorities = ["High", "Medium", "Low"];

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("Task name cannot be empty!");
      return;
    }
    const taskObj = {
      id: Date.now().toString(),
      text: newTask.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      dueDate: newDueDate,
      status: "To Do",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, taskObj]);
    setNewTask("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewDueDate("");
    toast.success("Task added successfully!");
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask.text.trim()) {
      toast.error("Task name cannot be empty!");
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id ? { ...editingTask } : task
      )
    );
    toast.success(`Task updated successfully!`);
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setDeletedTasks((prev) => [...prev, taskToDelete]);
    toast("Task deleted!", {
      icon: "🗑️",
      duration: 3000,
      position: "top-right",
      action: {
        text: "Undo",
        onClick: () => {
          setTasks((prev) => [...prev, taskToDelete]);
          setDeletedTasks((prev) => prev.filter((task) => task.id !== taskId));
        },
      },
    });
  };

  const moveTask = (taskId, currentStatus) => {
    let newStatus;
    if (currentStatus === "To Do") {
      newStatus = "Working On";
    } else if (currentStatus === "Working On") {
      newStatus = "Completed";
    } else {
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast.success(`Task moved to ${newStatus}!`);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);
    toast.success(`Task moved to ${destination.droppableId}!`);
  };

  const getKanban = () => {
    const kanban = {};
    stages.forEach((stage) => {
      const stageTasks = tasks.filter((task) => task.status === stage);
      kanban[stage] = stageTasks;
    });
    return kanban;
  };

  const getProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const Task = ({ task, index }) => {
    const isOverdue =
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed";
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 mb-4 rounded-xl border shadow-md transition-all hover:shadow-lg cursor-move ${
              isOverdue
                ? "border-red-500 bg-red-100"
                : task.priority === "High"
                ? "border-red-300 bg-red-50"
                : task.priority === "Medium"
                ? "border-yellow-300 bg-yellow-50"
                : "border-green-300 bg-green-50"
            }`}
          >
            <div className="flex-1 mb-2 sm:mb-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-gray-800 font-semibold text-base sm:text-lg">
                  {task.text}
                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold px-2 py-0.5 rounded ${
                    task.priority === "High"
                      ? "bg-red-500 text-white"
                      : task.priority === "Medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 truncate mt-1">
                {task.description || "No description"}
              </p>
              {task.dueDate && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}{" "}
                  {isOverdue && (
                    <span className="text-red-500 font-semibold">
                      (Overdue)
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3">
              {task.status === "To Do" && (
                <button
                  onClick={() => moveTask(task.id, task.status)}
                  className="text-green-500 hover:text-green-700 text-sm sm:text-base font-semibold transition-colors"
                >
                  Start
                </button>
              )}
              {task.status === "Working On" && (
                <button
                  onClick={() => moveTask(task.id, task.status)}
                  className="text-green-500 hover:text-green-700 text-sm sm:text-base font-semibold transition-colors"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => handleEditTask(task)}
                className="text-purple-500 hover:text-purple-700 text-sm sm:text-base font-semibold transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 text-sm sm:text-base font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const renderKanbanStage = (stage, stageTasks) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-purple-100 transform transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 capitalize">
          {stage}
        </h3>
        <span className="bg-purple-100 text-purple-800 text-sm sm:text-base font-medium px-3 py-1 rounded-full">
          {stageTasks.length}
        </span>
      </div>
      <Droppable droppableId={stage}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {stageTasks.length > 0 ? (
              stageTasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base text-center py-4">
                No tasks in this stage.
              </p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  const kanban = getKanban();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">
            Kanban Board
          </h1>
          <button
          onClick={() => setShowHelp(true)}
          className="relative bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 text-2xl transform hover:scale-110"
          title="How it works"
        >
          ?
          <span className="absolute inset-0 rounded-full bg-purple-500 opacity-25 animate-ping"></span>
        </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              Overall Progress
            </h2>
            <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 sm:h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Task Input Form */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg mb-6 sm:mb-8 lg:mb-10">
          <form onSubmit={handleAddTask} className="flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <input
                type="text"
                placeholder="Task name..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-sm sm:text-base lg:text-lg bg-gray-50"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-sm sm:text-base lg:text-lg bg-gray-50"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-sm sm:text-base lg:text-lg bg-gray-50"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    Priority: {priority}
                  </option>
                ))}
              </select>
           
              <button
                type="submit"
                className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors font-semibold text-sm sm:text-base lg:text-lg shadow-md"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>

        {/* Kanban Board Display */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {stages.map((stage) => (
              <div key={stage}>{renderKanbanStage(stage, kanban[stage])}</div>
            ))}
          </div>
        </DragDropContext>

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto border-t-4 border-purple-500">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  Edit Task
                </h3>
                <button
                  onClick={() => setEditingTask(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 sm:gap-6">
                <input
                  type="text"
                  value={editingTask.text}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, text: e.target.value })
                  }
                  className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-lg"
                />
                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description (optional)"
                  className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-lg h-24 resize-none"
                  rows="3"
                />
                <select
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, priority: e.target.value })
                  }
                  className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-lg"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      Priority: {priority}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={editingTask.dueDate || ""}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, dueDate: e.target.value })
                  }
                  className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-lg"
                />
                <select
                  value={editingTask.status}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, status: e.target.value })
                  }
                  className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base lg:text-lg"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      Status: {stage}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors text-sm sm:text-base lg:text-lg"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto border-t-4 border-purple-500">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  About Kanban Board
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-purple-600 mb-2">
                    What is a Kanban Board?
                  </h4>
                  <p className="text-sm sm:text-base lg:text-lg">
                    A Kanban Board is a visual tool used to manage tasks and workflows. It organizes tasks into columns representing different stages of progress (e.g., To Do, Working On, Completed), helping you track and manage your work efficiently.
                  </p>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-purple-600 mb-2">
                    Benefits of Using a Kanban Board
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base lg:text-lg">
                    <li>
                      <strong>Visual Clarity:</strong> Easily see the status of all tasks at a glance.
                    </li>
                    <li>
                      <strong>Improved Workflow:</strong> Identify bottlenecks and optimize task flow.
                    </li>
                    <li>
                      <strong>Enhanced Focus:</strong> Prioritize tasks and reduce multitasking.
                    </li>
                    <li>
                      <strong>Team Collaboration:</strong> Share progress with team members in real-time.
                    </li>
                    <li>
                      <strong>Flexibility:</strong> Adapt to changing priorities with ease.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-purple-600 mb-2">
                    How to Use This Kanban Board
                  </h4>
                  <ul className="list-decimal list-inside space-y-2 text-sm sm:text-base lg:text-lg">
                    <li>
                      <strong>Add Tasks:</strong> Use the form at the top to create new tasks with a name, description, priority, and due date.
                    </li>
                    <li>
                      <strong>Move Tasks:</strong>
                      <ul className="list-circle list-inside ml-4 space-y-1">
                        <li>Click "Start" to move from "To Do" to "Working On"</li>
                        <li>Click "Complete" to move from "Working On" to "Completed"</li>
                        <li>Or drag and drop tasks between stages</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Edit Tasks:</strong> Click "Edit" to change task details or status manually.
                    </li>
                    <li>
                      <strong>Delete Tasks:</strong> Click "Delete" (with undo option via toast).
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors w-full text-sm sm:text-base lg:text-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Toaster />
      </div>
    </div>
  );
}

export default KanbanBoard;