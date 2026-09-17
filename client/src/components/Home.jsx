import { Container } from "react-bootstrap";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import "./Style/font.css";
import "./Style/Home.css";
import "./Style/png.css";

function Home(props) {
  const navigate = useNavigate();

  return (
    <>
      <Container className="mt-4">
        <Row className="justify-content-center align-items-center ">
          <Col xs={12} className="text-center">
            <h1 className="testo-centrato mb-3"><img src={`http://localhost:3001/static/armsx.png`} className="png ml-2"></img> STUFF HAPPENS <img src={`http://localhost:3001/static/armdx.png`} className="png ml-2"></img></h1>
            <p className="lead text-muted testo-centrato">
              Metti alla prova la tua fortuna in questo gioco avvincente!
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center mt-4">
          <Col xs={12} md={6} lg={4} className="col-home">
            <Card className="GymCard h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <div className="display-4 mb-2"><img src={`http://localhost:3001/static/book.png`} className="png"></img></div>
                  <Card.Title className="testo-centrato">
                    <strong>Regole</strong>
                  </Card.Title>
                </div>
                <Card.Text className="testo-giustificato flex-grow-1">
                    Prima di iniziare a giocare, ti consigliamo di leggere
                    attentamente le regole del gioco per comprendere come
                    funziona.
                </Card.Text>
                <div className="justify-content-center d-flex mt-auto">
                  <Button  variant="primary"  size="lg"  onClick={() => navigate("/rules")}>
                    Regole
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4} className="col-home">
            <Card className="GymCard h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <div className="display-4 mb-2"><img src={`http://localhost:3001/static/joystick.png`} className="png"></img></div>
                  <Card.Title className="testo-centrato">
                    <strong>Gioca</strong>
                  </Card.Title>
                </div>
                <Card.Text className="testo-giustificato flex-grow-1">
                    Metti alla prova la tua fortuna! Inizia una partita completa
                    e cerca di resistere il più a lungo possibile contro gli
                    eventi sfortunati.
                </Card.Text>
                <div className="justify-content-center d-flex mt-auto">
                  <Button variant="primary" size="lg" onClick={props.loggedIn ? () => navigate("/game") : props.handleShow}>  
                    Gioca
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4} className="col-home">
            <Card className="GymCard h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                {props.loggedIn ? (
                  <>
                    <div className="text-center mb-3">
                      <div className="display-4 mb-2"><img src={`http://localhost:3001/static/barGraph.png`} className="png"></img></div>
                      <Card.Title className="testo-centrato">
                        <strong>Storico Partite</strong>
                      </Card.Title>
                    </div>
                    <Card.Text className="testo-giustificato flex-grow-1">
                        Visualizza tutte le tue partite precedenti e controlla i
                        tuoi progressi nel tempo. Analizza le tue performance e
                        migliora le tue strategie.
                    </Card.Text>
                    <div className="justify-content-center d-flex mt-auto">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate("/history")}
                      >
                        Storico
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-3">
                      <div className="display-4 mb-2"><img src={`http://localhost:3001/static/target.png`} className="png"></img></div>
                      <Card.Title className="testo-centrato">
                        <strong>Demo</strong>
                      </Card.Title>
                    </div>
                    <Card.Text className="testo-giustificato flex-grow-1">
                        Non sei sicuro di come funziona? Prova la modalità demo
                        con un singolo turno per familiarizzare con le
                        meccaniche di gioco.
                    </Card.Text>
                    <div className="justify-content-center d-flex mt-auto">
                      <Button variant="primary" size="lg" onClick={() => navigate("/demo")}>
                        Demo
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
