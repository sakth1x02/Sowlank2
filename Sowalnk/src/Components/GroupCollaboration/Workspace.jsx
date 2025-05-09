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
  Loader,
  Edit,
  CornerDownRight,
  AlignLeft,
  Flag,
  ArrowLeft,
  Menu,
} from "lucide-react";
import ShowAddTask from "./ShowAddTask.jsx";

export default function Workspace() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const auth = useSelector((state) => state.user.loggedInUser);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "medium",
    description: "",
    assignees: [],
    createdBy: auth._id,
  });
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [screenSize, setScreenSize] = useState("large");
  const [showTaskList, setShowTaskList] = useState(true);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("small");
      } else if (window.innerWidth < 1024) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
        // On large screens, always show task list, and show task details if a task is selected
        setShowTaskList(true);
        if (selectedTask) {
          setShowTaskDetails(true);
        }
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedTask]);

  const handleTaskClick = async (task) => {
    setSelectedTask(task);

    // On small screens, show task details and hide task list
    if (screenSize === "small" || screenSize === "medium") {
      setShowTaskList(false);
      setShowTaskDetails(true);
    } else {
      // On large screens, show both
      setShowTaskList(true);
      setShowTaskDetails(true);
    }

    try {
      setCommentLoading(true);
      const response = await fetch(`/api/v1/comment/task/${task._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };
  // console.log(
  //   "Comment",
  //   comments.map((comment) => console.log(comment.content))
  // );

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setEditingComment(null);
    setEditCommentContent("");
    setReplyingTo(null);
    setReplyContent("");
    setEditingReply(null);
    setEditReplyContent("");

    // On small screens, show task list and hide task details when closing
    if (screenSize === "small" || screenSize === "medium") {
      setShowTaskList(true);
      setShowTaskDetails(false);
    } else {
      // On large screens, always show task list, but hide details when closed
      setShowTaskList(true);
      setShowTaskDetails(false);
    }
  };

  const members = users;

  // Priority color mapping
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  //This is for getting the task
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/group", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    dispatch(fetchUsers());
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(
          `/api/v1/comment/task/${selectedTask._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setComments(data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
      }
    };
    if (selectedTask) {
      fetchComment();
    }
  }, [setComments]);

  //This is for adding the task
  const handleSubmit = async (e, taskWithInvites) => {
    e.preventDefault();

    try {
      // Format task data
      const taskData = {
        ...(taskWithInvites || newTask),
        emailInvites: taskWithInvites?.emailInvites || [],
      };

      const response = await fetch("/api/v1/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      setTasks([...tasks, data]);
      setShowAddTaskModal(false);
      setNewTask({
        title: "",
        dueDate: "",
        priority: "medium",
        description: "",
        assignees: [],
        createdBy: auth._id,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.message || "An error occurred while creating the task");
    }
  };
  // console.log("Tasks:", tasks);
  // console.log("Selected Task:", selectedTask);

  const handleAddComment = async (taskId) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/v1/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          taskId,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const { data } = await response.json();

      // Update tasks state
      setTasks(
        tasks.map((task) =>
          task._id === taskId
            ? { ...task, comments: [...task.comments, data._id] }
            : task
        )
      );
      // Update comments state with the new comment
      setComments((prev) => [...prev, data]);

      // Update selected task comments
      if (selectedTask?._id === taskId) {
        setSelectedTask((prev) => ({
          ...prev,
          comments: [...prev.comments, data._id],
        }));
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (taskId, commentId) => {
    try {
      const response = await fetch(`/api/v1/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      // Update tasks state
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...task,
                comments: task.comments.filter((id) => id !== commentId),
              }
            : task
        )
      );
      // Update selected task comments
      if (selectedTask?._id === taskId) {
        setSelectedTask((prev) => ({
          ...prev,
          comments: prev.comments.filter((id) => id !== commentId),
        }));
      }

      // Update comments state
      setComments((prev) => prev.filter((c) => c._id !== commentId));

      if (editingComment?._id === commentId) {
        setEditingComment(null);
        setEditCommentContent("");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  const handleSaveEditComment = async (taskId, commentId) => {
    if (!editCommentContent.trim()) return;

    try {
      const response = await fetch(`/api/v1/comment/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: editCommentContent }),
      });

      if (!response.ok) throw new Error("Failed to update comment");

      const { data } = await response.json();

      // Update comments state
      setComments((prev) => prev.map((c) => (c._id === commentId ? data : c)));

      setEditingComment(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Check if user has permission to edit a task
  const canEditTask = (task) => {
    if (!task || !auth) return false;

    // Check if user is the creator
    const isCreator =
      task.createdBy === auth._id || task.createdBy?._id === auth._id;

    // Check if user is an assignee
    const isAssignee = task.assignees?.some((assigneeId) => {
      // Handle both ID strings and objects
      if (typeof assigneeId === "object") {
        return assigneeId?._id === auth._id;
      }
      return assigneeId === auth._id;
    });

    return isCreator || isAssignee;
  };

  // This is for toggling the complete part
  const handleToggleTaskCompletion = async (taskId) => {
    try {
      const response = await fetch(`/api/v1/group/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update task");
      }

      const updatedTasks = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === updatedTasks._id ? updatedTasks : t))
      );

      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(updatedTasks);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert(error.message || "You don't have permission to update this task");
    }
  };

  // This is for Deleting the Task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/v1/group/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      await response.json();
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message || "You don't have permission to delete this task");
    }
  };

  const handleStartReply = (comment) => {
    setReplyingTo(comment);
    setReplyContent("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleSubmitReply = async (taskId, parentCommentId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`/api/v1/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          taskId,
          content: replyContent,
          parentCommentId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add reply");

      const { data } = await response.json();

      // Update comments state - add the reply to the parent comment's replies array
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === parentCommentId
            ? { ...comment, replies: [...comment.replies, data] }
            : comment
        )
      );

      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleStartEditReply = (reply) => {
    setEditingReply(reply);
    setEditReplyContent(reply.content);
  };

  const handleCancelEditReply = () => {
    setEditingReply(null);
    setEditReplyContent("");
  };

  const handleSaveEditReply = async (parentCommentId, replyId) => {
    if (!editReplyContent.trim()) return;

    try {
      const response = await fetch(`/api/v1/comment/${replyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: editReplyContent }),
      });

      if (!response.ok) throw new Error("Failed to update reply");

      const { data } = await response.json();

      // Update comments state - update the reply in the parent comment's replies array
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === replyId ? data : reply
                ),
              }
            : comment
        )
      );

      setEditingReply(null);
      setEditReplyContent("");
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  const handleDeleteReply = async (parentCommentId, replyId) => {
    try {
      const response = await fetch(`/api/v1/comment/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete reply");

      // Update comments state - remove the reply from the parent comment's replies array
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== replyId
                ),
              }
            : comment
        )
      );

      if (editingReply && editingReply._id === replyId) {
        setEditingReply(null);
        setEditReplyContent("");
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-3 sm:p-4 sticky top-0 z-10">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                Group Collaboration
              </h1>
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <Users size={14} className="mr-1" />
                <span>{users.length} members</span>
              </div>
            </div>
          </div>

          {/* <div className="flex items-center space-x-2">
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
            <button className="md:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-50">
              <Menu size={20} />
            </button>
          </div> */}
        </header>

        {/* Workspace Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Task List */}
          <div
            id="task-list"
            className={`${showTaskList ? "flex-1" : "hidden"} 
              ${
                screenSize === "large" && showTaskDetails
                  ? "w-full md:w-1/2 lg:w-3/5"
                  : "w-full"
              } 
              overflow-y-auto bg-gray-50 transition-all duration-300`}
          >
            <div className="p-3 sm:p-4">
              {/* Task List Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Tasks</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative md:hidden">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 sm:w-32"
                    />
                    <Search
                      size={14}
                      className="absolute left-2 top-2 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-2 sm:space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader className="w-8 h-8 sm:w-10 sm:h-10 text-purple-700 animate-spin" />
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-all ${
                        task.completed ? "bg-gray-50" : ""
                      } ${
                        selectedTask?._id === task._id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <button
                          className="mt-0.5 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {task.completed ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <Circle size={18} className="text-gray-300" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-medium text-sm sm:text-base truncate mr-2 ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex-shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                  priorityColors[task.priority]
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex items-center space-x-1">
                                <Calendar size={12} className="sm:block" />
                                <span className="truncate">
                                  {task.dueDate.split("T")[0]}
                                </span>
                              </div>
                            </div>

                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-300 flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="mt-4 flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                <span className="text-sm sm:text-base">Add New Task</span>
              </button>
            </div>
          </div>

          {/* Add task Modal */}
          {showAddTaskModal && (
            <ShowAddTask
              setShowAddTaskModal={setShowAddTaskModal}
              setNewTask={setNewTask}
              newTask={newTask}
              handleSubmit={handleSubmit}
              members={members}
            />
          )}

          {/* Task Details */}
          {selectedTask && (
            <div
              id="task-details"
              className={`border-l border-gray-200 bg-white h-full overflow-hidden shadow-lg md:shadow-none
                ${
                  screenSize === "small" || screenSize === "medium"
                    ? "absolute inset-0 z-10 w-full"
                    : "w-full md:w-1/2 lg:w-2/5"
                }
                ${showTaskDetails ? "" : "hidden"}
              `}
            >
              <div className="h-full flex flex-col">
                <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
                  {(screenSize === "small" || screenSize === "medium") && (
                    <button
                      onClick={closeTaskDetails}
                      className="mr-3 p-1.5 rounded-md hover:bg-gray-100 text-gray-500 border border-gray-200"
                      aria-label="Back to task list"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <h2 className="font-semibold text-base sm:text-lg flex-1 truncate">
                    {selectedTask.title}
                  </h2>
                  <button
                    onClick={closeTaskDetails}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20">
                  <div className="mb-4 sm:mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedTask.priority === "high"
                            ? "bg-red-500"
                            : selectedTask.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          priorityColors[selectedTask.priority]
                        }`}
                      >
                        {selectedTask.priority}
                      </span>
                    </div>

                    {canEditTask(selectedTask) && (
                      <button
                        onClick={() => handleDeleteTask(selectedTask._id)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Due Date */}
                    <div className="flex items-center justify-between bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-sm">Due Date</span>
                      </div>
                      <div className="text-xs sm:text-sm font-medium">
                        {new Date(
                          selectedTask.dueDate.split("T")[0]
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center justify-between bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm">Assignees</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-wrap justify-end">
                        {selectedTask?.assignees?.length > 0 ? (
                          selectedTask.assignees.map((assignee, index) => (
                            <div
                              key={`${assignee}-${index}`}
                              className="flex items-center space-x-1 bg-blue-50 px-2 py-0.5 rounded-full"
                            >
                              <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                                {members
                                  .find((m) => m._id === assignee)
                                  ?.name?.charAt(0) || "U"}
                              </div>
                              <span className="text-xs text-blue-700">
                                {members.find((m) => m._id === assignee)
                                  ?.name || "User"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            No assignees
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-gray-700 mb-2">
                        <AlignLeft size={16} className="text-gray-500" />
                        <span className="text-sm">Description</span>
                      </div>
                      <div className="bg-white p-3 rounded-md text-xs sm:text-sm text-gray-700 border border-gray-100">
                        {selectedTask.description || (
                          <span className="text-gray-400 italic">
                            No description provided
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Complete task button - only show for assignees and creator */}
                    {canEditTask(selectedTask) && (
                      <button
                        onClick={() =>
                          handleToggleTaskCompletion(selectedTask._id)
                        }
                        className={`w-full text-sm border p-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                          selectedTask.completed
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-green-300 bg-green-100 hover:bg-green-200 text-green-700"
                        }`}
                      >
                        {selectedTask.completed ? (
                          <>
                            <CheckCircle size={16} />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Circle size={16} />
                            <span>Mark Complete</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Show message when user doesn't have permission */}
                    {!canEditTask(selectedTask) && (
                      <div className="text-xs text-gray-500 italic text-center bg-gray-50 p-2 rounded-lg">
                        Only assignees can mark tasks as complete or delete them
                      </div>
                    )}

                    {/* Comments */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MessageSquare size={16} className="text-gray-600" />
                          <span className="font-medium text-sm">
                            Discussion
                          </span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {selectedTask?.comments?.length || 0} comments
                        </span>
                      </div>

                      {commentLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                          <span className="ml-3 text-sm text-gray-500">
                            Loading comments...
                          </span>
                        </div>
                      ) : selectedTask?.comments?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No comments yet. Be the first to add one!
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedTask?.comments?.map((commentId) => {
                            const comment = comments?.find(
                              (c) => c._id === commentId
                            );
                            if (!comment) return null;

                            return (
                              <div
                                key={commentId}
                                className="flex space-x-2 sm:space-x-3 group"
                              >
                                {/* Comment avatar */}
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                                  {comment?.author?.avatar ? (
                                    <img
                                      src={comment.author.avatar}
                                      alt={comment.author.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs sm:text-sm">
                                      {comment?.author?.name?.charAt(0)}
                                    </div>
                                  )}
                                </div>

                                {/* Comment content */}
                                <div className="flex-1">
                                  {editingComment &&
                                  editingComment._id === commentId ? (
                                    <CommentEditForm
                                      value={editCommentContent}
                                      onChange={(e) =>
                                        setEditCommentContent(e.target.value)
                                      }
                                      onCancel={handleCancelEditComment}
                                      onSave={() =>
                                        handleSaveEditComment(
                                          selectedTask._id,
                                          comment._id
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>
                                      <div className="bg-gray-100 p-2.5 sm:p-3 rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-medium text-xs sm:text-sm">
                                            {comment?.author?.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {comment?.edited ? "Edited • " : ""}
                                            {new Date(
                                              comment?.updatedAt
                                            ).toDateString()}
                                          </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-700">
                                          {comment?.content}
                                        </p>
                                      </div>

                                      {/* Comment actions */}
                                      <CommentActions
                                        onEdit={() =>
                                          handleStartEditComment(comment)
                                        }
                                        onDelete={() =>
                                          handleDeleteComment(
                                            selectedTask._id,
                                            comment._id
                                          )
                                        }
                                        onReply={() =>
                                          handleStartReply(comment)
                                        }
                                        comment={comment}
                                      />

                                      {/* Replies */}
                                      <CommentReplies
                                        comment={comment}
                                        editingReply={editingReply}
                                        editReplyContent={editReplyContent}
                                        onEditReplyChange={(e) =>
                                          setEditReplyContent(e.target.value)
                                        }
                                        onCancelEdit={handleCancelEditReply}
                                        onSaveEdit={(replyId) =>
                                          handleSaveEditReply(
                                            comment._id,
                                            replyId
                                          )
                                        }
                                        onEdit={handleStartEditReply}
                                        onDelete={(replyId) =>
                                          handleDeleteReply(
                                            comment._id,
                                            replyId
                                          )
                                        }
                                      />

                                      {/* Reply form */}
                                      {replyingTo &&
                                        replyingTo._id === comment._id && (
                                          <ReplyForm
                                            value={replyContent}
                                            onChange={(e) =>
                                              setReplyContent(e.target.value)
                                            }
                                            onCancel={handleCancelReply}
                                            onSubmit={() =>
                                              handleSubmitReply(
                                                selectedTask._id,
                                                comment._id
                                              )
                                            }
                                            recipientName={comment.author?.name}
                                          />
                                        )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Add comment */}
                    <div className="mt-6">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Add Comment
                      </h3>
                      <div className="flex space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm">
                            {auth?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            className="border border-gray-300 rounded-md p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            placeholder="Add a comment..."
                            rows="2"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          ></textarea>
                          <div className="mt-2 flex justify-end">
                            <button
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs sm:text-sm hover:bg-blue-600 transition-colors flex items-center"
                              onClick={() => handleAddComment(selectedTask._id)}
                              disabled={!newComment.trim()}
                            >
                              <MessageSquare size={12} className="mr-1.5" />
                              <span>Comment</span>
                            </button>
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

// Helper components for cleaner code
function CommentEditForm({ value, onChange, onCancel, onSave }) {
  return (
    <div className="space-y-2">
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        value={value}
        onChange={onChange}
      />
      <div className="flex justify-end space-x-2">
        <button
          className="px-2 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function CommentActions({ onEdit, onDelete, onReply, comment }) {
  const auth = useSelector((state) => state.user.loggedInUser);
  const isAuthor = comment?.author?._id === auth._id;

  return (
    <div className="flex items-center mt-1.5 space-x-3 text-xs text-gray-500 px-1 opacity-70 group-hover:opacity-100">
      {isAuthor && (
        <>
          <button
            className="hover:text-blue-600 flex items-center transition-colors"
            onClick={onEdit}
          >
            <Edit size={10} className="mr-1" />
            Edit
          </button>
          <button
            className="hover:text-red-600 flex items-center transition-colors"
            onClick={onDelete}
          >
            <Trash2 size={10} className="mr-1" />
            Delete
          </button>
        </>
      )}
      <button
        className="hover:text-blue-600 flex items-center transition-colors"
        onClick={onReply}
      >
        <CornerDownRight size={10} className="mr-1" />
        Reply
      </button>
    </div>
  );
}

function CommentReplies({
  comment,
  editingReply,
  editReplyContent,
  onEditReplyChange,
  onCancelEdit,
  onSaveEdit,
  onEdit,
  onDelete,
}) {
  const auth = useSelector((state) => state.user.loggedInUser);

  if (!comment.replies || comment.replies.length === 0) return null;

  return (
    <div className="mt-2 pl-2 sm:pl-3 border-l-2 border-gray-200 space-y-2 sm:space-y-3">
      {comment.replies.map((reply) => {
        const isAuthor = reply?.author?._id === auth._id;
        return (
          <div
            key={reply._id}
            className="bg-gray-50 p-2 sm:p-2.5 rounded-lg transition-shadow hover:shadow-sm group"
          >
            {editingReply && editingReply._id === reply._id ? (
              <div className="space-y-2">
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  value={editReplyContent}
                  onChange={onEditReplyChange}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-2 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                    onClick={() => onSaveEdit(reply._id)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs flex items-center">
                    <CornerDownRight size={10} className="mr-1 text-gray-400" />
                    {reply.author?.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {reply.edited ? "Edited • " : ""}
                    {new Date(reply.updatedAt).toDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{reply.content}</p>
                {isAuthor && (
                  <div className="flex items-center mt-1 space-x-3 text-[10px] sm:text-xs text-gray-500 opacity-70 group-hover:opacity-100">
                    <button
                      className="hover:text-blue-600 flex items-center transition-colors"
                      onClick={() => onEdit(reply)}
                    >
                      <Edit size={9} className="mr-1" />
                      Edit
                    </button>
                    <button
                      className="hover:text-red-600 flex items-center transition-colors"
                      onClick={() => onDelete(reply._id)}
                    >
                      <Trash2 size={9} className="mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReplyForm({ value, onChange, onCancel, onSubmit, recipientName }) {
  return (
    <div className="mt-2 pl-2 sm:pl-3 border-l-2 border-blue-300">
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Reply to ${recipientName}...`}
        rows="2"
        value={value}
        onChange={onChange}
      />
      <div className="mt-1 flex justify-end space-x-2">
        <button
          className="px-2 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
          onClick={onSubmit}
        >
          Reply
        </button>
      </div>
    </div>
  );
}
