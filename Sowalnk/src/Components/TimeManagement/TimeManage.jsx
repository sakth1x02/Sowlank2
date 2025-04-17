import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import TimeMethodCard from "./TimeMethodCard.jsx";
import EisenhowerMethod from "./EisenhowerMethod.jsx";
import ABCDEMethod from "./ABCDEMethod.jsx";
import TwoMinuteRule from "./TwoMinuteRule.jsx";
import EatFrog from "./EatFrog.jsx";
import GtdApp from "./GTD/GtdApp.jsx";
import MSCWMethod from "./MSCWMethod.jsx";
import ONEThreeFiveMethod from "./ONEThreeFiveMethod.jsx";
import Pomodoro from "./Pomodoro/Pomodoro.jsx";
import DeepWorkTimer from "./333Method/DeepWorker.jsx";
import Pareto80_20 from "./Pareto80/20.jsx";
import TaskBatchingApp from "./TaskBatching.jsx";
import WarrenBuffett525 from "./WarrenBuffett525.jsx";
import KanbanBoard from "./Kanbanboard.jsx";
import Pickle from "./PickleJAr.jsx";
import TimeBlocking from "./TimeBlocking/TimeBlocking.jsx";

const TimeManage = () => {
  const [activeMethod, setActiveMethod] = useState(null);

  const timeMethods = [
    {
      id: 1,
      name: "Pomodoro Technique",
      description: "Work in focused 25-minute intervals with short breaks.",
      // hidden: true,
    },
    {
      id: 2,
      name: "Eisenhower Matrix",
      description: "Prioritize tasks based on urgency and importance.",
      // hidden: true,
    },
    {
      id: 3,
      name: "ABCDE Method",
      description: "Categorize tasks and prioritize by importance.",
      // hidden: true,
    },
    {
      id: 4,
      name: "3-3-3 Method",
      description: "Balance deep work, shorter tasks, and maintenance tasks.",
      hidden: true,
    },
    {
      id: 5,
      name: "2 Minute Rule",
      description: "Complete quick tasks immediately to avoid procrastination.",
      hidden: true,
    },
    {
      id: 6,
      name: "80/20 Method",
      description: "Focus on the vital 20% that produces 80% of results.",
      hidden: true,
    },
    {
      id: 7,
      name: "Eat the Frog",
      description: "Do your most important and challenging tasks first.",
      hidden: true,
    },
    {
      id: 8,
      name: "Getting Things Done",
      description: "Capture, clarify, organize, reflect, and engage.",
      hidden: true,
    },
    {
      id: 9,
      name: "Kanban Board",
      description:
        "Visualize workflow with to-do, in-progress, and completed columns.",
      hidden: true,
    },
    {
      id: 10,
      name: "Task Batching",
      description: "Group similar tasks to minimize context switching.",
      hidden: true,
    },
    {
      id: 11,
      name: "Warren Buffet 5/25 Rule",
      description: "Focus only on your top 5 priorities.",
      hidden: true,
    },
    {
      id: 12,
      name: "MSCW Method",
      description:
        "Categorize tasks as Must-Have, Should-Have, Could-Have, or Won't-Have.",
      hidden: true,
    },
    {
      id: 13,
      name: "Time Blocking",
      description: "Schedule specific time blocks for different types of work.",
      hidden: true,
    },
    {
      id: 14,
      name: "1-3-5 Method",
      description:
        "Plan to accomplish 1 big task, 3 medium tasks, and 5 small tasks daily.",
      hidden: true,
    },
    {
      id: 15,
      name: "Pickle Jar Method",
      description:
        "Prioritize major tasks first, then fit in smaller tasks around them.",
      hidden: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-b  from-gray-50 to-gray-100"
    >
      <header className="w-full pt-16 px-8 md:px-12 flex flex-col items-center justify-between z-10">
        <div className={`${activeMethod === null ? "" : "hidden"} container `}>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center">
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

      {activeMethod !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="container  mx-auto px-2 py-4 md:px-10"
        >
          <button
            onClick={() => setActiveMethod(null)}
            className="mb-4 flex items-center gap-2 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Methods
          </button>
          {activeMethod === 1 && <Pomodoro />}
          {activeMethod === 2 && (
            <div className="blur-sm">
              <EisenhowerMethod />
            </div>
          )}
          {activeMethod === 3 && (
            <div className="blur-sm">
              <ABCDEMethod />
            </div>
          )}
          {activeMethod === 4 && (
            <div className="blur-sm">
              <DeepWorkTimer />
            </div>
          )}
          {activeMethod === 5 && (
            <div className="blur-sm">
              <TwoMinuteRule />
            </div>
          )}
          {activeMethod === 6 && (
            <div className="blur-sm">
              <Pareto80_20 />
            </div>
          )}
          {activeMethod === 7 && (
            <div className="blur-sm">
              <EatFrog />
            </div>
          )}
          {activeMethod === 8 && (
            <div className="blur-sm">
              <GtdApp />
            </div>
          )}
          {activeMethod === 9 && (
            <div className="blur-sm">
              <KanbanBoard />
            </div>
          )}
          {activeMethod === 10 && (
            <div className="blur-sm">
              <TaskBatchingApp />
            </div>
          )}
          {activeMethod === 11 && (
            <div className="blur-sm">
              <WarrenBuffett525 />
            </div>
          )}
          {activeMethod === 12 && (
            <div className="blur-sm">
              <MSCWMethod />
            </div>
          )}
          {activeMethod === 13 && (
            <div className="blur-sm">
              <TimeBlocking />
            </div>
          )}
          {activeMethod === 14 && (
            <div className="blur-sm">
              <ONEThreeFiveMethod />
            </div>
          )}
          {activeMethod === 15 && (
            <div className="blur-sm">
              <Pickle />
            </div>
          )}
        </motion.div>
      ) : (
        <div className="px-6 py-4 md:px-10">
          <div className="container mx-auto max-w-7xl mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Browse Time Management Methods
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timeMethods.map((method) =>
                method.hidden ? (
                  <div key={method.id} className="relative">
                    <div className="blur-sm">
                      <TimeMethodCard method={method} onClick={() => {}} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/80 px-3 py-1 rounded-full text-sm font-medium text-white">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <TimeMethodCard
                    key={method.id}
                    method={method}
                    onClick={() => setActiveMethod(method.id)}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeMethod === null && (
        <footer className="w-full py-6 px-8 text-center text-gray-500 text-sm">
          <p>Enhance your productivity with these time management techniques</p>
        </footer>
      )}
    </motion.div>
  );
};

export default TimeManage;
