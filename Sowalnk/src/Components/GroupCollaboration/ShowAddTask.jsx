import React, { useState } from "react";
import { Plus, User, X, Mail } from "lucide-react";

const ShowAddTask = ({
  setShowAddTaskModal,
  newTask,
  setNewTask,
  handleSubmit,
  members,
}) => {
  const [emailInvites, setEmailInvites] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmailInvite = () => {
    if (newEmail && !emailInvites.includes(newEmail)) {
      setEmailInvites([...emailInvites, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmailInvite = (email) => {
    setEmailInvites(emailInvites.filter((e) => e !== email));
  };

  const handleSubmitWithInvites = async (e) => {
    e.preventDefault();
    // Add email invites to the task data
    const taskWithInvites = {
      ...newTask,
      emailInvites: emailInvites,
    };
    await handleSubmit(e, taskWithInvites);
  };

  return (
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
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below to create a new task
            </p>
          </div>

          <form onSubmit={handleSubmitWithInvites} className="space-y-4">
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

            {/* Email Invites Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Invite Team Members <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddEmailInvite}
                    className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <Mail size={16} className="mr-2" />
                    Add
                  </button>
                </div>

                {/* Display added email invites */}
                {emailInvites.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {emailInvites.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between bg-blue-50 text-blue-700 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm">{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmailInvite(email)}
                          className="text-blue-400 hover:text-blue-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  value={newTask.description || ""}
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
  );
};

export default ShowAddTask;

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
