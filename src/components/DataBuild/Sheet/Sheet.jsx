import React, { useEffect, useState } from "react";
import { Handle } from "react-flow-renderer";
import * as XLSX from "xlsx";

const SheetNode = ({ data }) => {
  const [sheetMode, setSheetMode] = useState("google"); // Mode: Google or Upload
  const [googleSheetId, setGoogleSheetId] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1"); // Default to Sheet1
  const [fileData, setFileData] = useState([]);

  // Fetch Google Sheets data
  const fetchGoogleSheet = async () => {
    if (!googleSheetId) {
      alert("Please enter a Google Sheet ID.");
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${sheetName}?key=YOUR_API_KEY`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        // Log the raw response for debugging
        console.log("Google Sheets Response:", result);

        if (result.values && result.values.length > 0) {
          const headers = result.values[0];
          const rows = result.values.slice(1).map((row) =>
            headers.reduce((acc, header, idx) => {
              acc[header] = row[idx];
              return acc;
            }, {})
          );

          setFileData(rows);
          data.sendDataToParent(rows);
        } else {
          alert("No data found in the Google Sheet.");
        }
      } else {
        console.error("Google Sheets API Error:", result);
        alert("Error fetching Google Sheets data: " + result.error.message);
      }
    } catch (error) {
      console.error("Error fetching Google Sheet data:", error);
      alert("Error fetching Google Sheet data: " + error.message);
    }
  };

  // Handle file upload (if you still want to support uploads in this node)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binary = e.target.result;
      const workbook = XLSX.read(binary, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setFileData(sheetData);
      data.sendDataToParent(fileData);
    };
    reader.readAsBinaryString(file);
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
      <h4>Sheet Node</h4>
      <select
        value={sheetMode}
        onChange={(e) => setSheetMode(e.target.value)}
        style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
      >
        <option value="google">Google Sheets</option>
        <option value="upload">Upload Excel File</option>
      </select>

      {sheetMode === "google" ? (
        <div>
          <input
            type="text"
            placeholder="Enter Google Sheet ID"
            value={googleSheetId}
            onChange={(e) => setGoogleSheetId(e.target.value)}
            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Enter Sheet Name (default: Sheet1)"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
          />
          <button
            style={{
              padding: "8px 12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={fetchGoogleSheet}
          >
            Fetch Google Sheet
          </button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept=".xlsx"
            // value={fileData}
            onChange={handleFileUpload}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={() => data?.sendDataToParent(fileData)}>send</button>
        </div>
      )}

      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default SheetNode;
