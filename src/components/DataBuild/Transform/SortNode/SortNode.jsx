import React, { useState, useEffect } from "react";
import { Handle } from "react-flow-renderer";

const SortNode = ({ data, id, setNodes, onSortData }) => {
  const [columnName, setColumnName] = useState(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState("ascending"); // Sort order (ascending or descending)
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data.apiResponse)) {
      // Initialize with the current data
      setSortedData(data.apiResponse);
    }
  }, [data]);

  const handleSort = () => {
    if (data && Array.isArray(data.apiResponse) && columnName) {
      // Ensure the selected column exists in the data
      const columnExists = data.apiResponse[0].hasOwnProperty(columnName);
      if (!columnExists) {
        alert("The selected column does not exist in the data.");
        return;
      }

      // Sort the data based on the selected column and order
      const sorted = [...data.apiResponse].sort((a, b) => {
        if (a[columnName] < b[columnName])
          return sortOrder === "ascending" ? -1 : 1;
        if (a[columnName] > b[columnName])
          return sortOrder === "ascending" ? 1 : -1;
        return 0;
      });

      // Set the sorted data and update the table
      setSortedData(sorted);
      data.onSortData(sorted); // Pass sorted data to the parent

      // Update the node's data in React Flow
      data.setNodes((nodes) =>
        nodes.map((node) =>
          node.id === data.id
            ? {
                ...node,
                data: { ...node.data, apiResponse: sorted },
              }
            : node
        )
      );
    }
  };

  const getColumnNames = () => {
    if (
      data &&
      Array.isArray(data.apiResponse) &&
      data.apiResponse.length > 0
    ) {
      return Object.keys(data.apiResponse[0]);
    }
    return [];
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
      <h4 style={{ textAlign: "center" }}>Sort Node</h4>

      {/* Dropdown for Column Names */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Select Column:</label>
        <select
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="">--Select Column--</option>
          {getColumnNames().map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown for Sort Order */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Sort Order:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      {/* Sort Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleSort}
          style={{
            padding: "8px 15px",
            backgroundColor: "#36A2EB",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sort Data
        </button>
      </div>

      {/* Connectors */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default SortNode;
