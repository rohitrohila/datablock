import React, { useState, useEffect } from "react";
import { Handle } from "react-flow-renderer";

const FilterNode = ({ data }) => {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("equals");
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // When data is passed from a connected node
  useEffect(() => {
    if (data.apiResponse) {
      const columns = Object.keys(data.apiResponse[0] || {});
      setColumns(columns);
    }
  }, [data.apiResponse]);

  const handleFilter = () => {
    if (!selectedColumn || !filterValue) {
      alert("Please select a column and provide a filter value.");
      return;
    }

    let filtered;
    const column = selectedColumn;
    const value = filterValue;

    // Apply filtering based on the condition
    switch (selectedCondition) {
      case "equals":
        filtered = data.apiResponse.filter((item) => item[column] === value);
        break;
      case "greaterThan":
        filtered = data.apiResponse.filter((item) => item[column] > value);
        break;
      case "contains":
        filtered = data.apiResponse.filter((item) =>
          item[column]?.toString().includes(value)
        );
        break;
      case "notContains":
        filtered = data.apiResponse.filter(
          (item) => !item[column]?.toString().includes(value)
        );
        break;
      case "notEquals":
        filtered = data.apiResponse.filter((item) => item[column] !== value);
        break;
      case "notEmpty":
        filtered = data.apiResponse.filter(
          (item) => item[column] != null && item[column] !== ""
        );
        break;
      case "matchesRegex":
        try {
          const regex = new RegExp(value);
          filtered = data.apiResponse.filter((item) =>
            regex.test(item[column])
          );
        } catch (error) {
          alert("Invalid regex.");
          return;
        }
        break;
      default:
        break;
    }

    setFilteredData(filtered);
    // Send filtered data back to parent
    if (data.sendDataToParent) {
      data.sendDataToParent(filtered);
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
      <h4 style={{ textAlign: "center" }}>Filter Node</h4>

      {/* Column Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <select
          onChange={(e) => setSelectedColumn(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option>Select Column</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <select
          onChange={(e) => setSelectedCondition(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="equals">Equals</option>
          <option value="notEquals">Not Equals</option>
          <option value="greaterThan">Greater Than</option>
          <option value="contains">Contains</option>
          <option value="notContains">Does Not Contain</option>
          <option value="notEmpty">Not Empty/Null</option>
          <option value="matchesRegex">Matches Regex</option>
        </select>
      </div>

      {/* Filter Value Input */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Filter value"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Apply Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleFilter}
          style={{
            padding: "8px 15px",
            backgroundColor: "#36A2EB",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Apply Filter
        </button>
      </div>

      {/* Connectors */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default FilterNode;
