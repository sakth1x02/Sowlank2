import React, { useState } from "react";

const DailyGoals = () => {
  const dailyTasks = [
    "1. Reading",
    "2. Listening to Music",
    "3. Exercise",
    "4. Meditate",
    "5. Write Journal",
  ];

  const tasks = [
    "Plan the week",
    "Finish project",
    "Attend meeting",
    "Workout",
    "Read a book",
  ]; // Example tasks for the weekly section

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dailyToday = new Date().getDay(); // Current day index (0-6)

  // State to track task completion for the day
  const [dailyTaskCompletion, setDailyTaskCompletion] = useState(
    Array(dailyTasks.length).fill(false)
  );

  // State to track daily status for each task and day
  const [dailyDayStatus, setDailyDayStatus] = useState(
    dailyTasks.map(() => Array(7).fill(false))
  );

  // State to track weekly task completion status
  const [dayStatus, setDayStatus] = useState(
    tasks.map(() => Array(7).fill(false)) // Weekly status for each task
  );

  // Toggle daily task completion
  const toggleDailyTaskCompletion = (taskIndex) => {
    setDailyTaskCompletion((prevState) => {
      const newState = [...prevState];
      newState[taskIndex] = !newState[taskIndex];
      return newState;
    });
  };

  // Handle day-specific task completion for daily tasks
  const handleDailyDayClick = (taskIndex, dayIndex) => {
    setDailyDayStatus((prevState) => {
      const newState = [...prevState];
      newState[taskIndex][dayIndex] = !newState[taskIndex][dayIndex];
      return newState;
    });
  };

  // Handle day-specific task completion for weekly tasks
  const handleDayClick = (taskIndex, dayIndex) => {
    setDayStatus((prevState) => {
      const newState = [...prevState];
      newState[taskIndex][dayIndex] = !newState[taskIndex][dayIndex];
      return newState;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Container for Daily Goals and Calendar (2-column layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-rose-100 p-6 rounded-lg shadow-lg">
        {/* Daily Goals */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Daily Goals</h2>
          <div className="space-y-2">
            {dailyTasks.map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-center">
                <input
                  type="checkbox"
                  checked={dailyTaskCompletion[taskIndex]}
                  onChange={() => toggleDailyTaskCompletion(taskIndex)}
                  className="mr-2 cursor-pointer"
                />
                <span
                  className={`text-lg ${
                    dailyTaskCompletion[taskIndex]
                      ? "line-through text-gray-800"
                      : "text-gray-700"
                  }`}
                >
                  {task}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Calendar */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Daily Calendar</h2>
          <div className="grid grid-cols-7 gap-4 text-center">
            {days.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3
                  className={`text-sm font-bold ${
                    dayIndex === dailyToday ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {day}
                </h3>
                <div className="flex flex-col items-center space-y-2 mt-2">
                  {dailyTasks.map((_, taskIndex) => (
                    <input
                      key={taskIndex}
                      type="checkbox"
                      checked={dailyDayStatus[taskIndex][dayIndex]}
                      onChange={() => handleDailyDayClick(taskIndex, dayIndex)}
                      disabled={
                        !dailyTaskCompletion[taskIndex] ||
                        dayIndex !== dailyToday
                      }
                      className={`h-6 w-6 ${
                        dailyDayStatus[taskIndex][dayIndex]
                          ? "bg-green-200"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container for Weekly Goals and Calendar (2-column layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-100 p-6 rounded-lg shadow-lg">
        {/* Weekly Goals */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Weekly Goals</h2>
          <div className="space-y-2">
            {tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-center">
                <span className="text-lg text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Weekly Calendar
          </h2>
          <div className="grid grid-cols-7 gap-5 text-center">
            {days.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-sm font-bold text-gray-700">{day}</h3>
                <div className="flex flex-col items-center space-y-2 mt-2">
                  {tasks.map((_, taskIndex) => (
                    <input
                      key={taskIndex}
                      type="checkbox"
                      checked={dayStatus[taskIndex][dayIndex]}
                      onChange={() => handleDayClick(taskIndex, dayIndex)}
                      className={`h-6 w-6 ${
                        dayStatus[taskIndex][dayIndex]
                          ? "bg-green-200"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyGoals;
