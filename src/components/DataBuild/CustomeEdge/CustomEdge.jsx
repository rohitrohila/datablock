import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { getBezierPath } from "react-flow-renderer";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const isError = data?.error; // Check if the edge has an error

  // Calculate the midpoint of the edge for placing the warning icon
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Midpoint of the edge for placing the warning icon
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <>
      {/* Render the edge path */}
      <path d={edgePath} stroke="#B1B1B7" fill="transparent" strokeWidth={2} />

      {/* If error exists, render the warning icon */}
      {isError && (
        <div
          style={{
            position: "absolute",
            top: midY - 10, // Adjust the position of the icon
            left: midX - 10,
            fontSize: "20px",
            color: "red",
            zIndex: 10,
          }}
        >
          <FaExclamationTriangle />
        </div>
      )}
    </>
  );
};

export default CustomEdge;
