import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
function TimerComponent({
  workDuration,
  setWorkDuration,
  shortBreakDuration,
  setShortBreakDuration,
  longBreakDuration,
  setLongBreakDuration,
  phase,
  setPhase,
  pomodoros,
  currentTask,
  onSessionComplete,
  cycle,
}) {
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Local state for input values
  const [localWorkDuration, setLocalWorkDuration] = useState(
    Math.floor(workDuration / 60)
  );
  const [localShortBreakDuration, setLocalShortBreakDuration] = useState(
    Math.floor(shortBreakDuration / 60)
  );
  const [localLongBreakDuration, setLocalLongBreakDuration] = useState(
    Math.floor(longBreakDuration / 60)
  );

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
    const savedTimer = JSON.parse(localStorage.getItem("pomodoroTimer"));

    if (savedTimer) {
      // If saved phase differs from current phase, update phase first
      if (savedTimer.phase !== phase) {
        setPhase(savedTimer.phase);
        return; // Exit early, this effect will re-run with new phase
      }

      const elapsedSeconds = Math.floor(
        (Date.now() - savedTimer.timestamp) / 1000
      );
      let newTimeLeft = savedTimer.timeLeft - elapsedSeconds;

      // Get duration based on current phase
      const duration =
        phase === "Work"
          ? workDuration
          : phase === "Short Break"
          ? shortBreakDuration
          : longBreakDuration;

      if (newTimeLeft <= 0) {
        localStorage.removeItem("pomodoroTimer");
        setTimeLeft(duration);
        setIsActive(false);
        onSessionComplete(phase);
      } else {
        setTimeLeft(newTimeLeft);
        setIsActive(savedTimer.isActive);
      }
    } else {
      // Initialize with current phase duration
      setTimeLeft(
        phase === "Work"
          ? workDuration
          : phase === "Short Break"
          ? shortBreakDuration
          : longBreakDuration
      );
    }
  }, [
    phase,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    setPhase,
    onSessionComplete,
  ]);

  useEffect(() => {
    if (isActive) {
      const timerData = {
        phase,
        timeLeft,
        isActive,
        timestamp: Date.now(),
      };
      localStorage.setItem("pomodoroTimer", JSON.stringify(timerData));
    }
  }, [isActive, timeLeft, phase]);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft <= 0) {
      new Audio("https://www.soundjay.com/buttons/beep-01a.mp3").play();
      setIsActive(false);
      localStorage.removeItem("pomodoroTimer");
      onSessionComplete(phase);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase, onSessionComplete]);

  // Debounced duration update
  // In handleDurationChange
  const handleDurationChange = useCallback(
    (phaseType, value) => {
      const newDuration = Math.max(1, value) * 60;

      // Update local state
      switch (phaseType) {
        case "Work":
          setLocalWorkDuration(value);
          setWorkDuration(newDuration);
          break;
        case "Short Break":
          setLocalShortBreakDuration(value);
          setShortBreakDuration(newDuration);
          break;
        case "Long Break":
          setLocalLongBreakDuration(value);
          setLongBreakDuration(newDuration);
          break;
      }

      // If timer is inactive and current phase matches, update timeLeft
      if (!isActive && phase === phaseType) {
        setTimeLeft(newDuration);
      }

      // Update localStorage if timer is active
      if (isActive && phase === phaseType) {
        const timerData = {
          phase,
          timeLeft: newDuration,
          isActive,
          timestamp: Date.now(),
        };
        localStorage.setItem("pomodoroTimer", JSON.stringify(timerData));
      }
    },
    [
      phase,
      isActive,
      setWorkDuration,
      setShortBreakDuration,
      setLongBreakDuration,
    ]
  );

  useEffect(() => {
    setLocalWorkDuration(Math.floor(workDuration / 60));
    setLocalShortBreakDuration(Math.floor(shortBreakDuration / 60));
    setLocalLongBreakDuration(Math.floor(longBreakDuration / 60));
  }, [workDuration, shortBreakDuration, longBreakDuration]);

  const handleReset = () => {
    setTimeLeft(
      phase === "Work"
        ? workDuration
        : phase === "Short Break"
        ? shortBreakDuration
        : longBreakDuration
    );
    setIsActive(false);
    localStorage.removeItem("pomodoroTimer");
  };

  useEffect(() => {
    const taskName = localStorage.getItem("currentPomodoroTask");
    !taskName && handleReset();
  }, [currentTask]);

  return (
    <div className="bg-gradient-to-br from-purple-600 w-full to-indigo-600 overflow-scroll rounded-2xl shadow-xl p-8 text-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">{phase}</h2>
        {currentTask && (
          <p className="text-lg opacity-80">Task: {currentTask}</p>
        )}
      </div>

      <div className="relative w-full h-72 mb-8">
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
          <span className="text-4xl font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {["Work", "Short Break", "Long Break"].map((p) => (
          <button
            key={p}
            onClick={() => {
              if (p !== phase) {
                // Only allow switching to breaks if a task is selected
                if (!currentTask) {
                  toast.error("Select a task before starting a break");
                  return;
                }
                setPhase(p);
                setTimeLeft(
                  p === "Work"
                    ? workDuration
                    : p === "Short Break"
                    ? shortBreakDuration
                    : longBreakDuration
                );
                setIsActive(false);
                localStorage.removeItem("pomodoroTimer");
              }
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
          onClick={() => {
            setIsActive(!isActive);
            if (isActive) {
              localStorage.removeItem("pomodoroTimer");
            }
          }}
          className={`bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors ${
            currentTask === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentTask === null ? true : false}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-center mb-6 text-lg">
        Cycle #{cycle} | Pomodoros: {pomodoros}
      </p>

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
                value={localWorkDuration}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value) || 1;
                  handleDurationChange("Work", value);
                }}
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
                value={localShortBreakDuration}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value) || 1;
                  handleDurationChange("Short Break", value);
                }}
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
                value={localLongBreakDuration}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value) || 1;
                  handleDurationChange("Long Break", value);
                }}
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(TimerComponent);
