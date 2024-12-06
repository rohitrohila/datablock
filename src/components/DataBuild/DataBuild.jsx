import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "react-flow-renderer";

import { Button } from "react-bootstrap";
import HttpNode from "./HttpRequestBlock"; // Import custom HTTP Node component
import "@xyflow/react/dist/style.css";
import "./modal.css";
import ModalWithCategories from "./BlockModal";
import FileUploadNode from "./Input/File";
import DataInputNode from "./Paste/Paste";
import DataTable from "./Table/DataTable";
import SheetNode from "./Sheet/Sheet";
import FilterNode from "./Transform/FIlter/Filter";
import SliceNode from "./Transform/Slice/Slice";
import SortNode from "./Transform/SortNode/SortNode";
import GraphViewNode from "./Visulization/Barchart/BarChartBlock";
import HistogramNode from "./Visulization/Histogram/Histogram";
import ScatterPlotNode from "./Visulization/ScatterPlot/Scatterplot";
import CustomEdge from "./CustomeEdge/CustomEdge";
import RenameColumnsNode from "./Transform/RenameColumns/RenameColumns";
import JavaScriptNode from "./Transform/Javascript/Javascript";

// Generate unique node ids
let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0.0];
// Map to hold custom components for each node type
const nodeTypes = {
  http: HttpNode, // Map the node type to the corresponding component
  graphview: GraphViewNode, // Map GraphView to its custom component
  file: FileUploadNode,
  paste: DataInputNode,
  sheet: SheetNode,
  filter: FilterNode,
  slice: SliceNode,
  sort: SortNode,
  histogramView: HistogramNode,
  scatter: ScatterPlotNode,
  rename: RenameColumnsNode,
  javascript: JavaScriptNode,
};
// Main DataBuild component
const DataBuild = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const { screenToFlowPosition } = useReactFlow();
  const [sharedData, setSharedData] = useState([]);

  // const onConnect = useCallback(
  //   (params) => {
  //     console.log("onConnect params:", params);

  //     if (!params.source || !params.target) {
  //       console.warn("Invalid connection parameters");
  //       return;
  //     }

  //     // Ensure nodes exist before connecting
  //     const sourceNode = nodes.find((node) => node.id === params.source);
  //     const targetNode = nodes.find((node) => node.id === params.target);

  //     if (!sourceNode || !targetNode) {
  //       console.warn("Source or target node is missing.");
  //       return;
  //     }

  //     // Update target node's data with source node's data
  //     const updatedTargetNode = {
  //       ...targetNode,
  //       data: {
  //         ...targetNode.data,
  //         ...sourceNode.data, // Propagate source data to target node
  //         apiData: sharedData,
  //       },
  //     };

  //     setNodes((nds) =>
  //       nds.map((node) =>
  //         node.id === targetNode.id ? updatedTargetNode : node
  //       )
  //     );

  //     setEdges((eds) => addEdge(params, eds));
  //   },
  //   [nodes, setNodes, setEdges]
  // );

  const onConnect = useCallback(
    (params) => {
      console.log("onConnect params:", params);

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (!sourceNode || !targetNode) {
        console.warn("Source or target node is missing.");
        return;
      }

      // Propagate source node's data to target node
      const updatedTargetNode = {
        ...targetNode,
        data: {
          ...targetNode.data,
          apiResponse: sourceNode.data.apiResponse || [], // Pass the data from SheetNode
        },
      };

      setNodes((nds) =>
        nds.map((node) =>
          node.id === targetNode.id ? updatedTargetNode : node
        )
      );

      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setNodes, setEdges]
  );

  // const onConnectEnd = useCallback(
  //   (event, connectionState) => {
  //     if (!connectionState) {
  //       console.warn("Connection state is undefined or null");
  //       return; // Early exit if no connection state
  //     }

  //     const { fromNode, toNode, isValid } = connectionState;

  //     if (!fromNode || !toNode || !isValid) {
  //       console.warn("Invalid connection state detected");
  //       return;
  //     }

  //     const { clientX, clientY } =
  //       "changedTouches" in event ? event.changedTouches[0] : event;

  //     const newNodePosition = screenToFlowPosition({
  //       x: clientX,
  //       y: clientY,
  //     });

  //     // Handle adding the new node here (if needed)
  //     const newNode = {
  //       id: getId(),
  //       position: newNodePosition,
  //       data: {
  //         label: selectedNodeType,
  //         apiResponse: null,
  //         apiUrl: "",
  //       },
  //       origin: [0.5, 0.0],
  //     };

  //     setNodes((nds) => nds.concat(newNode));
  //     setEdges((eds) =>
  //       eds.concat({
  //         id: `edge-${fromNode.id}-${newNode.id}`,
  //         source: fromNode.id,
  //         target: newNode.id,
  //       })
  //     );
  //   },
  //   [screenToFlowPosition, selectedNodeType, setNodes, setEdges]
  // );
  // Callback to receive sliced data from SliceNode

  const handleNodeSelect = (nodeType) => {
    setLgShow(false);
    setSelectedNodeType(nodeType); // Store selected node type
    const randomX = Math.random() * 500; // Random X position
    const randomY = Math.random() * 500; // Random Y position

    const newNode = {
      id: getId(),
      type: nodeType.value, // The type will map to your custom node
      position: { x: randomX, y: randomY },
      data: {
        title: nodeType.title,
        apiUrl: "", // Empty URL initially
        apiResponse: null, // No response initially
        apiData: sharedData,
        setNodes: setNodes, // Pass setNodes here
        sendDataToParent: (data) => setSharedData(data),
        onSliceData: (data) => setSharedData(data),
        onSortData: (data) => setSharedData(data),
      },
    };

    setNodes((nds) => nds.concat(newNode)); // Add the node to state
  };
  const [lgShow, setLgShow] = useState(false);

  const handleShowModal = () => setLgShow(true);
  const handleHideModal = () => setLgShow(false);

  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{ height: "60vh", width: "100vw" }}
    >
      <Button onClick={() => handleShowModal(true)} variant="primary">
        + Block
      </Button>
      <ModalWithCategories
        show={lgShow}
        onHide={handleHideModal}
        handleNodeSelect={handleNodeSelect}
      />

      <ReactFlow
        style={{ backgroundColor: "#1A192B" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeTypes={nodeTypes}
        nodesConnectable={true}
        nodesDraggable={true}
      >
        <Background />
      </ReactFlow>
      {sharedData.length ? (
        <div
          style={{
            padding: "10px",
            marginTop: "20px",
            background: "#1A192B",
            color: "white",
          }}
        >
          <h3>Table View:</h3>
          <DataTable data={sharedData} />
        </div>
      ) : (
        <div
          style={{
            padding: "10px",
            marginTop: "20px",
            background: "#1A192B",
            color: "white",
          }}
        >
          <h3>Output:</h3>
        </div>
      )}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DataBuild />
  </ReactFlowProvider>
);
