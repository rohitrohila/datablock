import { useState } from "react";
import { Button } from "react-bootstrap";
import { Handle } from "react-flow-renderer";

const HttpNode = ({ data, id, setNodes }) => {
  console.log("d");
  const [apiUrl, setApiUrl] = useState(data.apiUrl || "");
  const [apiResponse, setApiResponse] = useState(data.apiResponse || null);

  const handleFetchData = () => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((apiData) => {
        setApiResponse(apiData);
        if (data.sendDataToParent) {
          data.sendDataToParent(apiData);
        }
        // Update the node with the fetched data
        data?.setNodes((nds) =>
          nds.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, apiResponse: apiData } }
              : node
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
        width: "200px",
      }}
    >
      <label>API URL</label>
      <input
        type="text"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        placeholder="Enter API URL"
        style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
      />
      <Button
        variant="primary"
        onClick={handleFetchData}
        style={{ width: "100%" }}
      >
        Fetch Data
      </Button>
      {/* {apiResponse && (
        <div>
          <h5>Response:</h5>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )} */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default HttpNode;
