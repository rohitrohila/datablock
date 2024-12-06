import React, { useState } from "react";
import { Handle } from "react-flow-renderer";
import Papa from "papaparse";

const FileUploadNode = ({ data, id, setNodes }) => {
  console.log("a");
  const [fileData, setFileData] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      switch (fileExtension) {
        case "csv":
          parseCSV(content);
          setFileType("CSV");
          break;

        case "json":
        case "geojson":
        case "topojson":
          parseJSON(content, fileExtension);
          setFileType(fileExtension.toUpperCase());
          break;

        default:
          alert(
            "Unsupported file type. Please upload CSV, JSON, GeoJSON, or TopoJSON."
          );
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (content) => {
    const parsed = Papa.parse(content, { header: true });
    console.log(parsed);
    setFileData(parsed.data);
    updateNodeData(parsed.data, "CSV");
  };

  const parseJSON = (content, type) => {
    try {
      const parsed = JSON.parse(content);

      updateNodeData(parsed, type.toUpperCase());
    } catch (error) {
      alert("Error parsing JSON/GeoJSON/TopoJSON file.");
    }
  };

  const updateNodeData = (dataFile, type) => {
    console.log("Parsed Data:", dataFile);
    // Transform data to be compatible with GraphViewNode
    let transformedData;
    if (type === "CSV") {
      // Map CSV rows to a format compatible with GraphViewNode, dynamically handling all fields
      transformedData = dataFile.map((row) => {
        // Convert each row to an object with key-value pairs based on column names
        const transformedRow = {};
        Object.keys(row).forEach((key) => {
          // Handle the case where the value might be a boolean (e.g., 'true'/'false' in CSV)
          transformedRow[key] =
            row[key] === "true" || row[key] === true ? true : row[key];
        });
        return transformedRow;
      });
    } else if (type === "JSON") {
      transformedData = Array.isArray(dataFile) ? dataFile : [];
    } else {
      alert(`Unsupported file type: ${type}`);
      return;
    }
    if (data.sendDataToParent) {
      data.sendDataToParent(transformedData);
    }
    data?.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, apiResponse: transformedData },
            }
          : node
      )
    );
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
        width: "250px",
      }}
    >
      <h4>File Upload Node</h4>
      <p>Upload a CSV, JSON, GeoJSON, or TopoJSON file</p>
      <input type="file" onChange={handleFileUpload} />

      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default FileUploadNode;
