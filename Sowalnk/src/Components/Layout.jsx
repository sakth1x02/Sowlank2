import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import Notification from "./Notification/Notification.jsx";
import { io } from "socket.io-client";

const Layout = () => {
  const auth = useSelector((state) => state.user.loggedInUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  // const [showStickyNotes, setShowStickyNotes] = useState(false); // State for sticky notes popup
  // const [isBouncing, setIsBouncing] = useState(true); // State for bounce animation

  useEffect(() => {
    const newSocket = io();
    // const newSocket = io("http://localhost:2000");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Authenticate socket when user logs in
  useEffect(() => {
    if (socket && auth?._id) {
      socket.emit("authenticate", auth._id);
    }
  }, [socket, auth]);

  // Listen for task notifications
  useEffect(() => {
    if (!socket) return;

    const handleTaskNotification = (data) => {
      setUnreadCount((prev) => prev + 1);
      const audio = new Audio("/notification.mp3");
      audio
        .play()
        .catch((error) =>
          console.error("Failed to play notification sound:", error)
        );
    };

    socket.on("task-ending-soon", handleTaskNotification);

    return () => {
      socket.off("task-ending-soon", handleTaskNotification);
    };
  }, [socket]);

  // Calculate remaining time function
  function calculateRemainingTime() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const difference = midnight - now;
    return Math.floor(difference / (1000 * 60)); // Remaining time in minutes
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setRemainingTime(newRemainingTime);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const totalTimeInMinutes = 24 * 60;
  const progressPercentage =
    ((totalTimeInMinutes - remainingTime) / totalTimeInMinutes) * 100;

  const getProgressBarColor = () => {
    if (progressPercentage < 50) return "bg-green-600";
    if (progressPercentage < 80) return "bg-orange-500";
    return "bg-red-600";
  };

  return (
    <div className="overflow-x-hidden">
      <Header />
      {/* Progress Bar Container */}
      <div
        className={`flex ${
          auth ? "block" : "hidden"
        } top-16 relative z-30 min-w-full right-0`}
      >
        <div className={`w-full h-10 bg-gray-200 relative`}>
          {/* Progress Bar */}
          <div
            className={`h-full ${getProgressBarColor()} absolute right-0`}
            style={{ width: `${100 - progressPercentage}%` }}
          ></div>
          {/* Remaining Time Text */}
          <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
            {remainingTime} minutes remaining
          </div>
          <div className="absolute inset-0 flex items-center justify-end pr-4">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  setUnreadCount(0);
                }
              }}
              className="relative p-1 hover:bg-gray-300 rounded-full duration-300"
            >
              <Bell className="h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotifications && (
        <Notification
          onClose={() => setShowNotifications(false)}
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
        />
      )}

      <div className="flex flex-row min-h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 relative p-4 lg:ml-64 top-14">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
