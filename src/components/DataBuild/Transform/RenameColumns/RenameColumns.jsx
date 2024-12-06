import React, { useState, useEffect } from "react";
import { Handle } from "react-flow-renderer";

const RenameColumnNode = ({ data, id, setNodes }) => {
  const [columns, setColumns] = useState([]); // To hold the column names
  const [renamedColumns, setRenamedColumns] = useState([
    { oldName: "", newName: "" },
  ]); // Initially 1 dropdown and input

  // Load columns from incoming data
  useEffect(() => {
    if (
      data &&
      Array.isArray(data.apiResponse) &&
      data.apiResponse.length > 0
    ) {
      const firstRow = data.apiResponse[0]; // Get the first row to extract column names
      setColumns(Object.keys(firstRow)); // Set the column names
    }
  }, [data]);

  // Add another column renaming field
  const addMoreColumn = () => {
    setRenamedColumns([...renamedColumns, { oldName: "", newName: "" }]);
  };

  // Handle input change for renaming columns
  const handleInputChange = (index, field, value) => {
    const updatedRenamedColumns = [...renamedColumns];
    updatedRenamedColumns[index][field] = value;
    setRenamedColumns(updatedRenamedColumns);
  };

  // Handle the column rename and send data back to parent
  const handleRename = () => {
    if (!renamedColumns || renamedColumns.length === 0) return;

    // Copy original data and update column names
    const updatedData = data.apiResponse.map((row) => {
      const updatedRow = { ...row };
      renamedColumns.forEach(({ oldName, newName }) => {
        if (oldName && newName && updatedRow[oldName]) {
          updatedRow[newName] = updatedRow[oldName];
          delete updatedRow[oldName]; // Remove the old column name
        }
      });
      return updatedRow;
    });

    // Pass the renamed data back to the parent
    data.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, apiResponse: updatedData } }
          : node
      )
    );

    // Update the parent table with renamed columns (if necessary)
    data.sendDataToParent(updatedData);
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
      <h4 style={{ textAlign: "center" }}>Rename Columns</h4>

      {renamedColumns.map((column, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Dropdown to select column to rename */}
            <select
              value={column.oldName}
              onChange={(e) =>
                handleInputChange(index, "oldName", e.target.value)
              }
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <option value="">Select Column</option>
              {columns.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>

            {/* Input field for the new column name */}
            <input
              type="text"
              value={column.newName}
              onChange={(e) =>
                handleInputChange(index, "newName", e.target.value)
              }
              placeholder="New Column Name"
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>
      ))}

      {/* Button to add more renaming options */}
      {renamedColumns.length < columns.length && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button
            onClick={addMoreColumn}
            style={{
              padding: "8px 15px",
              backgroundColor: "#36A2EB",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add More Columns
          </button>
        </div>
      )}

      {/* Button to apply column name changes */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleRename}
          style={{
            padding: "8px 15px",
            backgroundColor: "#36A2EB",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Change Name
        </button>
      </div>

      {/* Connectors */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default RenameColumnNode;
