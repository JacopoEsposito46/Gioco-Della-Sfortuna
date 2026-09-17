import React from "react";
import { Modal, Button, Card as BootstrapCard, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style/font.css"; // Assuming you have a CSS file for custom styles
import {MyCardModal} from "./MyCard"; // Import your card components

export function StartGame(props) {
  const navigate = useNavigate();

  const handleClose = () => props.setShow(false);
  const handlestartGame = () => {
    handleClose();
    props.handleStartGame(props.demo);
  };

  return (
    <>
      <Modal  show={props.show}  onHide={handleClose}  animation={false}  centered  backdrop="static"  keyboard={false}>
        <Modal.Header  className="bg-primary text-white">
          <Modal.Title className="w-100 testo-centrato">
            Gioco della Sfortuna
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <h5 className="testo-centrato">Benvenuto!</h5>
          </div>
          <p className="lead testo-centrato">
            Stai per iniziare una nuova partita del{" "}
            <strong>Gioco della Sfortuna</strong>.
          </p>
          <p className="text-muted testo-centrato">
            Dovrai ordinare le carte dalla situazione più sfortunata a quella
            meno sfortunata. Sei pronto per la sfida?
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button  variant="primary"  size="lg"  onClick={handlestartGame}  className="px-4">
            Inizia Partita
          </Button>
          <Button  variant="outline-secondary"  size="lg"  onClick={() => navigate("/")}  className="px-4">
            Annulla
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function NextRoundModal(props) {
  const isWon = props.roundStatus === 1;
  const headerClass = isWon ? "bg-success text-white" : "bg-danger text-white";
  const title = isWon ? "Round Vinto!" : "Round Perso!";

  return (
    <>
      <Modal show={props.show} onHide={props.onClose} animation={false} centered backdrop="static" keyboard={false} size="xl" scrollable>
        <Modal.Header className={headerClass}>
          <Modal.Title className="w-100 testo-centrato">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <h5 className="testo-centrato">{props.message}</h5>
          </div>
          <div className="mb-3">
            <p className="text-muted testo-centrato">
              <strong>Carte guadagnate: {props.playerCards.length}</strong>
            </p>
            <Row className="justify-content-center">
              {props.playerCards.map((card, index) => (
                <React.Fragment key={`card-group-${index}`}>
                  <Col xs="auto"  className="d-flex justify-content-center mb-3">
                    <MyCardModal card={card} />
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button  variant="success"  size="lg"  onClick={props.onNextRound}  className="px-4">
            Prossimo Round
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EndGame(props) {
  const navigate = useNavigate();
  
  let headerClass, title, isWon;
  if(props.demo === true){
    headerClass = "bg-primary text-white";
    title = "Partita Demo Terminata";
  }else{
    isWon = props.status === 1;
    headerClass = isWon ? "bg-success text-white" : "bg-danger text-white";
    title = isWon ? "Hai vinto la partita!" : "Hai perso la partita!";
  }

  const handleNewGame = () => {
    if (props.demo === false) {
      props.onClose();
      props.reset();
      props.setShowStartGame(true);
      navigate("/game");
    }else{
      props.onClose();
      props.reset();
      props.setShowStartGame(true);
      navigate("/demo");
    }
  }

  const  handleBackToHome = () => {
    props.onClose();
    props.reset();
    navigate("/");
  }

  return (
    <>
      <Modal show={props.show} onHide={props.onClose} animation={false} centered backdrop="static" keyboard={false} size="xl" scrollable>
        <Modal.Header className={headerClass}>
          <Modal.Title className="w-100 testo-centrato">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <h5 className="testo-centrato">{props.message}</h5>
          </div>
          <div className="mb-3">
            <p className="text-muted testo-centrato">
              <strong>{props.demo ? "La partita demo del gioco è terminata" : "Queste sono le carte che hai collezionato :"} </strong>
            </p>
            {props.playerCards.length === 6 ? (
              // Se ci sono 6 carte (vittoria), dividiamo in due righe da 3
              <>
                <Row className="justify-content-center mb-3">
                  {props.playerCards.slice(0, 3).map((card, index) => (
                    <React.Fragment key={`card-group-${index}`}>
                      <Col xs="auto" className="d-flex justify-content-center mb-3">
                        <MyCardModal card={card} />
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                <Row className="justify-content-center">
                  {props.playerCards.slice(3, 6).map((card, index) => (
                    <React.Fragment key={`card-group-${index + 3}`}>
                      <Col xs="auto" className="d-flex justify-content-center mb-3">
                        <MyCardModal card={card} />
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              </>
            ) : (
              // Per meno di 6 carte, manteniamo il layout originale su una riga
              <Row className="justify-content-center">
                {props.playerCards.map((card, index) => (
                  <React.Fragment key={`card-group-${index}`}>
                    <Col xs="auto" className="d-flex justify-content-center mb-3">
                      <MyCardModal card={card} />
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center gap-3">
          <Button  variant="danger"  size="lg"  onClick={handleBackToHome}  className="px-4">
            Esci
          </Button>
          <Button  variant="success"  size="lg"  onClick={handleNewGame}  className="px-4">
            Nuova Partita
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}