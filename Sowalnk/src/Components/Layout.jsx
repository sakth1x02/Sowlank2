import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import Notification from "./Notification/Notification.jsx";

const Layout = () => {
  const auth = useSelector((state) => state.user.loggedInUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());
  const [unreadCount, setUnreadCount] = useState(0);
  const { dailyTask } = useSelector((state) => state.task);
  const countedTasksRef = useRef(new Set()); // Track which tasks we've already counted

  const getPendingTasks = () => {
    return dailyTask.filter(
      (task) => !task.isCompleted && !task.hasExceededTime
    );
  };

  // Generate notifications 5 minute before end time
  useEffect(() => {
    const pendingTasks = getPendingTasks();
    const now = new Date();
    let newCount = 0;

    pendingTasks.forEach((task) => {
      if (!task.endTime) return;

      // Parse the HH:mm time string
      const [hours, minutes] = task.endTime.split(":").map(Number);

      // Create a Date object for today with this end time
      const endTimeToday = new Date();
      endTimeToday.setHours(hours, minutes, 0, 0);

      // Calculate difference in minutes
      const timeDiff = (endTimeToday - now) / (1000 * 60);

      if (timeDiff <= 5 && timeDiff >= 0) {
        // Only count if we haven't counted this task before
        if (!countedTasksRef.current.has(task._id)) {
          countedTasksRef.current.add(task._id);
          newCount++;
        }
      }
    });

    if (newCount > 0) {
      setUnreadCount((prev) => prev + newCount);
    }
  }, [dailyTask]);

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
    <>
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
                // Reset count when opening notifications
                if (!showNotifications) {
                  setUnreadCount(0);
                  countedTasksRef.current.clear();
                }
              }}
              className="relative p-1 hover:bg-gray-300 rounded-full duration-300"
            >
              <Bell className="h-5" />
              {/* Notification badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pass the update function to Notification */}
      {showNotifications && (
        <Notification onClose={() => setShowNotifications(false)} />
      )}

      <div className="flex flex-row min-h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 relative p-4 lg:ml-64 top-14">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
