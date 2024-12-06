import React, { useState, useEffect } from "react";
import { Handle } from "react-flow-renderer";
import MonacoEditor from "@monaco-editor/react";

const JavaScriptNode = ({ data, id, setNodes }) => {
  const [code, setCode] = useState(
    `async function b(data) {\n  // your code here\n  return null;\n}`
  );
  const [executionResult, setExecutionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false); // To indicate if the code is running
  const [isConnected, setIsConnected] = useState(false);

  // Check if the node is connected to another node
  useEffect(() => {
    if (data && data.apiResponse) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [data]);

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Validate that the user has included the function b() and the necessary structure
      if (!code.includes("async function b(data) {")) {
        setExecutionResult("Error: Missing predefined function structure.");
        setIsRunning(false);
        return;
      }

      // If connected to a node, use that data; otherwise, use a mock/default value
      const inputData = isConnected
        ? data.apiResponse
        : { message: "No connected data, custom code input only." };

      // Create a new function from the user's code and execute it
      const func = new Function("data", code);
      const result = await func(inputData);

      setExecutionResult(result);
    } catch (error) {
      setExecutionResult(`Error: ${error.message}`);
    } finally {
      setIsRunning(false); // Reset the running state after execution
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
        width: "350px",
      }}
    >
      <h4 style={{ textAlign: "center" }}>JavaScript Node</h4>

      {/* Monaco Editor */}
      <MonacoEditor
        height="250px"
        language="javascript"
        theme="vs-light"
        value={code}
        onChange={(newValue) => setCode(newValue)}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          readOnly: false,
        }}
      />

      {/* Button to execute the code */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <button
          onClick={runCode}
          disabled={isRunning}
          style={{
            padding: "8px 15px",
            backgroundColor: "#36A2EB",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>

      {/* Display the result */}
      {executionResult !== null && (
        <div
          style={{
            padding: "10px",
            background: "#f4f4f4",
            borderRadius: "5px",
          }}
        >
          <h5>Execution Result:</h5>
          <pre>{JSON.stringify(executionResult, null, 2)}</pre>
        </div>
      )}

      {/* Connectors */}
      <Handle type="source" position="right" id="a" style={{ top: "50%" }} />
      <Handle type="target" position="left" id="b" style={{ top: "50%" }} />
    </div>
  );
};

export default JavaScriptNode;
