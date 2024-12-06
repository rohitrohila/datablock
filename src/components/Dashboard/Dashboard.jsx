import React, { useState } from "react";
import SupplyChainGraph from "../ReactFlow/SupplyChainGraoh";

const Dashboard = () => {
  const [valueThreshold, setValueThreshold] = useState(0);

  const data = {
    nodes: [
      { id: "1", label: "Vendor 1", position: { x: 100, y: 100 } },
      { id: "2", label: "Vendor 2", position: { x: 100, y: 200 } },
      { id: "3", label: "Vendor 3", position: { x: 100, y: 300 } },
      { id: "4", label: "Vendor 4", position: { x: 100, y: 400 } },
      { id: "c1", label: "Collection Point 1", position: { x: 300, y: 100 } },
      { id: "c2", label: "Collection Point 2", position: { x: 300, y: 200 } },
      { id: "c3", label: "Collection Point 3", position: { x: 300, y: 300 } },
      { id: "c4", label: "Collection Point 4", position: { x: 300, y: 400 } },

      { id: "w1", label: "Warehouse 1", position: { x: 500, y: 100 } },
      { id: "w2", label: "Warehouse 2", position: { x: 500, y: 200 } },
      { id: "w3", label: "Warehouse 3", position: { x: 500, y: 300 } },
      { id: "w4", label: "Warehouse 4", position: { x: 500, y: 400 } },

      { id: "s1", label: "Store 1", position: { x: 700, y: 100 } },
      { id: "s2", label: "Store 2", position: { x: 700, y: 200 } },
      { id: "s3", label: "Store 3", position: { x: 700, y: 300 } },
      { id: "s4", label: "Store 4", position: { x: 700, y: 400 } },
    ],
    edges: [
      { id: "e1", source: "1", target: "c1", data: { value: 100 } },
      { id: "e2", source: "2", target: "c2", data: { value: 150 } },
      { id: "e3", source: "3", target: "c3", data: { value: 200 } },
      { id: "e4", source: "4", target: "c4", data: { value: 250 } },
      { id: "e5", source: "c1", target: "w4", data: { value: 300 } },
      { id: "e6", source: "c2", target: "w1", data: { value: 350 } },
      { id: "e7", source: "c3", target: "w1", data: { value: 400 } },
      { id: "e8", source: "c4", target: "w2", data: { value: 450 } },
      { id: "e9", source: "w1", target: "s2", data: { value: 500 } },
      { id: "e10", source: "w2", target: "s4", data: { value: 550 } },
      { id: "e11", source: "w3", target: "s1", data: { value: 600 } },
      { id: "e12", source: "w4", target: "s3", data: { value: 650 } },
      { id: "e13", source: "1", target: "c1", data: { value: 650 } },
      { id: "e14", source: "4", target: "c2", data: { value: 650 } },
      { id: "e15", source: "4", target: "c3", data: { value: 150 } },
      { id: "e16", source: "4", target: "c4", data: { value: 150 } },
      { id: "e17", source: "3", target: "c2", data: { value: 650 } },
      { id: "e18", source: "3", target: "c3", data: { value: 650 } },
      { id: "e19", source: "3", target: "c4", data: { value: 650 } },
    ],
  };

  const filteredEdges = data.edges.filter(
    (edge) => edge.data.value > valueThreshold
  );

  return (
    <div>
      <div style={{ width: "100%" }}>
        <label>Filter Edges by Value: </label>
        <input
          type="range"
          min="0"
          max="850"
          value={valueThreshold}
          onChange={(e) => setValueThreshold(Number(e.target.value))}
        />
        <span>{valueThreshold}</span>
      </div>
      <SupplyChainGraph data={{ ...data, edges: filteredEdges }} />
    </div>
  );
};

export default Dashboard;
