import React from "react";
import { useSelector } from "react-redux";
import WeeksInMonth from "../WeeksInMonth.jsx";
const WeeklyTaskDashboard = ({ openWeeklyTask, setOpenWeeklyTask }) => {
  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((store) => store.weekly);

  const today = new Date();
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor(
      (date - startOfYear) / (1000 * 60 * 60 * 24)
    );
    return Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
  };
  const currentWeekNumber = getWeekNumber(today);

  // Logic for filter isComplete and unique day or date
  const completedTasks = dailyTask.filter((task) => task.isCompleted);
  const uniqueWeekdays = new Set(
    completedTasks.map((task) => new Date(task.date).getDay())
  );

  const completedTask =
    uniqueWeekdays.size >= 7 ||
    weeklyTask.filter((task) => task.isCompleted).length > 0;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setOpenWeeklyTask(!openWeeklyTask)}
    >
      <div className="bg-rose-300 w-[90%] max-w-xl p-6 rounded-lg shadow-lg ">
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Weekly Goals</h2>
          <div className="space-y-2">
            {weeklyTask.map((task, taskIndex) => (
              <div key={task._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={task?.isCompleted || false}
                  onChange={() => {}}
                  className="mr-2 cursor-pointer "
                  style={{
                    transform: "scale(1.5)",
                  }}
                />
                <span
                  className={`text-lg ${
                    task?.isCompleted
                      ? "line-through text-gray-800"
                      : "text-gray-700"
                  }`}
                >
                  {task.taskName}
                </span>
              </div>
            ))}
          </div>
        </div>

        <WeeksInMonth
          year={today.getFullYear()}
          month={today.getMonth()}
          weekIndx={Math.floor(currentWeekNumber / 5)}
          completedTask={completedTask}
        />
      </div>
    </div>
  );
};

export default WeeklyTaskDashboard;
