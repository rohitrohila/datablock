import React, { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Handle,
} from "react-flow-renderer";

// Custom Node Component
const CustomNode = ({
  id,
  data,
  isConnectable,
  hoveredNodeId,
  setHoveredNodeId,
}) => {
  const isHovered = hoveredNodeId === id;
  return (
    <div
      onMouseEnter={() => setHoveredNodeId(id)} // Set hover state on mouse enter
      onMouseLeave={() => setHoveredNodeId(null)} // Reset hover state on mouse leave
      style={{
        padding: "10px",
        borderRadius: "5px",
        border: "2px solid",
        borderColor: isHovered ? "orange" : "#ddd", // Change border color when hovered
        backgroundColor: isHovered ? "#ffe4b2" : "#fff", // Change background color on hover
        opacity: isHovered ? 1 : 3, // Reduce opacity for non-hovered nodes
      }}
    >
      <Handle type="target" position="top" isConnectable={isConnectable} />
      {data.label}
      <Handle type="source" position="bottom" isConnectable={isConnectable} />
    </div>
  );
};

// SupplyChainGraph Component
const SupplyChainGraph = ({ data }) => {
  const [edgeFilterValue, setEdgeFilterValue] = useState(100); // Default filter value
  const [hoveredNodeId, setHoveredNodeId] = useState(null); // Track hovered node ID

  // Filter edges based on the filter value
  const filteredEdges = data.edges.filter(
    (edge) => edge.data.value > edgeFilterValue
  );

  // Map over the nodes and edges
  const nodes = data.nodes.map((node) => ({
    id: node.id,
    type: "custom",
    position: node.position,
    data: { label: node.label },
  }));

  const edges = filteredEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated:
      hoveredNodeId &&
      (hoveredNodeId === edge.source || hoveredNodeId === edge.target),
    style: {
      stroke:
        edge.data.value > 500
          ? "red" // Red for high-value edges
          : edge.data.value > 300
          ? "orange" // Orange for medium-value edges
          : "green", // Green for low-value edges
      strokeWidth: edge.data.value > 500 ? 3 : edge.data.value > 300 ? 2 : 1, // Thicker edges for high-value
    },
  }));

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "500px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            custom: (props) => (
              <CustomNode
                {...props}
                hoveredNodeId={hoveredNodeId} // Pass hoveredNodeId as a prop
                setHoveredNodeId={setHoveredNodeId} // Pass setHoveredNodeId function
              />
            ),
          }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Filter Control */}
      <div>
        <label>Filter edges by value greater than:</label>
        <input
          type="number"
          value={edgeFilterValue}
          onChange={(e) => setEdgeFilterValue(Number(e.target.value))}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default SupplyChainGraph;
// import React, { useState } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   ReactFlowProvider,
//   Handle,
// } from "react-flow-renderer";

// // Custom Node Component
// const CustomNode = ({
//   id,
//   data,
//   isConnectable,
//   hoveredNodeId,
//   setHoveredNodeId,
// }) => {
//   return (
//     <div
//       onMouseEnter={() => setHoveredNodeId(id)} // Set the hovered node
//       onMouseLeave={() => setHoveredNodeId(null)} // Reset the hovered node
//       style={{
//         padding: "10px",
//         borderRadius: "5px",
//         border: "2px solid",
//         borderColor: hoveredNodeId === id ? "orange" : "#ddd",
//         backgroundColor: hoveredNodeId === id ? "#ffe4b2" : "#fff",
//       }}
//     >
//       <Handle type="target" position="top" isConnectable={isConnectable} />
//       {data.label}
//       <Handle type="source" position="bottom" isConnectable={isConnectable} />
//     </div>
//   );
// };

// const SupplyChainGraph = ({ data }) => {
//   const [hoveredNodeId, setHoveredNodeId] = useState(null);

//   // Filter the edges that should be visible when hovering on a node
//   const edges = data.edges.map((edge) => ({
//     id: edge.id,
//     source: edge.source,
//     target: edge.target,
//     animated:
//       hoveredNodeId &&
//       (hoveredNodeId === edge.source || hoveredNodeId === edge.target),
//     style: {
//       stroke:
//         hoveredNodeId &&
//         (hoveredNodeId === edge.source || hoveredNodeId === edge.target)
//           ? "orange" // Highlight the hovered edge in orange
//           : "red", // Hide the other edges
//       strokeWidth:
//         hoveredNodeId &&
//         (hoveredNodeId === edge.source || hoveredNodeId === edge.target)
//           ? 3
//           : 2, // Make the edge thicker on hover
//       opacity:
//         hoveredNodeId &&
//         (hoveredNodeId === edge.source || hoveredNodeId === edge.target)
//           ? 2
//           : 0.5, // Only show the edges related to the hovered node
//     },
//   }));

//   // Map the nodes, no changes in node rendering here
//   const nodes = data.nodes.map((node) => ({
//     id: node.id,
//     type: "custom",
//     position: node.position,
//     data: { label: node.label },
//   }));

//   return (
//     <ReactFlowProvider>
//       <div style={{ width: "100%", height: "500px" }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           nodeTypes={{
//             custom: (props) => (
//               <CustomNode
//                 {...props}
//                 hoveredNodeId={hoveredNodeId}
//                 setHoveredNodeId={setHoveredNodeId}
//               />
//             ),
//           }}
//           fitView
//         >
//           <Background />
//           <Controls />
//         </ReactFlow>
//       </div>
//     </ReactFlowProvider>
//   );
// };

// export default SupplyChainGraph;
