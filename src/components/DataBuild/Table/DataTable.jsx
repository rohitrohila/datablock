import React from "react";

const DataTable = ({ data }) => {
  // Ensure data is an array of objects
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available to display.</p>;
  }

  // Extract table headers from the keys of the first object
  const headers = Object.keys(data[0]);

  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  style={{ border: "1px solid #ccc", padding: "8px" }}
                >
                  {row[header] !== undefined ? row[header] : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
