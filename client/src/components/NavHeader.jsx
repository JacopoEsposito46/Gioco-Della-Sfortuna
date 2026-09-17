import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router";
import { LogoutButton } from "./AuthComponents";
import "./Style/font.css";
import "./Style/NavHeader.css";
import Modal from 'react-bootstrap/Modal';
import { LoginForm } from "./AuthComponents";

function NavHeader(props) {

  return (
    <Navbar className="background-color navbar-fixed" data-bs-theme="light">
      <Container fluid >
        <Link to="/" className=" navbar-brand font"> Stuff Happens</Link>

        {props.loggedIn ? (
          <LogoutButton   logout={props.handleLogout} />
        ) : (
          <Button size="lg" onClick={props.handleShow}>
            Login 
          </Button>
        )}

      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm handleLogin={props.handleLogin} handleClose={props.handleClose} />
        </Modal.Body>
      </Modal>

      </Container>
    </Navbar>
  );
}

export default NavHeader;
