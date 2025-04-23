import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../store/user-slice.jsx";
import {
  Users,
  Plus,
  Search,
  CheckCircle,
  Circle,
  Calendar,
  MessageSquare,
  User,
  X,
  Trash2,
  Edit,
} from "lucide-react";

export default function Workspace() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create social media graphics",
      completed: false,
      dueDate: "2025-04-20",
      priority: "high",
      description:
        "Design 5 graphics for Instagram and Twitter to promote our new feature launch. Use the brand guidelines and color palette.",
      assignee: {
        id: 1,
        name: "Alex Johnson",
        avatar: "/api/placeholder/32/32",
      },
      comments: [
        {
          id: 1,
          author: "Taylor Smith",
          content:
            "I've started working on these. What dimensions should we use for the Twitter headers?",
          timestamp: "2h ago",
          avatar: "/api/placeholder/32/32",
        },
      ],
    },
    {
      id: 2,
      title: "Write blog post about new features",
      completed: true,
      dueDate: "2025-04-15",
      priority: "medium",
      description:
        "Draft a blog post highlighting the new features and improvements in our latest release. Include screenshots and examples.",
      assignee: {
        id: 2,
        name: "Taylor Smith",
        avatar: "/api/placeholder/32/32",
      },
      comments: [],
    },
    {
      id: 3,
      title: "Review competitor analysis",
      completed: false,
      dueDate: "2025-04-25",
      priority: "low",
      description:
        "Analyze the strengths and weaknesses of our top 3 competitors. Prepare a report with recommendations for our strategy.",
      assignee: {
        id: 3,
        name: "Jamie Garcia",
        avatar: "/api/placeholder/32/32",
      },
      comments: [
        {
          id: 1,
          author: "Alex Johnson",
          content: "Please focus on our top 3 competitors",
          timestamp: "1d ago",
          avatar: "/api/placeholder/32/32",
        },
        {
          id: 2,
          author: "Jamie Garcia",
          content: "Will do. I'll have the report ready by Thursday.",
          timestamp: "20h ago",
          avatar: "/api/placeholder/32/32",
        },
      ],
    },
    {
      id: 4,
      title: "Prepare presentation for team meeting",
      completed: false,
      dueDate: "2025-04-18",
      priority: "high",
      description:
        "Create a presentation summarizing the progress of our current projects and any blockers we need to address. Include team updates.",
      assignee: {
        id: 1,
        name: "Alex Johnson",
        avatar: "/api/placeholder/32/32",
      },
      comments: [
        {
          id: 1,
          author: "Mira Patel",
          content: "Should we include the Q2 projections?",
          timestamp: "3d ago",
          avatar: "/api/placeholder/32/32",
        },
        {
          id: 2,
          author: "Alex Johnson",
          content: "Yes, but only the approved numbers",
          timestamp: "2d ago",
          avatar: "/api/placeholder/32/32",
        },
        {
          id: 3,
          author: "Sam Wilson",
          content: "I can help with the slides design",
          timestamp: "1d ago",
          avatar: "/api/placeholder/32/32",
        },
      ],
    },
  ]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "medium",
    description: "",
    assignee: null,
  });
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [screenSize, setScreenSize] = useState("large");
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setEditingComment(null);
    setEditCommentContent("");
  };

  const members = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/api/placeholder/32/32",
      role: "Admin",
    },
    {
      id: 2,
      name: "Taylor Smith",
      avatar: "/api/placeholder/32/32",
      role: "Editor",
    },
    {
      id: 3,
      name: "Jamie Garcia",
      avatar: "/api/placeholder/32/32",
      role: "Editor",
    },
    {
      id: 4,
      name: "Mira Patel",
      avatar: "/api/placeholder/32/32",
      role: "Viewer",
    },
    {
      id: 5,
      name: "Sam Wilson",
      avatar: "/api/placeholder/32/32",
      role: "Editor",
    },
  ];

  // Priority color mapping
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/v1/group/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setTasks(data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    dispatch(fetchUsers());
    fetchTasks();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTaskWithId = {
      ...newTask,
      id: tasks.length + 1,
      completed: false,
      comments: [],
    };
    setTasks([...tasks, newTaskWithId]);
    setShowAddTaskModal(false);
    setNewTask({
      title: "",
      dueDate: "",
      priority: "medium",
      assignee: null,
    });
  };

  const handleAddComment = (taskId) => {
    if (!newComment.trim()) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newCommentObj = {
          id: task.comments.length + 1,
          author: "Current User",
          content: newComment,
          timestamp: "Just now",
          avatar: "/api/placeholder/32/32",
        };
        return {
          ...task,
          comments: [...task.comments, newCommentObj],
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = updatedTasks.find(
        (task) => task.id === taskId
      );
      setSelectedTask(updatedSelectedTask);
    }

    setNewComment("");
  };

  const handleDeleteComment = (taskId, commentId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: task.comments.filter((comment) => comment.id !== commentId),
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = updatedTasks.find(
        (task) => task.id === taskId
      );
      setSelectedTask(updatedSelectedTask);
    }

    // If we were editing this comment, cancel the edit
    if (editingComment && editingComment.id === commentId) {
      setEditingComment(null);
      setEditCommentContent("");
    }
  };

  const handleStartEditComment = (comment) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent("");
  };

  const handleSaveEditComment = (taskId) => {
    if (!editCommentContent.trim()) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: task.comments.map((comment) =>
            comment.id === editingComment.id
              ? {
                  ...comment,
                  content: editCommentContent,
                  timestamp: "Edited just now",
                }
              : comment
          ),
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = updatedTasks.find(
        (task) => task.id === taskId
      );
      setSelectedTask(updatedSelectedTask);
    }

    setEditingComment(null);
    setEditCommentContent("");
  };

  const handleToggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(updatedTasks.find((task) => task.id === taskId));
    }
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold">Random Now</h1>
              <div className="flex items-center text-sm text-gray-500">
                <Users size={14} className="mr-1" />
                <span>{users.length} members</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search tasks..."
                className="border border-gray-300 rounded-md pl-8 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 lg:w-64"
              />
              <Search
                size={16}
                className="absolute left-2 top-1.5 text-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Task List */}
          <div
            className={`flex-1 overflow-y-auto ${
              selectedTask && screenSize !== "large" ? "hidden" : "block"
            }`}
          >
            <div className="p-4">
              {/* Task List */}
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-shadow ${
                      task.completed ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        className="mt-0.5 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTaskCompletion(task.id);
                        }}
                      >
                        {task.completed ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <Circle size={20} className="text-gray-300" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                priorityColors[task.priority]
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{task.dueDate}</span>
                            </div>
                            {task.comments.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare size={14} />
                                <span>{task.comments.length}</span>
                              </div>
                            )}
                          </div>

                          <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="mt-4 flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                <Plus size={18} className="mr-2" />
                <span>Add New Task</span>
              </button>
            </div>
          </div>

          {/* Add task Modal */}
          {showAddTaskModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scaleIn"
                style={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="relative p-6">
                  {/* Header with gradient border */}
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-800">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                          Create New Task
                        </span>
                      </h2>
                      <button
                        onClick={() => setShowAddTaskModal(false)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <X
                          size={20}
                          className="text-gray-500 hover:text-gray-700"
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Fill in the details below to create a new task
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Field */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Enter task title"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Due Date Field */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask({ ...newTask, dueDate: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Priority Field */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["high", "medium", "low"].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority })}
                            className={`px-3 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 ${
                              newTask.priority === priority
                                ? priority === "high"
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : priority === "medium"
                                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                  : "bg-green-50 border-green-200 text-green-700"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <Flag
                              size={16}
                              className={
                                newTask.priority === priority
                                  ? priority === "high"
                                    ? "text-red-500"
                                    : priority === "medium"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                  : "text-gray-400"
                              }
                            />
                            <span className="capitalize">{priority}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Assignee Field */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Assignee <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={newTask.assignee?.id || ""}
                          onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            const selectedMember = members.find(
                              (m) => m.id === selectedId
                            );
                            setNewTask({
                              ...newTask,
                              assignee: selectedMember,
                            });
                          }}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                          required
                        >
                          <option value="">Select team member</option>
                          {members.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Enter description"
                          value={newTask.description}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              description: e.target.value,
                            })
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddTaskModal(false)}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-2">
                          <Plus size={18} className="text-white" />
                          <span>Create Task</span>
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Task Details */}
          {selectedTask && (
            <div
              className={`border-l border-gray-200 bg-white w-full md:w-96 ${
                selectedTask && screenSize !== "large"
                  ? "block"
                  : "hidden md:block"
              }`}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-semibold">Task Details</h2>
                  <button
                    onClick={closeTaskDetails}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-4 flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleToggleTaskCompletion(selectedTask.id)
                      }
                    >
                      {selectedTask.completed ? (
                        <CheckCircle size={22} className="text-green-500" />
                      ) : (
                        <Circle size={22} className="text-gray-300" />
                      )}
                    </button>
                    <h3 className="text-lg font-medium">
                      {selectedTask.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Due Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={18} />
                        <span>Due Date</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedTask.dueDate}
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Flag size={18} />
                        <span>Priority</span>
                      </div>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          priorityColors[selectedTask.priority]
                        }`}
                      >
                        {selectedTask.priority}
                      </div>
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User size={18} />
                        <span>Assignee</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300" />
                        <span className="text-sm font-medium">
                          {selectedTask.assignee.name}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <AlignLeft size={18} />
                        <span>Description</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                        {selectedTask.title === "Create social media graphics"
                          ? "Design 5 graphics for Instagram and Twitter to promote our new feature launch. Use the brand guidelines and color palette."
                          : selectedTask.description}
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MessageSquare size={18} />
                          <span>Comments</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {selectedTask.comments.length} comments
                        </span>
                      </div>

                      {selectedTask.comments.length > 0 && (
                        <div className="space-y-4">
                          {selectedTask.comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                              <div className="flex-1">
                                {editingComment &&
                                editingComment.id === comment.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      rows="3"
                                      value={editCommentContent}
                                      onChange={(e) =>
                                        setEditCommentContent(e.target.value)
                                      }
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                        onClick={handleCancelEditComment}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                                        onClick={() =>
                                          handleSaveEditComment(selectedTask.id)
                                        }
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">
                                          {comment.author}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {comment.timestamp}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        {comment.content}
                                      </p>
                                    </div>
                                    <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                                      <button
                                        className="hover:text-gray-700 flex items-center"
                                        onClick={() =>
                                          handleStartEditComment(comment)
                                        }
                                      >
                                        <Edit size={12} className="mr-1" />
                                        Edit
                                      </button>
                                      <button
                                        className="hover:text-gray-700 flex items-center"
                                        onClick={() =>
                                          handleDeleteComment(
                                            selectedTask.id,
                                            comment.id
                                          )
                                        }
                                      >
                                        <Trash2 size={12} className="mr-1" />
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment */}
                      <div className="mt-4">
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                          <div className="flex-1">
                            <textarea
                              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Add a comment..."
                              rows="2"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>
                            <div className="mt-2 flex justify-end">
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                                onClick={() =>
                                  handleAddComment(selectedTask.id)
                                }
                              >
                                Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Flag({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
      <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  );
}

function AlignLeft({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="17" y1="10" x2="3" y2="10"></line>
      <line x1="21" y1="6" x2="3" y2="6"></line>
      <line x1="21" y1="14" x2="3" y2="14"></line>
      <line x1="17" y1="18" x2="3" y2="18"></line>
    </svg>
  );
}
