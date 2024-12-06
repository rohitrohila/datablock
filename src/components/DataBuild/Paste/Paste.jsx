import React, { useState } from "react";
import { Handle } from "react-flow-renderer";
import Papa from "papaparse";
import DataTable from "../Table/DataTable"; // Import the reusable table component

const DataInputNode = ({ data, id, setNodes }) => {
  const [inputType, setInputType] = useState("json");
  const [inputValue, setInputValue] = useState("");
  const [parsedData, setParsedData] = useState([]);

  const handleInputTypeChange = (event) => {
    setInputType(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleParseData = () => {
    try {
      let result = [];
      if (inputType === "csv") {
        const parsed = Papa.parse(inputValue, { header: true });
        result = parsed.data;
      } else if (inputType === "json") {
        result = JSON.parse(inputValue);
      } else if (inputType === "text") {
        result = inputValue.split("\n").map((line) => ({ text: line }));
      } else {
        alert("Unsupported data type!");
        return;
      }

      setParsedData(result);
      if (data.sendDataToParent) {
        data.sendDataToParent(result);
      }

      // Share data with connected nodes
      if (setNodes) {
        data.setNodes((nodes) =>
          nodes.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, apiResponse: result } }
              : node
          )
        );
      }
    } catch (error) {
      alert("Error parsing data. Please check your input.");
    }
  };

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
      <h4>Data Input Node</h4>

      {/* Dropdown for data type */}
      <select value={inputType} onChange={handleInputTypeChange}>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="text">Text</option>
      </select>

      {/* Textarea for input */}
      <textarea
        style={{
          marginTop: "10px",
          width: "100%",
          height: "100px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
        placeholder={`Paste your ${inputType.toUpperCase()} data here`}
        value={inputValue}
        onChange={handleInputChange}
      ></textarea>

      {/* Parse button */}
      <button
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleParseData}
      >
        Parse Data
      </button>

      {/* Render parsed data in table */}
      {/* <div style={{ marginTop: "20px" }}>
        <h5>Parsed Data:</h5>
        <DataTable data={parsedData} />
      </div> */}

      {/* React Flow handles */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default DataInputNode;
