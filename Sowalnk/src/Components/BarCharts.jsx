import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const BarCharts = () => {
  const dataset = [
    {
      london: 59,
      month: "Jan",
    },
    {
      london: 50,
      month: "Feb",
    },
    {
      london: 47,
      month: "Mar",
    },
    {
      london: 54,
      month: "Apr",
    },
    {
      london: 57,
      month: "May",
    },
    {
      london: 60,
      month: "June",
    },
    {
      london: 59,
      month: "July",
    },
    {
      london: 65,
      month: "Aug",
    },
    {
      london: 51,
      month: "Sept",
    },
    {
      london: 60,
      month: "Oct",
    },
    {
      london: 67,
      month: "Nov",
    },
    {
      london: 61,
      month: "Dec",
    },
  ];
  const chartSetting = {
    yAxis: [
      //   {
      //     label: "rainfall (mm)",
      //   },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };
  function valueFormatter(value) {
    return `${value}mm`;
  }

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[{ dataKey: "london", valueFormatter }]}
      {...chartSetting}
    />
  );
};
export default BarCharts;
