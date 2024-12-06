import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteTask, doneTask } from "../../store/slices/todoSlice";
import TaskModal from "../../UI/Modal/TaskModal";
const AllTaskTable = () => {
  const allTask = useSelector((state) => state?.todo?.allTask);
  const dispatch = useDispatch();

  const [openFullDetails, setOpenFullDetails] = useState(false);
  const [task, setTask] = useState(null);

  const openFullDetail = (index, item) => {
    if (item) {
      setTask({ index: index, item: item.task });
    }
    setOpenFullDetails(!openFullDetails);
  };

  return (
    <>
      <Container>
        <Row>
          {openFullDetails ? (
            <TaskModal
              openFullDetails={openFullDetails}
              openFullDetail={openFullDetail}
              task={task}
            />
          ) : (
            ""
          )}
          {allTask.map((item, index) => (
            <>
              <Col xs lg="3" className="p-2" key={item.id}>
                <Card
                  style={{
                    width: "18rem",
                    backgroundColor: item.isCompleted ? "#72a672" : "",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src="https://t3.ftcdn.net/jpg/01/00/65/64/360_F_100656447_xzaQm1D1p6oWUX4WCBX7LiDyD8Dw9sJw.jpg"
                  />
                  <Card.Body>
                    <Card.Title>Task Details:</Card.Title>
                    <Card.Text>{item.task}</Card.Text>
                    <Button
                      className="btn btn-sm m-2"
                      variant="outline-danger"
                      onClick={() => dispatch(deleteTask(index))}
                    >
                      Delete
                    </Button>
                    <Button
                      className="btn btn-sm m-2"
                      variant="outline-success"
                      onClick={() => dispatch(doneTask(index))}
                    >
                      Done
                    </Button>
                    <Button
                      className="btn btn-sm m-2"
                      variant="warning  "
                      onClick={() => openFullDetail(index, item)}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </>
          ))}
        </Row>
      </Container>
    </>
  );
};
export default AllTaskTable;
