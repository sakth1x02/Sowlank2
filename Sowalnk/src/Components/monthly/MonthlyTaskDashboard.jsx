import React from "react";
import { CircularProgress, Typography } from "@mui/material";
const MonthlyTaskDashboard = ({ openMonthlyTask, setOpenMonthlyTask }) => {
  const completed = 5;
  const total = 12;
  const progress = (completed / total) * 100;
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
      <div className="bg-rose-300 w-[90%] place-content-center max-w-lg p-6 rounded-lg shadow-lg gap-4">
        <h1 className="text-2xl font-bold">Elite Monthly Tracker</h1>
        <CircularProgress
          variant="determinate"
          value={100}
          className="absolute text-gray-300"
          size={60}
          thickness={4}
        />
        <CircularProgress
          variant="determinate"
          value={progress}
          className="text-yellow-500"
          size={60}
          thickness={4}
        />
        <Typography
          variant="caption"
          component="div"
          className="absolute font-semibold"
        >
          {completed}/{total}
        </Typography>
        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {months.map((month, index) => (
            <span
              key={month}
              className={`px-2 py-1 text-sm rounded-full ${
                index < completed
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTaskDashboard;
