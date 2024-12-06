import React, { useState, useEffect } from "react";
import { Handle } from "react-flow-renderer";

const SliceNode = ({ data, id, setNodes, onSliceData }) => {
  const [startIndex, setStartIndex] = useState(0); // Starting index
  const [endIndex, setEndIndex] = useState(null); // Ending index (default: last index of data)
  const [slicedData, setSlicedData] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data.apiResponse)) {
      setEndIndex(data.apiResponse.length); // Set default end index to the last index of the data
      setSlicedData(data.apiResponse); // Initialize sliced data to full dataset
    }
  }, [data]);

  const handleSlice = () => {
    if (data && Array.isArray(data.apiResponse)) {
      // Validate indices
      const start = Math.max(0, parseInt(startIndex, 10) || 0);
      const end = Math.min(
        data.apiResponse.length,
        parseInt(endIndex, 10) || data.apiResponse.length
      );

      if (start >= end) {
        alert("Start index must be less than end index.");
        return;
      }

      const sliced = data.apiResponse.slice(start, end);
      setSlicedData(sliced);

      // Update the parent state via callback
      data.onSliceData(sliced);

      // Update the node's data in React Flow
      data.setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, apiResponse: sliced },
              }
            : node
        )
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
        width: "300px",
      }}
    >
      <h4 style={{ textAlign: "center" }}>Slice Node</h4>

      {/* Input for Start Index */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Start Index:</label>
        <input
          type="number"
          value={startIndex}
          onChange={(e) => setStartIndex(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Input for End Index */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>End Index:</label>
        <input
          type="number"
          value={endIndex || ""}
          onChange={(e) => setEndIndex(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Slice Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleSlice}
          style={{
            padding: "8px 15px",
            backgroundColor: "#36A2EB",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Slice Data
        </button>
      </div>

      {/* Connectors */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default SliceNode;
