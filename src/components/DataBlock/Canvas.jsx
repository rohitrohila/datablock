import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "react-flow-renderer";

import { Button, Modal } from "react-bootstrap";
import HttpNode from "./HttpRequestBlock"; // Import custom HTTP Node component
import GraphViewNode from "./BarChartBlock"; // Import custom GraphView Node component
import "@xyflow/react/dist/style.css";
// import Modal from "./BlockModal";
import "./modal.css";
import ModalWithCategories from "./BlockModal";
import FileUploadNode from "./Input/File";

// Generate unique node ids
let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0.0];
// Map to hold custom components for each node type
const nodeTypes = {
  http: HttpNode, // Map the node type to the corresponding component
  graphview: GraphViewNode, // Map GraphView to its custom component
  file: FileUploadNode,
};
// Main DataBuild component
const DataBuild = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      console.log("onConnect params:", params); // Log connection parameters
      const { source, target } = params;

      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (sourceNode && targetNode) {
        const sourceData = sourceNode.data;

        const updatedTargetNode = {
          ...targetNode,
          data: {
            ...targetNode.data,
            ...sourceData,
          },
        };

        setNodes((nds) =>
          nds.map((node) => (node.id === target ? updatedTargetNode : node))
        );
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setNodes, setEdges]
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState) {
        console.warn("Connection state is undefined or null");
        return; // Early exit if no connectionState
      }

      const { fromNode, toNode, isValid } = connectionState;

      if (!isValid) {
        console.warn("Invalid connection state detected");
        return;
      }

      console.log("Connection is valid", connectionState);

      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;
      const newNodePosition = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const newNode = {
        id: getId(),
        position: newNodePosition,
        data: {
          label: selectedNodeType,
          apiResponse: null,
          apiUrl: "",
        },
        origin: [0.5, 0.0],
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) =>
        eds.concat({
          id: `edge-${fromNode.id}-${newNode.id}`,
          source: fromNode.id,
          target: newNode.id,
        })
      );
    },
    [screenToFlowPosition, selectedNodeType]
  );

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
        setNodes: setNodes, // Pass setNodes here
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
      style={{ height: "100vh", width: "100vw" }}
    >
      <Button onClick={() => handleShowModal(true)} variant="primary">
        + Block
      </Button>
      Modal to Select Node
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
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeTypes={nodeTypes}
        nodesConnectable={true}
        nodesDraggable={true}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DataBuild />
  </ReactFlowProvider>
);
