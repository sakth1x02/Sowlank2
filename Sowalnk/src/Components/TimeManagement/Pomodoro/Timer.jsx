import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TimerComponent({
  workDuration,
  setWorkDuration,
  shortBreakDuration,
  setShortBreakDuration,
  longBreakDuration,
  setLongBreakDuration,
  phase,
  setPhase,
  timeLeft,
  setTimeLeft,
  isActive,
  setIsActive,
  pomodoros,
  setPomodoros,
  currentTask,
  autoStart,
  soundEnabled,
  onSessionComplete,
  cycle,
}) {
  const [showSettings, setShowSettings] = useState(false); // State to toggle settings visibility

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  const getProgress = () => {
    const totalTime =
      phase === "Work"
        ? workDuration
        : phase === "Short Break"
        ? shortBreakDuration
        : longBreakDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (soundEnabled) {
        new Audio("https://www.soundjay.com/buttons/beep-01a.mp3").play();
      }
      setIsActive(autoStart);
      onSessionComplete(phase);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase, autoStart, soundEnabled, onSessionComplete]);

  // Handle duration changes and ensure the current timeLeft updates if the phase matches
  const handleDurationChange = (phaseType, value) => {
    const newDuration = Math.max(1, value) * 60; // Convert minutes to seconds, ensure at least 1 minute
    if (phaseType === "Work") {
      setWorkDuration(newDuration);
      if (phase === "Work") setTimeLeft(newDuration);
    } else if (phaseType === "Short Break") {
      setShortBreakDuration(newDuration);
      if (phase === "Short Break") setTimeLeft(newDuration);
    } else if (phaseType === "Long Break") {
      setLongBreakDuration(newDuration);
      if (phase === "Long Break") setTimeLeft(newDuration);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 w-full to-indigo-600 overflow-scroll rounded-2xl shadow-xl p-8 text-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">{phase}</h2>
        {phase === "Work" && currentTask && (
          <p className="text-lg opacity-80">Task: {currentTask}</p>
        )}
      </div>

      <div className="relative w-full h-72  mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-white/20"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
          />
          <circle
            className="text-white"
            strokeWidth="4"
            strokeDasharray={`${getProgress() * 3.01}, 301`}
            strokeDashoffset="0"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl  font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {["Work", "Short Break", "Long Break"].map((p) => (
          <button
            key={p}
            onClick={() => {
              setPhase(p);
              setTimeLeft(
                p === "Work"
                  ? workDuration
                  : p === "Short Break"
                  ? shortBreakDuration
                  : longBreakDuration
              );
              setIsActive(false);
            }}
            className={`px-4 py-2 rounded-full font-medium ${
              phase === p
                ? "bg-white text-purple-600"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={() =>
            setTimeLeft(
              phase === "Work"
                ? workDuration
                : phase === "Short Break"
                ? shortBreakDuration
                : longBreakDuration
            )
          }
          className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-center mb-6 text-lg">
        Cycle #{cycle} | Pomodoros: {pomodoros}
      </p>

      {/* Timer Settings Section */}
      <div className="text-center">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white/20 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-colors mb-4"
        >
          {showSettings ? "Hide Settings" : "Show Settings"}
        </button>

        {showSettings && (
          <div className="bg-white/10 p-4 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={Math.floor(workDuration / 60)}
                onChange={(e) =>
                  handleDurationChange("Work", parseInt(e.target.value))
                }
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Short Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={Math.floor(shortBreakDuration / 60)}
                onChange={(e) =>
                  handleDurationChange("Short Break", parseInt(e.target.value))
                }
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={Math.floor(longBreakDuration / 60)}
                onChange={(e) =>
                  handleDurationChange("Long Break", parseInt(e.target.value))
                }
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimerComponent;
