import React,{ useState, useEffect } from "react";
import {  Container,  Row,  Col , Card,  Badge,  Alert,  Spinner,  Table,  Accordion,} from "react-bootstrap";
import { useNavigate } from "react-router";
import API from "../API/API.mjs";
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import "./Style/font.css";
import { MyCardModal, MyCardOrHy } from "./MyCard";
import "./Style/png.css";

dayjs.locale('it');

function History(props) {
  const navigate = useNavigate();
  const { user } = props;
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchHistory = async () => {
      try {
        const history = await API.getGameHistory(user.id_user);
        setGameHistory(history);
      } catch (err) {
        setError(err.message || "Errore nel caricamento della cronologia");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento cronologia...</span>
        </Spinner>
        <p className="mt-3">Caricamento cronologia partite...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          Errore nel caricamento della cronologia: {error}
        </Alert>
      </Container>
    );
  }

  const stats = {
    totalGames: gameHistory.length,
    gamesWon: gameHistory.filter((g) => g.status === 1).length,
    gamesLost: gameHistory.filter((g) => g.status === 2).length,
    totalCards: gameHistory.reduce((sum, g) => sum + (g.collectedCard || 0), 0),
    winRate: gameHistory.length > 0? ((gameHistory.filter((g) => g.status === 1).length / gameHistory.length) * 100).toFixed(1) : 0,
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  return (
    <Container>      
      <div className="text-center mb-4">
        <h2><img src={`http://localhost:3001/static/profile.png`} className="png mb-2"></img> Profilo di {user.username}</h2>
        <p className="text-muted">La tua cronologia di gioco e statistiche</p>
      </div>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{stats.totalGames}</h3>
              <p className="mb-0">Partite Totali</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-success">{stats.gamesWon}</h3>
              <p className="mb-0">Vittorie</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-danger">{stats.gamesLost}</h3>
              <p className="mb-0">Sconfitte</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-info">{stats.winRate}%</h3>
              <p className="mb-0">% Vittorie</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {gameHistory.length === 0 ? (
        
        <Alert variant="info" className="text-center">
          <Alert.Heading>Nessuna partita ancora</Alert.Heading>
          <p>
            Non hai ancora giocato nessuna partita completa. Inizia subito a
            giocare!
          </p>
        </Alert>
      ) : (
        <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Cronologia Partite</h5>
          </Card.Header>
          <Card.Body>
            <Accordion>
              {gameHistory.map((game, index) => {
                const initialCards = game.rounds.filter((round) => round.round_number === 0);
                const playedRounds = game.rounds.filter((round) => round.round_number > 0);

                return (
                  <Accordion.Item eventKey={index.toString()} key={game.id_game}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <span>
                          <Badge
                            bg={game.status === 1 ? "success" : "danger"}
                            className="me-2">
                            {game.status === 1 ? "VINTA" : "PERSA"}
                          </Badge>
                          <strong>Partita #{gameHistory.length - index}</strong>
                        </span>
                        <small className="text-muted">
                          <strong>{formatDate(game.date)} - Carte: {game.collectedCard || 0} / 6 </strong>
                        </small>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>                        
                        <Col md={6}>
                          <h6>Carte Iniziali</h6>
                          <div className="row">
                            {initialCards.map((round) => (
                              <React.Fragment key={`card-group-${round.card.id_card}`}>
                                <Col xs="auto"  className="d-flex justify-content-center mb-3">
                                  <MyCardModal card={round.card} />
                                </Col>
                              </React.Fragment>
                            ))}
                          </div>
                        </Col>                          
                        <Col md={6}>
                          <h6>Round Giocati</h6>
                          {playedRounds.length > 0 ? (
                            <Accordion>
                              {playedRounds.map((round, roundIndex) => (
                                <Accordion.Item   eventKey={`round-${roundIndex}`}   key={`round-${round.id_round}`}>
                                  <Accordion.Header>
                                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                      <span>
                                        <Badge  bg={round.guessed === 1 ? "success" : "danger"}  className="me-2"> {round.guessed === 1 ? "Vinto" : "Perso"} </Badge>
                                        Round {round.round_number}
                                      </span>
                                    </div>
                                  </Accordion.Header>                                  
                                  <Accordion.Body>
                                    <MyCardOrHy round={round} />
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          ) : (
                            <p className="text-muted small">
                              Nessun round giocato
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default History;