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
    assignee: [],
    createdBy: auth._id,
  });
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [screenSize, setScreenSize] = useState("large");
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleTaskClick = async (task) => {
    setSelectedTask(task);
    try {
      const response = await fetch(`/api/v1/comment/task/${task._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setComments(data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/v1/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();

    setTasks([...tasks, data]);
    setShowAddTaskModal(false);
    setNewTask({
      title: "",
      dueDate: "",
      priority: "medium",
      assignee: null,
    });
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
      console.log("Comment added:", data);

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

  const handleDeleteComment = (taskId, commentId) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        return {
          ...task,
          comments: task.comments.filter(
            (comment) => comment._id !== commentId
          ),
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    if (selectedTask && selectedTask._id === taskId) {
      const updatedSelectedTask = updatedTasks.find(
        (task) => task._id === taskId
      );
      setSelectedTask(updatedSelectedTask);
    }

    // If we were editing this comment, cancel the edit
    if (editingComment && editingComment._id === commentId) {
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
      if (task._id === taskId) {
        return {
          ...task,
          comments: task.comments.map((comment) =>
            comment._id === editingComment._id
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

    if (selectedTask && selectedTask._id === taskId) {
      const updatedSelectedTask = updatedTasks.find(
        (task) => task._id === taskId
      );
      setSelectedTask(updatedSelectedTask);
    }

    setEditingComment(null);
    setEditCommentContent("");
  };
  //This is for toggling the complete part
  const handleToggleTaskCompletion = async (taskId) => {
    const response = await fetch(`/api/v1/group/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ completed: true }),
    });
    const updatedTasks = await response.json();

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === updatedTasks._id ? updatedTasks : t))
    );

    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask(updatedTasks);
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
      await response.json();
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
              <h1 className="text-xl font-bold">Group Collaboration</h1>
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
                {loading ? (
                  <Loader className="w-10 h-10 text-purple-700 place-content-center place-items-center  animate-spin mx-auto" />
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
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
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
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
                                <span>{task.dueDate.split("T")[0]}</span>
                              </div>
                              {/* {task.comments.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <MessageSquare size={14} />
                                  <span>{task.comments.length}</span>
                                </div>
                              )} */}
                            </div>

                            <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0" />
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
                className="mt-4 flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                <Plus size={18} className="mr-2" />
                <span>Add New Task</span>
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
                  <div className="mb-4 flex items-center justify-between ">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium">
                        {selectedTask.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(selectedTask._id)}
                      className="px-2 py-1 text-sm text-red-700 bg-red-200/30 hover:ring-1 hover:bg-red-200 rounded-lg border border-red-400"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Due Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={18} />
                        <span>Due Date</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedTask.dueDate.split("T")[0]}
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
                          {selectedTask?.assignee?.name || "No User added"}
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
                    <button
                      onClick={() =>
                        handleToggleTaskCompletion(selectedTask._id)
                      }
                    >
                      {selectedTask.completed ? (
                        <CheckCircle size={22} className="text-green-500" />
                      ) : (
                        <div className="text-sm border border-green-300 p-2 rounded-lg bg-green-300/20 hover:bg-green-500/40 hover:ring-1">
                          Mark Complete
                        </div>
                      )}
                    </button>

                    {/* Comments */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MessageSquare size={18} />
                          <span>Comments</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {selectedTask?.comments?.length || 0} comments
                        </span>
                      </div>

                      {selectedTask?.comments?.length > 0 ? (
                        <div className="space-y-4">
                          {selectedTask?.comments?.map((commentId) => {
                            const comment = comments?.find(
                              (c) => c._id === commentId
                            );

                            return comment ? (
                              <div key={commentId} className="flex space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                                <div className="flex-1" key={commentId}>
                                  {editingComment &&
                                  editingComment._id === commentId ? (
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
                                            handleSaveEditComment(
                                              selectedTask._id
                                            )
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
                                            {comment?.author?.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {comment?.timestamp}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {comment?.content}
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
                                              selectedTask._id,
                                              comment._id
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
                            ) : (
                              <Loader className="place-content-center place-items-center  animate-spin mx-auto h-5 w-5 " />
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No comments yet. Be the first to add one!
                        </p>
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
                                  handleAddComment(selectedTask._id)
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
