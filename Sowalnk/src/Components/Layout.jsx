import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = () => {
  const auth = useSelector((state) => state.user.loggedInUser);

  const calculateRemainingTime = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const difference = midnight - now;

    return Math.floor(difference / (1000 * 60)); // Remaining time in minutes
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setRemainingTime(newRemainingTime);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const totalTimeInMinutes = 24 * 60; // Total time in a day in minutes
  const progressPercentage =
    ((totalTimeInMinutes - remainingTime) / totalTimeInMinutes) * 100;

  const getProgressBarColor = () => {
    if (progressPercentage < 50) {
      return "bg-green-600"; // Green for less than 50%
    } else if (progressPercentage < 80) {
      return "bg-orange-500"; // Orange for 50% to 80%
    } else {
      return "bg-red-600"; // Red for 80% and above
    }
  };

  return (
    <>
      <Header />
      {/* Progress Bar Container */}
      <div className={`flex ${auth ? "block" : "hidden"}`}>
        <div className={`w-full h-10 bg-gray-200 relative`}>
          {/* Progress Bar */}
          <div
            className={`h-full ${getProgressBarColor()} absolute right-0`}
            style={{ width: `${100 - progressPercentage}%` }} // Decrease from left to right
          ></div>
          {/* Remaining Time Text */}
          <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
            {remainingTime} minutes remaining
          </div>
        </div>
      </div>
      <div className="flex flex-row min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <main className="flex-1 relative p-4 lg:ml-64">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
