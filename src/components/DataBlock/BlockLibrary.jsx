import React from "react";
import "./BlockModal.css";

// Example input card data
const inputCards = [
  {
    id: "file",
    title: "File",
    description: "Handles CSV, JSON, GeoJSON, or TopoJSON files.",
  },
  {
    id: "paste",
    title: "Paste",
    description: "Paste input: string, CSV, or JSON.",
  },
  {
    id: "http",
    title: "HTTP Request",
    description: "Load data via an HTTP request.",
  },
];

const BlockModal = ({ onClose, onCardSelect }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select a Block</h2>
        <div className="card-container">
          {inputCards.map((card) => (
            <div
              key={card.id}
              className="card"
              onClick={() => onCardSelect(card)}
            >
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
        <button className="modal-button close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BlockModal;
