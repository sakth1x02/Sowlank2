import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

function GamificationComponent({
  points,
  level,
  world,
  setWorld,
  streak,
  dailyChallenge,
  setDailyChallenge,
  pomodoros,
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const pointsPerLevel = 100;

  const achievements = [
    {
      id: "focus_novice",
      name: "Focus Novice",
      requirement: 5,
      description: "Complete 5 Pomodoros",
    },
    {
      id: "streak_master",
      name: "Streak Master",
      requirement: 7,
      description: "Maintain a 7-day streak",
    },
    {
      id: "task_champion",
      name: "Task Champion",
      requirement: 10,
      description: "Complete 10 tasks",
    },
  ];

  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  useEffect(() => {
    // Check for achievements
    if (points >= 150 && !unlockedAchievements.includes("focus_novice")) {
      setUnlockedAchievements((prev) => [...prev, "focus_novice"]);
      setShowConfetti(true);
    }

    if (streak >= 7 && !unlockedAchievements.includes("streak_master")) {
      setUnlockedAchievements((prev) => [...prev, "streak_master"]);
      setShowConfetti(true);
    }
  }, [pomodoros, streak, unlockedAchievements]);

  useEffect(() => {
    if (
      dailyChallenge.progress >= dailyChallenge.target &&
      !dailyChallenge.completed
    ) {
      setDailyChallenge((prev) => ({ ...prev, completed: true }));
      setShowConfetti(true);
    }
  }, [dailyChallenge.progress, dailyChallenge.completed]);

  const getWorldTheme = () => {
    switch (world) {
      case "Forest":
        return "bg-green-100 border-green-300";
      case "Mountain":
        return "bg-blue-100 border-blue-300";
      case "Sky":
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const handleWorldChange = (e) => {
    setWorld(e.target.value);
  };

  return (
    <div className={`rounded-2xl shadow-xl p-6 border ${getWorldTheme()}`}>
      {showConfetti && (
        <Confetti recycle={false} numberOfPieces={200} height={1500} />
      )}
      <h2 className="text-2xl font-bold text-purple-800 mb-4">Your Journey</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Level</p>
          <p className="text-2xl font-bold text-purple-700">{level}</p>
        </div>
        <div className="bg-white/50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Points</p>
          <p className="text-2xl font-bold text-purple-700">{points}</p>
        </div>
        <div className="bg-white/50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">World</p>
          <select
            value={world}
            onChange={handleWorldChange}
            className="w-full mt-1 p-1 rounded"
          >
            <option value="Forest">Forest</option>
            <option value="Mountain">Mountain</option>
            <option value="Sky">Sky</option>
          </select>
        </div>
        <div className="bg-white/50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Streak</p>
          <p className="text-2xl font-bold text-purple-700">{streak}d</p>
        </div>
      </div>

      {/* <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Next Level Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>
      </div> */}

      {/* <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Daily Quest</p>
        <p className="text-sm text-gray-600">{dailyChallenge.description}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{
              width: `${
                (dailyChallenge.progress / dailyChallenge.target) * 100
              }%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {dailyChallenge.progress}/{dailyChallenge.target}
        </p>
      </div> */}

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Achievements</p>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-2 rounded-lg text-center ${
                unlockedAchievements.includes(ach.id)
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <p className="text-sm font-medium">{ach.name}</p>
              <p className="text-xs">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamificationComponent;
