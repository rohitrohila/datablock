import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
} from "recharts";

const ChartRenderer = ({ type, data }) => {
  console.log(data);
  if (!data || !data.length) {
    return <div>No data available to render the chart.</div>;
  }

  if (type === "BarChart") {
    return (
      <BarChart width={500} height={300} data={data || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="userId" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="completed" fill="#8884d8" />
      </BarChart>
    );
  } else if (type === "ScatterPlot") {
    return (
      <ScatterChart width={500} height={300}>
        <CartesianGrid />
        <XAxis type="number" dataKey="userId" name="User ID" />
        <YAxis type="number" dataKey="completed" name="Completed" />
        <Tooltip />
        <Scatter data={data} fill="#8884d8" />
      </ScatterChart>
    );
  }

  return <div>Select a chart type to visualize data.</div>;
};

export default ChartRenderer;
