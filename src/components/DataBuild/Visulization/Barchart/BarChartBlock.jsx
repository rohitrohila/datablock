import React from "react";
import { Handle } from "react-flow-renderer";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement
);

const GraphViewNode = ({ data }) => {
  const dataInput = data.apiResponse || [];
  const chartType = data.chartType || "bar"; // Default to Bar chart if not specified

  console.log(dataInput);
  console.log(data);

  // If no data is provided, return a message
  if (dataInput?.length === 0) {
    return (
      <div
        style={{
          padding: "10px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h4>{data.title || "No Data"}</h4>
        <p>No data available to visualize.</p>
        <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
        <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
      </div>
    );
  }

  // Assuming we're working with JSON, CSV data, or arrays of objects, here is an approach for dynamic chart generation:
  const labels = Object.keys(dataInput[0] || {}); // Use the keys of the first object for chart labels
  const values = labels.map((label) => dataInput?.map((item) => item[label]));

  // Prepare data for charts
  const chartData = {
    labels,
    datasets: values.map((value, index) => ({
      label: labels[index],
      data: value,
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.6)`,
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 1)`,
      borderWidth: 1,
    })),
  };

  // Render different charts based on chart type
  let chartElement;
  if (chartType === "pie") {
    chartElement = <Pie data={chartData} />;
  } else if (chartType === "line") {
    chartElement = <Line data={chartData} />;
  } else {
    chartElement = <Bar data={chartData} />;
  }

  return (
    <div
      style={{
        padding: "10px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
        width: "300px",
      }}
    >
      <h4>{"Graph View"}</h4>
      <p>Visualize your data here!</p>
      {chartElement}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default GraphViewNode;
