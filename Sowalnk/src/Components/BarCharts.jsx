import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useSelector } from "react-redux";
const BarCharts = () => {
  const { dailyTask } = useSelector((state) => state.task);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const dataset = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dailyTasks = dailyTask.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getUTCFullYear() === currentYear &&
        taskDate.getUTCMonth() + 1 === currentMonth &&
        taskDate.getUTCDate() === day
      );
    });

    // Calculate average progress for the day
    const totalProgress = dailyTasks.reduce(
      (acc, task) => acc + task.progress,
      0
    );
    const averageProgress =
      dailyTasks.length > 0 ? totalProgress / dailyTasks.length : 0;

    return {
      date: day.toString(),
      progress: averageProgress,
    };
  });

  const chartSetting = {
    yAxis: [
      {
        label: "Progress (%)",
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  const valueFormatter = (value) => `${Math.round(value)}%`;

  return (
    <BarChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "date",
          label: currentDate.toLocaleString("default", { month: "long" }),
        },
      ]}
      series={[{ dataKey: "progress", valueFormatter }]}
      {...chartSetting}
    />
  );
};

export default BarCharts;
