import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import TimeMethodCard from "./TimeMethodCard.jsx";
import EisenhowerMethod from "./EisenhowerMethod.jsx";
import ABCDEMethod from "./ABCDEMethod.jsx";
import TwoMinuteRule from "./TwoMinuteRule.jsx";
const TimeManage = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const timeMethods = [
    {
      id: 1,
      name: "Pomodoro Technique",
      description: "Work in focused 25-minute intervals with short breaks.",
    },
    {
      id: 2,
      name: "Eisenhower Matrix",
      description: "Prioritize tasks based on urgency and importance.",
    },
    {
      id: 3,
      name: "ABCDE Method",
      description: "Categorize tasks and prioritize by importance.",
    },
    {
      id: 4,
      name: "3-3-3 Method",
      description: "Balance deep work, shorter tasks, and maintenance tasks.",
    },
    {
      id: 5,
      name: "2 Minute Rule",
      description: "Complete quick tasks immediately to avoid procrastination.",
    },
    {
      id: 6,
      name: "80/20 Method",
      description: "Focus on the vital 20% that produces 80% of results.",
    },
    {
      id: 7,
      name: "Eat the Frog",
      description: "Do your most important and challenging tasks first.",
    },
    {
      id: 8,
      name: "Getting Things Done",
      description: "Capture, clarify, organize, reflect, and engage.",
    },
    {
      id: 9,
      name: "Kanban Board",
      description:
        "Visualize workflow with to-do, in-progress, and completed columns.",
    },
    {
      id: 10,
      name: "Task Batching",
      description: "Group similar tasks to minimize context switching.",
    },
    {
      id: 11,
      name: "Warren Buffet 5/25 Rule",
      description: "Focus only on your top 5 priorities.",
    },
    {
      id: 12,
      name: "MSCW Method",
      description:
        "Categorize tasks as Must-Have, Should-Have, Could-Have, or Won't-Have.",
    },
    {
      id: 13,
      name: "Time Blocking",
      description: "Schedule specific time blocks for different types of work.",
    },
    {
      id: 14,
      name: "1-3-5 Method",
      description:
        "Plan to accomplish 1 big task, 3 medium tasks, and 5 small tasks daily.",
    },
    {
      id: 15,
      name: "Pickle Jar Method",
      description:
        "Prioritize major tasks first, then fit in smaller tasks around them.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`
        min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col
        
      `}
    >
      <header className="w-full pt-16 px-8 md:px-12 flex flex-col items-center justify-between z-10">
        <div className="container max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center ">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-2 mb-1"
              >
                <Clock className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600 tracking-wide">
                  TIME MANAGEMENT ESSENTIALS
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
              >
                15 Methods to Master Your Time
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-500 mt-2 max-w-2xl text-center md:text-left"
              >
                Explore these proven techniques to enhance your productivity and
                take control of your schedule.
              </motion.p>
            </div>
          </div>
        </div>
      </header>

      <div className="my-1" />

      <main className="flex-1 overflow-hidden px-6 py-4 md:px-10">
        <div className="container mx-auto max-w-7xl">
          {activeMethod !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="my-8"
            >
              <button
                variant="ghost"
                className="mb-4 flex items-center gap-2 group"
                onClick={() => setActiveMethod(null)}
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to All Methods
              </button>
              <div className="grid place-items-center p-6">
                {/* <h2 className="text-2xl font-bold mb-4">
                  {timeMethods[activeMethod - 1].name}
                </h2>
                <p className="text-gray-500 mb-6">
                  {timeMethods[activeMethod - 1].description}
                </p> */}
                {activeMethod === 2 && <EisenhowerMethod />}
                {activeMethod === 3 && <ABCDEMethod />}
                {activeMethod === 5 && <TwoMinuteRule />}
              </div>
            </motion.div>
          ) : (
            <div className="my-8">
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Browse Time Management Methods
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {timeMethods.map((method) => (
                    <TimeMethodCard
                      key={method.id}
                      method={method}
                      onClick={() => setActiveMethod(method.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-6 px-8 text-center text-gray-500 text-sm">
        <p>Enhance your productivity with these time management techniques</p>
      </footer>
    </motion.div>
  );
};

export default TimeManage;
