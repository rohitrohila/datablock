import React, { useState } from "react";
import { Card, Modal } from "react-bootstrap";
import "./modal.css";

// Sample data structure for categories and data
const categories = ["Input", "Visualization", "Transform"];
const categoryData = {
  Input: [
    {
      title: "File",
      input: "",
      output: "Dataset, Geojson",
      description: "Handless csv, json, geojson, topojsonFile",
    },
    {
      title: "Paste",
      input: "",
      output: "Dataset, Object, String, Number, Geojson",
      description:
        "Paste input: string, number, csv, json, geojson or topojson.",
    },
    {
      title: "HTTP Request",
      input: "",
      output: "Dataset, Object, Geojson",
      description: "Loads data via a http request.",
    },
    {
      title: "Sheets",
      input: "",
      output: "Dataset, Object, Geojson",
      description: "Loads data via a http request.",
    },
    {
      title: "Example Data",
      input: "",
      output: "Dataset, Geojson",
      description: "Some example data for playing around with data blocks.",
    },
  ],
  Transform: [
    {
      title: "Filter Data",
      input: "Dataset",
      output: "Dataset",
      description: "Groups a data set based on a given column name.",
    },
    {
      title: "Slice Data",
      input: "Dataset, Array",
      output: "Dataset",
      description: "Slice the data sets based on the indices.",
    },
    {
      title: "Sort Data",
      input: "Dataset, Array",
      output: "Dataset",
      description: "Sort the data sets based on the column names.",
    },
    {
      title: "Rename Column",
      input: "Dataset, Array",
      output: "Dataset",
      description: "Rename the data column based on the column names.",
    },
    {
      title: "Javascript",
      input: "Dataset, Array",
      output: "Dataset",
      description: "Rename the data column based on the column names.",
    },
  ],

  // GeoData: [
  //   "Bounding Box",
  //   "Centroid",
  //   "Area",
  //   "Buffer",
  //   "Simplify",
  //   "Data To Points",
  //   "Topojson To GeoJson",
  // ],
  Visualization: [
    {
      title: "Bar Chart",
      input: "Dataset",
      output: "Dataset",
      description: "Displays a bar chart of given x and y column names.",
    },
    {
      title: "Histogram",
      input: "Dataset",
      output: "Dataset",
      description: "Displays a histogram of a given column name.",
    },
    {
      title: "Scatterplot",
      input: "Dataset",
      output: "Dataset",
      description: "Displays a scatterplot of given x and y column names.",
    },
    {
      title: "Time Series",
      input: "Dataset",
      output: "Dataset",
      description:
        "Displays a timeseries line chart of given x and y column names.",
    },
  ],
  // Misc: ["Stats", "MarkDown", "Export"],
};

const ModalWithCategories = ({ show, onHide, handleNodeSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedData, setSelectedData] = useState([]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedData(categoryData[category]);
  };

  const handleCloseModal = (e) => {
    // Prevent click event from affecting React Flow
    onHide();
  };
  const handleCategoryItemClick = (item) => {
    console.log(item);
    let responseToReactFlow = {};
    if (item.title === "HTTP Request") {
      responseToReactFlow = { value: "http", title: "Http Node" };
    } else if (item.title === "Bar Chart") {
      responseToReactFlow = { value: "graphview", title: "GraphView Node" };
    } else if (item.title === "File") {
      responseToReactFlow = { value: "file", title: "FileUpload Node" };
    } else if (item.title === "Paste") {
      responseToReactFlow = { value: "paste", title: "DataInput Node" };
    } else if (item.title === "Sheets") {
      responseToReactFlow = { value: "sheet", title: "Sheet Node" };
    } else if (item.title === "Filter Data") {
      responseToReactFlow = { value: "filter", title: "Filter Node" };
    } else if (item.title === "Slice Data") {
      responseToReactFlow = { value: "slice", title: "Slice Node" };
    } else if (item.title === "Sort Data") {
      responseToReactFlow = { value: "sort", title: "Sort Node" };
    } else if (item.title === "Histogram") {
      responseToReactFlow = { value: "histogramView", title: "Histogram Node" };
    } else if (item.title === "Scatterplot") {
      responseToReactFlow = { value: "scatter", title: "ScatterPlot Node" };
    } else if (item.title === "Rename Column") {
      responseToReactFlow = { value: "rename", title: "RenameColumns Node" };
    } else if (item.title === "Javascript") {
      responseToReactFlow = {
        value: "javascript",
        title: "JavaScript Node",
      };
    }
    handleNodeSelect(responseToReactFlow);
  };

  const renderData = () => {
    if (!selectedCategory) {
      return <p>Select a category to see data</p>;
    }
    console.log(selectedCategory);
    return (
      <>
        <div style={{ display: "ruby" }}>
          {selectedData.map((item, index) => (
            <>
              <Card
                style={{ width: "18rem", margin: "5px" }}
                onClick={() => handleCategoryItemClick(item)}
              >
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>

                  <Card.Text>Input{item.input}</Card.Text>
                  <Card.Text>Output{item.output}</Card.Text>
                </Card.Body>
              </Card>
            </>
          ))}
        </div>
      </>
    );
  };

  if (!show) return null;

  return (
    <Modal
      size="xl"
      show={show}
      onHide={handleCloseModal}
      aria-labelledby="example-modal-sizes-title-lg"
      dialogClassName=" custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Data Categories
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={modalContentStyles}>
          {/* Left Panel (Categories) */}
          <div style={leftPanelStyles}>
            <h3>Categories</h3>
            <ul>
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  style={categoryItemStyles}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel (Data) */}
          <div style={rightPanelStyles}>
            <h3>Category</h3>
            {renderData()}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// Styles for the modal content
const modalContentStyles = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px",
};

const leftPanelStyles = {
  width: "30%",
  paddingRight: "20px",
  borderRight: "1px solid #ccc",
};

const rightPanelStyles = {
  width: "70%",
  paddingLeft: "20px",
};

const categoryItemStyles = {
  cursor: "pointer",
  padding: "10px 0",
  borderBottom: "1px solid #ccc",
};

export default ModalWithCategories;
