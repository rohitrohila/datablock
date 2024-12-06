import React, { useState } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Custom Node Component for HTTP (Dimensions)
const DimensionsNode = ({ data, id }) => {
  const [url, setUrl] = useState(""); // URL input field state
  const [fetchedData, setFetchedData] = useState(null); // Store fetched data
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch data from the provided URL
  const fetchData = async () => {
    setIsLoading(true);
    setFetchedData(null); // Reset previous fetched data

    try {
      const response = await fetch(url);
      const result = await response.json(); // Assuming JSON response
      setFetchedData(result); // Store the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchedData("Error fetching data.");
    } finally {
      setIsLoading(false); // Set loading to false after fetch is complete
    }
  };

  // Update the parent node with fetched data
  const updateParentNode = (fetchedData) => {
    // Pass the fetched data up to the parent node via the callback
    if (data.onDataFetch) {
      data.onDataFetch(fetchedData);
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid black",
        borderRadius: "5px",
        background: "#f9f9f9",
        textAlign: "center",
        width: "200px", // Adjust width as needed
      }}
    >
      <strong>{data.label}</strong>
      <div>
        {/* Input Field for URL */}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "5px",
          }}
        />
        {/* Fetch Button */}
        <button
          onClick={fetchData}
          style={{
            width: "100%",
            padding: "5px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Fetch Data"}
        </button>
      </div>

      {/* Display Fetched Data */}
      {fetchedData && (
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            padding: "5px",
            backgroundColor: "#f1f1f1",
            maxHeight: "100px", // Limit height for large data
            overflowY: "auto", // Make it scrollable if content is long
          }}
        >
          <h4>Fetched Data:</h4>
          <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
        </div>
      )}

      {/* Add connection handles */}
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#ff007c",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
        }}
      />
      <Handle
        type="target"
        position="left"
        id="b"
        style={{
          background: "#007bff",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
};

// Custom Node Component for Chart Visualization (Visualization)
const VisualizationNode = ({ data }) => {
  // Ensure data is always an array
  const chartData = {
    labels: Array.isArray(data.visualData)
      ? data.visualData.map((item) => item.title)
      : [],
    datasets: [
      {
        label: "Task Completion",
        data: Array.isArray(data.visualData)
          ? data.visualData.map((item) => (item.completed ? 1 : 0))
          : [],
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.1,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#e0e0e0",
        textAlign: "center",
        width: "300px",
        cursor: "pointer",
      }}
    >
      <h3>{data?.label}</h3>

      {/* Render chart if data is available */}
      <div
        style={{
          width: "100%",
          height: "200px",
          background: "#f1f1f1",
          borderRadius: "8px",
          margin: "10px 0",
        }}
      >
        {Array.isArray(data.visualData) ? (
          <Line data={chartData} />
        ) : (
          <p>No Data Available</p>
        )}
      </div>

      {/* Add connection handles */}
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#ff007c",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
        }}
      />
      <Handle
        type="target"
        position="left"
        id="b"
        style={{
          background: "#007bff",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
};

const nodeTypes = {
  dimensions: DimensionsNode,
  visualization: VisualizationNode,
};

const DataDashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("blocks");

  // Handle when HTTP block is selected
  const handleBlockSelect = (block) => {
    const newNode = {
      id: `${block.id}-${nodes.length + 1}`, // Unique id based on block.id and index
      type: "dimensions",
      data: {
        label: block.title,
        fetchedData: null,
        onDataFetch: (fetchedData) => {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === `${block.id}-${nodes.length + 1}`
                ? { ...node, data: { ...node.data, fetchedData } }
                : node
            )
          );
        },
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      draggable: true,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsModalOpen(false);
  };

  // Handle when Visualization block is selected
  const handleVisualizationSelect = (visualization) => {
    const newNode = {
      id: `${visualization.id}-${nodes.length + 1}`,
      type: "visualization",
      data: {
        label: visualization.title,
        visualData: null, // Initially no data
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      draggable: true, // Ensure the node is draggable
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsModalOpen(false);
  };

  // Handle adding an edge (connection between nodes)
  const handleConnect = (params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (sourceNode && targetNode) {
      // Pass fetched data to the target node for visualization
      if (sourceNode.data.fetchedData) {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === targetNode.id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    visualData: sourceNode.data.fetchedData,
                  },
                }
              : node
          )
        );
      }
    }

    setEdges((prevEdges) => [...prevEdges, params]);
  };

  return (
    <div style={{ height: "100vh" }}>
      <button onClick={() => setIsModalOpen(true)}>+ Block</button>
      {isModalOpen && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "white",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <h3>Select Block Type</h3>
          <button onClick={() => setSelectedCategory("blocks")}>Blocks</button>
          <button onClick={() => setSelectedCategory("visualization")}>
            Visualization
          </button>

          {selectedCategory === "blocks" && (
            <div>
              <div
                onClick={() => handleBlockSelect({ id: "http", title: "HTTP" })}
                key="http" // Add a unique key here for the block
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  background: "#c0c0c0",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                HTTP
              </div>
            </div>
          )}

          {selectedCategory === "visualization" && (
            <div>
              <div
                onClick={() =>
                  handleVisualizationSelect({ id: "chart", title: "Chart" })
                }
                key="chart" // Add a unique key here for the visualization block
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  background: "#c0c0c0",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Chart
              </div>
            </div>
          )}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) =>
          setNodes((prevNodes) => applyNodeChanges(changes, prevNodes))
        }
        onEdgesChange={(changes) =>
          setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges))
        } // Correct event handler for edge changes
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        style={{ width: "100%", height: "100%" }}
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DataDashboard;
