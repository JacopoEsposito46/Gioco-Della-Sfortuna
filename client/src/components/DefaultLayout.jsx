import { Alert, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import { useEffect } from "react";
import NavHeader from "./NavHeader";
import "./Style/Default.css"

function DefaultLayout(props) {
  
  useEffect(() => {
    let timeoutId;
    if (props.message && props.message.msg) {
      timeoutId = setTimeout(() => {
        props.setMessage("");
      }, 3000); // 3 secondi fissi per tutti i messaggi
    }

    // Cleanup del timeout se il componente viene smontato o il messaggio cambia
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [props.message, props.setMessage]);

  return (
    <>
      <NavHeader loggedIn={props.loggedIn} handleLogout={props.handleLogout} handleLogin={props.handleLogin} handleShow={props.handleShow} handleClose={props.handleClose} show={props.show} />      
      <Container fluid className="main-container">
        {props.message && (
          <Row>
            <Alert   variant={props.message.type}    onClose={() => props.setMessage("")}    dismissible>
              {props.message.msg}
            </Alert>
          </Row>
        )}
        <Outlet />
      </Container>
      <footer className="fixed-bottom text-center bg-light py-2 border-top">
        <p className="mb-0">
          © 2025 Stuff Happens. Powered by Jacopo Esposito alias s349405.
        </p>
      </footer>
    </>
  );
}

export default DefaultLayout;
