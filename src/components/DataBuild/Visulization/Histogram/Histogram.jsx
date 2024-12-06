import React, { useEffect, useState } from "react";
import { Handle } from "react-flow-renderer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const HistogramNode = ({ data, setNodes }) => {
  const [chartData, setChartData] = useState(null);
  const dataInput = data.apiResponse || [];

  useEffect(() => {
    // Generate the histogram data
    if (dataInput.length > 0) {
      const labels = Object.keys(dataInput[0]); // Use the keys of the first object for chart labels
      const dataset = labels.map((label) => {
        return {
          label,
          data: dataInput.map((item) => item[label]),
        };
      });

      // Prepare data for histogram (Bar chart)
      const histogramData = {
        labels: dataset[0]?.data,
        datasets: dataset.map((set, index) => ({
          label: set.label,
          data: set.data,
          backgroundColor: `rgba(${Math.random() * 255}, ${
            Math.random() * 255
          }, ${Math.random() * 255}, 0.6)`,
          borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          }, 1)`,
          borderWidth: 1,
        })),
      };

      setChartData(histogramData);
    }
  }, [dataInput]);

  // Handle sending the data back to parent
  const handleSendDataToParent = () => {
    if (data.sendDataToParent) {
      data.sendDataToParent(dataInput);
    }
    data.setNodes((nds) =>
      nds.map((node) =>
        node.id === data.id
          ? {
              ...node,
              data: { ...node.data, apiResponse: dataInput }, // Send original data back to parent node
            }
          : node
      )
    );
  };

  // If no data is available, return a message
  if (!chartData) {
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
      <h4>{data.title || "Histogram View"}</h4>
      <p>Visualize your data as a histogram!</p>
      {chartData && <Bar data={chartData} />}
      <button onClick={handleSendDataToParent}>Send Data to Parent</button>
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default HistogramNode;
