import React from "react";

const WeeksInMonth = ({ year, month, weekIndx, completedTask }) => {
  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1); // Start at the first day of the month
    while (date.getMonth() === month) {
      days.push(new Date(date)); // Push a copy of the date
      date.setDate(date.getDate() + 1); // Move to the next day
    }
    return days;
  };

  // Get all days in the selected month
  const daysInMonth = getDaysInMonth(year, month);

  // Group days into weeks
  const weeks = [];
  let currentWeek = [];
  daysInMonth.forEach((day) => {
    currentWeek.push(day);
    if (
      day.getDay() === 6 ||
      day.getTime() === daysInMonth[daysInMonth.length - 1].getTime()
    ) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold mb-4">
        Weeks in{" "}
        {new Date(year, month).toLocaleDateString("en-US", { month: "long" })}/
        {year}
      </h2>
      <div className="space-x-4 flex ">
        {weeks.map((week, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-gray-50 flex flex-col items-center justify-center space-y-3"
          >
            <label
              htmlFor={`weeklytask-${index}`}
              className="text-lg font-medium"
            >
              Week {index + 1}
            </label>
            <input
              id={`weeklytask-${index}`}
              name="weeklytask"
              type="checkbox"
              checked={index + 1 === weekIndx && completedTask > 0}
              onChange={() => {}}
              className=""
              style={{
                transform: "scale(1.5)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeksInMonth;
