import React, { useEffect, useState } from "react";
import { Handle } from "react-flow-renderer";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement, // Updated for scatter plot
  LineElement, // Optional for lines in scatter plot
} from "chart.js";
import Papa from "papaparse"; // CSV parsing library

// Register necessary chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement, // PointElement for scatter plot
  LineElement // Optional for lines in scatter plot
);

const ScatterPlotNode = ({ data, setNodes }) => {
  const [chartData, setChartData] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const dataInput = data.apiResponse || [];

  useEffect(() => {
    if (dataInput.length > 0) {
      let formattedData;

      // Handle JSON format (Array of Objects with at least two fields)
      if (Array.isArray(dataInput)) {
        formattedData = dataInput.map((item) => {
          return {
            x: item.x || item[Object.keys(item)[0]], // X data (first column or 'x' field)
            y: item.y || item[Object.keys(item)[1]], // Y data (second column or 'y' field)
          };
        });
      }
      // Handle CSV format (parse CSV and convert to object with x, y)
      else if (typeof dataInput === "string" && dataInput.includes(",")) {
        const parsedCSV = Papa.parse(dataInput, { header: true }).data;
        formattedData = parsedCSV.map((item) => ({
          x: item[Object.keys(item)[0]], // Use the first column as X
          y: item[Object.keys(item)[1]], // Use the second column as Y
        }));
      }
      // Handle Plain Text format
      else if (typeof dataInput === "string") {
        const lines = dataInput.split("\n");
        formattedData = lines.map((line) => {
          const [x, y] = line.split(/\s+/); // Split by space or comma
          return { x: parseFloat(x), y: parseFloat(y) };
        });
      }

      // Update the chart data
      setParsedData(formattedData);
    }
  }, [dataInput]);

  // Prepare chart data for scatter plot
  useEffect(() => {
    if (parsedData.length > 0) {
      const scatterData = {
        datasets: [
          {
            label: "Scatter Plot",
            data: parsedData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(scatterData);
    }
  }, [parsedData]);

  // Handle sending the data back to the parent
  const handleSendDataToParent = () => {
    data.setNodes((nds) =>
      nds.map((node) =>
        node.id === data.id
          ? {
              ...node,
              data: { ...node.data, apiResponse: parsedData }, // Send formatted data back to parent node
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
      <h4>{data.title || "Scatter Plot View"}</h4>
      <p>Visualize your data as a scatter plot!</p>
      {chartData && <Scatter data={chartData} />}
      <button onClick={handleSendDataToParent}>Send Data to Parent</button>
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default ScatterPlotNode;
