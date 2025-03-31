import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Check } from "lucide-react";

const Notification = ({ onClose }) => {
  const { dailyTask } = useSelector((state) => state.task);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("unread");

  // Filter tasks that are incomplete and not exceeded time
  const getPendingTasks = () => {
    return dailyTask.filter(
      (task) => !task.isCompleted && !task.hasExceededTime
    );
  };

  // Generate notifications 5 minute before end time
  useEffect(() => {
    const pendingTasks = getPendingTasks();
    const now = new Date();

    const newNotifications = pendingTasks
      .filter((task) => {
        if (!task.endTime) return false;

        // Parse the HH:mm time string
        const [hours, minutes] = task.endTime.split(":").map(Number);

        // Create a Date object for today with this end time
        const endTimeToday = new Date();
        endTimeToday.setHours(hours, minutes, 0, 0);

        // Calculate difference in minutes
        const timeDiff = (endTimeToday - now) / (1000 * 60);
        return timeDiff <= 5 && timeDiff >= 0;
      })
      .map((task) => ({
        id: task._id,
        message: `Task "${task.taskName}" is ending soon!`,
        endTime: task.endTime,
        fullEndTime: new Date().setHours(
          ...task.endTime.split(":").map(Number)
        ),
        isRead: false,
        createdAt: new Date().toISOString(),
      }));

    setNotifications((prev) => {
      const existingIds = prev.map((n) => n.id);
      const uniqueNew = newNotifications.filter(
        (n) => !existingIds.includes(n.id)
      );
      return [...prev, ...uniqueNew];
    });
  }, [dailyTask]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="fixed right-4 top-20 w-80 bg-white shadow-lg rounded-lg z-50 border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-lg">Notifications</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-2 py-1 text-xs rounded ${
              activeTab === "unread" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-2 py-1 text-xs rounded ${
              activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <ul>
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-3 border-b border-gray-100 ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between">
                  <p>{notification.message}</p>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ends at: {notification.endTime}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 flex justify-between">
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
        {/* <button
          onClick={clearAll}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear all
        </button> */}
      </div>
    </div>
  );
};

export default Notification;
