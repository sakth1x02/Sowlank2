import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../store/task-slice";
import WeeksInMonth from "./WeeksInMonth.jsx";
import BarCharts from "./BarCharts.jsx";
const DailyGoals = () => {
  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((store) => store.weekly);
  const dispatch = useDispatch();
  const [daysWithData, setDaysWithData] = useState([]);
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
  const completedTask = uniqueWeekdays.size >= 7;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });

    const jsDayAbbreviations = ["S", "M", "T", "W", "T", "F", "S"];

    const daysData = dates.map((date) => {
      const dayAbbrev = jsDayAbbreviations[date.getDay()];
      const tasksForDate = dailyTask.filter((task) => {
        const taskDate = new Date(task.date);
        return taskDate.toDateString() === date.toDateString();
      });

      return {
        date,
        dayAbbrev,
        taskCount: tasksForDate,
        hasCompleted: tasksForDate.some((task) => task.isCompleted),
      };
    });

    setDaysWithData(daysData);
  }, [dailyTask]);

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        {/* Container for Daily Goals and Calendar (2-column layout) */}
        <div className="flex gap-5">
          <div className="w-[60%] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-rose-100 p-6 rounded-lg shadow-lg">
            {/* Daily Goals */}
            <div className=" flex-1 bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Daily Goals
              </h2>
              <div className="space-y-2">
                {dailyTask.map((task, taskIndex) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 ml-[3px]"
                  >
                    <span
                      className={`text-lg ${
                        task?.isCompleted
                          ? "line-through text-gray-800"
                          : "text-gray-700"
                      }`}
                    >
                      {task.taskName}
                    </span>

                    <input
                      type="checkbox"
                      checked={task?.isCompleted || false}
                      onChange={() => {}}
                      className="mr-2 cursor-pointer "
                      style={{
                        transform: "scale(1.5)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Calendar */}
            <div className="w-[140%] overflow-auto flex-1 bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Daily Calendar
              </h2>
              <div className="grid grid-cols-7 gap-4 text-center">
                {daysWithData.map(
                  ({ dayAbbrev, taskCount, hasCompleted, date }, index) => {
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    return (
                      <div key={index}>
                        <h3
                          className={`text-sm font-bold ${
                            isToday ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {dayAbbrev}
                        </h3>
                        <div className="flex flex-col items-center space-y-2 mt-2">
                          <span className="text-sm text-gray-700">
                            {taskCount.length}
                          </span>
                          {(taskCount.length === 0 && (
                            <input
                              id="indx"
                              type="checkbox"
                              checked={false}
                              readOnly
                              className={`h-6 w-6 ${
                                hasCompleted ? "bg-green-200" : "bg-gray-200"
                              } rounded-sm border-gray-300`}
                            />
                          )) ||
                            taskCount.map((task, indx) => (
                              <input
                                key={indx}
                                id={indx}
                                type="checkbox"
                                checked={task.isCompleted || false}
                                readOnly
                                className={`h-6 w-6 ${
                                  hasCompleted ? "bg-green-200" : "bg-gray-200"
                                } rounded-sm border-gray-300`}
                              />
                            ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Container for Weekly Goals and Calendar (2-column layout) */}
          <div className="w-[60%] overflow-auto grid grid-cols-1  gap-6 bg-rose-100 p-6 rounded-lg shadow-lg">
            <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Weekly Goals
              </h2>
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
              weekIndx={currentWeekNumber}
              completedTask={completedTask}
            />
          </div>
        </div>

        {/* barcharts */}
        <BarCharts />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-100 p-6 rounded-lg shadow-lg">
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
        //Weekly Calendar
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
      </div> */}
    </div>
  );
};

export default DailyGoals;

// const days = ["M", "T", "W", "T", "F", "S", "S"];
// const dailyToday = new Date().getDay();

// const isAnyTaskCompleted = (dayIndex) => {
//   const todayTasks = dailyTask.filter((task) => {
//     const taskDate = new Date(task.date);
//     return taskDate.getDay() === dayIndex;
//   });
//   return todayTasks.some((task) => task.isCompleted);
// };
