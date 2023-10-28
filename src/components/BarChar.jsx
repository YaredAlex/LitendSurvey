import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data }) => {
  return (
    <Bar
      data={data}
      options={{
        responsive: true,
      }}
    />
  );
};

export default BarChart;
