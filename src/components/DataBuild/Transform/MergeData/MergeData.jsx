import React, { useState, useEffect } from "react";
import { Handle } from "react-flow-renderer";

const MergeDataNode = ({ data }) => {
  const [columns1, setColumns1] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [selectedColumn1, setSelectedColumn1] = useState("");
  const [selectedColumn2, setSelectedColumn2] = useState("");
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    if (data.node1Data) {
      const columns = Object.keys(data.node1Data[0] || {});
      setColumns1(columns);
    }

    if (data.node2Data) {
      const columns = Object.keys(data.node2Data[0] || {});
      setColumns2(columns);
    }
  }, [data.node1Data, data.node2Data]);

  const handleMerge = () => {
    if (!selectedColumn1 || !selectedColumn2) {
      alert("Please select columns from both nodes.");
      return;
    }

    const merged = data.node1Data.map((row1) => {
      const matchingRow = data.node2Data.find(
        (row2) => row2[selectedColumn2] === row1[selectedColumn1]
      );
      return matchingRow ? { ...row1, ...matchingRow } : null;
    });

    // Remove null entries (if no match found)
    const filteredMergedData = merged.filter((item) => item !== null);
    setMergedData(filteredMergedData);

    // Send merged data back to the parent (DataBuild component)
    if (data.sendDataToParent) {
      data.sendDataToParent(filteredMergedData);
    }
  };

  const renderTable = () => {
    if (mergedData.length === 0) return <p>No data available to display</p>;

    const headers = Object.keys(mergedData[0]);

    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "15px",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mergedData.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
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
      <h4 style={{ textAlign: "center" }}>Merge Data Node</h4>

      {/* Dropdown to select column from node 1 */}
      <div style={{ marginBottom: "10px" }}>
        <select
          onChange={(e) => setSelectedColumn1(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option>Select Column from Node 1</option>
          {columns1.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown to select column from node 2 */}
      <div style={{ marginBottom: "10px" }}>
        <select
          onChange={(e) => setSelectedColumn2(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option>Select Column from Node 2</option>
          {columns2.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Merge Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleMerge}
          style={{
            padding: "8px 15px",
            backgroundColor: "#36A2EB",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Merge Data
        </button>
      </div>

      {/* Render the merged data in a table */}
      {renderTable()}

      {/* Connectors */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default MergeDataNode;
