import React from "react";
import { useSelector } from "react-redux";
import CircularProgressDemo from "./Progress";

const MonthlyTaskDashboard = ({ openMonthlyTask, setOpenMonthlyTask }) => {
  const { monthlyTask } = useSelector((store) => store.monthly);

  const { dailyTask } = useSelector((state) => state.task);

  const currentMonthIndex = new Date().getMonth();

  function getDaysInCurrentMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const nextMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(nextMonth - 1);
    return lastDayOfMonth.getDate();
  }
  // Logic for filter isComplete and unique day or date and taking the current month
  const completedMonths = dailyTask.reduce((months, task) => {
    if (task.isCompleted) {
      const taskMonth = new Date(task.dateOnCreated).getMonth();
      const uniqueDatesInMonth = new Set(
        dailyTask
          .filter(
            (t) => t.isCompleted && new Date(t.date).getMonth() === taskMonth
          )
          .map((t) => new Date(t.date).getDate())
      );

      if (uniqueDatesInMonth.size >= getDaysInCurrentMonth()) {
        months.add(taskMonth);
      }
    }
    return months;
  }, new Set());

  // Add months from completed monthly tasks
  monthlyTask.forEach((task) => {
    if (task.isCompleted) {
      const taskMonth = new Date(task.dateOnCreated).getMonth();
      completedMonths.add(taskMonth);
    }
  });

  const progress = completedMonths.size;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setOpenMonthlyTask(!openMonthlyTask)}
    >
      <div className="bg-rose-300 w-[90%] max-w-xl p-6 rounded-lg shadow-lg flex gap-2">
        {/* Monthly Goal */}
        <div className="w-[40%] overflow-auto bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Monthly Goals
          </h2>
          <div className="space-y-2">
            {monthlyTask.map((task, taskIndex) => (
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

        {/* clendar */}
        <div className=" bg-white rounded-lg shadow-lg">
          <div className="p-4 flex flex-col items-center gap-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800">
              Elite Monthly Tracker
            </h2>

            {/* Progress Circle */}
            <CircularProgressDemo progressValue={progress} />

            {/* Months Grid */}
            <div className="grid grid-cols-6 gap-2 w-full">
              {months.map((month, index) => {
                const isCompleted = completedMonths.has(index);
                const isCurrentMonth = index === currentMonthIndex;

                return (
                  <div
                    key={month}
                    className={`
                    flex items-center justify-center p-2 rounded-full text-sm
                    ${
                      isCurrentMonth
                        ? isCompleted
                          ? "bg-green-200 text-green-800"
                          : "bg-blue-200 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                  >
                    {month}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MonthlyTaskDashboard;
