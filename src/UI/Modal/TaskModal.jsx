import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { editTask } from "../../store/slices/todoSlice";

function TaskModal({ openFullDetails, openFullDetail, task }) {
  const [changeTask, setChangeTask] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      <Modal
        show={openFullDetails}
        onHide={() => openFullDetail()}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{task.item}</p>

          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Please enter your task"
              aria-label="lease enter your task"
              aria-describedby="basic-addon2"
              onChange={(e) => setChangeTask(e.target.value)}
              defaultValue={task.task}
            />
          </InputGroup>

          <Button
            className="btn btn-sm m-2"
            variant="outline-success"
            onClick={() => {
              dispatch(editTask({ index: task.index, task: changeTask }));
              openFullDetail();
            }}
          >
            Save
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TaskModal;
