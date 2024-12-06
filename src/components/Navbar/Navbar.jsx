import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { useSearchParams, Link, useLocation } from "react-router-dom";

function TextLinkExample() {
  const handleLogut = () => {
    alert("logout");
  };
  return (
    <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://w7.pngwing.com/pngs/172/871/png-transparent-data-visualization-management-organization-information-others-miscellaneous-blue-text.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Brand href="#home">Data Visualization</Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          <Link to="/login" className="nav-link">
            <Navbar.Text>Signed in as: Rohit Rohila</Navbar.Text>
          </Link>
        </Navbar.Collapse>

        <Button
          type="submit"
          className="m-2"
          variant="light"
          onClick={handleLogut}
        >
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default TextLinkExample;
