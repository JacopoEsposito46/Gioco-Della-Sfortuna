
import { Card as BootstrapCard, Badge, Row, Col } from "react-bootstrap";

import "./Style/Timer.css";

function Timer({ timer, round, wrongGuesses, isActive }) {
  // Determina il colore del timer in base al tempo rimanente
  const getTimerColor = () => {
    if (timer <= 10) return "danger";
    if (timer <= 20) return "warning";
    return "success";
  };

  return (
    <BootstrapCard className="timer-card shadow-sm">
      <BootstrapCard.Body className="py-2 px-3">
        <Row className="align-items-center">
          <Col xs={4} className="text-center">
            <div className="timer-section">
              <Badge bg={getTimerColor()} className="timer-badge">
                <i className="bi bi-clock"></i> {timer}s
              </Badge>
              <small className="text-muted d-block">Timer</small>
            </div>
          </Col>
          
          <Col xs={4} className="text-center border-start border-end">
            <div className="round-section">
              <Badge bg="primary" className="round-badge">
                <i className="bi bi-arrow-repeat"></i> {round}
              </Badge>
              <small className="text-muted d-block">Round</small>
            </div>
          </Col>
          
          <Col xs={4} className="text-center">
            <div className="errors-section">
              <Badge bg="danger" className="errors-badge">
                <i className="bi bi-x-circle"></i> {wrongGuesses}
              </Badge>
              <small className="text-muted d-block">Errori</small>
            </div>
          </Col>
        </Row>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Timer;