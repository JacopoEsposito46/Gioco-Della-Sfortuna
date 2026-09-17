import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col, Button} from "react-bootstrap";
import Card from "./Models/Card";
import Form from "react-bootstrap/Form";
import "./Style/Game.css";
import "./Style/font.css";
import API from "../API/API.mjs";
import Timer from "./Timer";
import { StartGame, NextRoundModal, EndGame } from "./GamesModal.jsx";
import { MyCardOr, MyCardVer } from "./MyCard.jsx";

function GameComponent(props) {
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(props.demo);

  const [showStartGame, setShowStartGame] = useState(true);
  const [showNextRoundModal, setShowNextRoundModal] = useState(false);
  const [showEndGame, setShowEndGame] = useState(false);

  const [id_game, setIdGame] = useState(null);

  const [playerCards, setPlayerCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [status, setStatus] = useState(2); // 0: in corso, 1: vinto, 2: perso
  const [round, setRound] = useState(0);
  const [timer, setTimer] = useState(30);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [message, setMessage] = useState("");
  const [roundStatus, setRoundStatus] = useState(2); // 0: in corso, 1: vinto, 2: perso
  
  const navigate = useNavigate();
  //______________________________TIMER______________________________


  //countdown timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);
  
  const handleTimeUp = () => {
    setIsTimerActive(false);
    setSelectedPosition(null);
    handleCheckPosition(null, demo);
  };

  //______________________________GAME______________________________

  const handleCloseRoundModal = () => {
    setShowNextRoundModal(false);
  };

  const handleStartGame = async (demo) => {
    try {
      setLoading(true);

      // Avvia una nuova partita tramite API
      const gameData = await API.startGame(demo);
      // Imposta l'ID della partita
      setIdGame(gameData.id_game);

      // Imposta le 3 carte iniziali ricevute dal server
      setPlayerCards(gameData.initialCards);

      // Imposta la prima carta da indovinare
      setCurrentCard(gameData.currentCard);

      // Imposta lo stato del gioco come "perso" e solo eventualmente lo si cambia a vinto
      setStatus(2);

      // Inizia dal primo round
      setRound(1);

      // Reset dei contatori
      setWrongGuesses(0);
      setSelectedPosition(null);

      setTimer(30);
      setIsTimerActive(true);

      setLoading(false);
    } catch (error) {
      console.error("Error starting game:", error);
      setLoading(false);
      // Mostra un messaggio di errore all'utente
      alert("Errore nell'avvio del gioco: " + error);
    }
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(parseInt(event.target.id));
  };

  const handleConfirm = async () => {
    if (selectedPosition === null) {
      alert("Seleziona una posizione prima di confermare!");
      return;
    }
    await handleCheckPosition(selectedPosition, demo);
  };

  const handleCheckPosition = async (position, demo) => {
    try {
      setLoading(true);
      setIsTimerActive(false);

      // Ottieni il punteggio della carta corrente
      const currentCardScore = await API.getScore(currentCard.id_card);

      if (position === null) {
        // Tempo scaduto
        setWrongGuesses((prev) => prev + 1);
        const statusRound = 2;
        setRoundStatus(2);
        setMessage("Tempo scaduto! Round perso.");
        
        if (demo === false) {
          await API.addRound(id_game, round, currentCard.id_card, statusRound);
        }else {
            setShowEndGame(true);
            return;
        }

        if (wrongGuesses + 1 >= 3) {
          setStatus(2); // Perso
          setShowEndGame(true);
          return;
        }

        setShowNextRoundModal(true);

      } else {
        const isCorrectPosition = checkPosition(  position,  currentCardScore,  playerCards);

        if (isCorrectPosition) {
          // Risposta corretta
          const woncard = new Card(currentCard.id_card, currentCard.caption, currentCard.image_path);
          woncard.setScore(currentCardScore);

          // Inserisci la carta nella posizione corretta
          const newPlayerCards = [...playerCards];
          newPlayerCards.splice(position, 0, woncard);

          setPlayerCards(newPlayerCards);
          const statusRound = 1;
          setRoundStatus(1);
          setMessage("Posizione esatta! Round vinto.");

          if (demo === false) {
            await API.addRound(id_game, round, currentCard.id_card, statusRound);
          }else {
            setShowEndGame(true);
            return;
          }

          if (newPlayerCards.length >= 6) {
            setStatus(1); 
            await API.updateGameStatus(id_game);;
            setShowEndGame(true);
            return;
          }

          setShowNextRoundModal(true);
          
        } else {
          // Risposta sbagliata
          setWrongGuesses((prev) => prev + 1);
          const statusRound = 2;
          setRoundStatus(2);
          setMessage("Posizione sbagliata! Round perso.");
          
          if (demo === false) {
            await API.addRound(id_game, round, currentCard.id_card, statusRound);
          }else {
            setShowEndGame(true);
            return;
          }


          if (wrongGuesses + 1 >= 3) {
            setStatus(2); 
            setShowEndGame(true);
            return;
          }
          
          setShowNextRoundModal(true);
      
        }
      }
    } catch (error) {
      console.error("Error checking position:", error);
      setLoading(false);
      setMessage("Errore durante il controllo della posizione: " + error);
      navigate("/");
    }
  };

  const checkPosition = (position, cardScore, playerCards) => {
    if (position === 0) {
      // Prima posizione: la carta deve avere score minore della prima carta
      return cardScore < playerCards[0].score;
    } else if (position === playerCards.length) {
      // Ultima posizione: la carta deve avere score maggiore dell'ultima carta
      return cardScore > playerCards[playerCards.length - 1].score;
    } else {
      // Posizione intermedia: la carta deve avere score tra le due carte adiacenti
      return (
        cardScore > playerCards[position - 1].score &&
        cardScore < playerCards[position].score
      );
    }
  };

  const handleNextRound = async () => {
    try{
      setCurrentCard(null);
      setCurrentCard(await API.getRandomCard(id_game));
      setSelectedPosition(null);
      setTimer(30);
      setRound((prev) => prev + 1);
      setIsTimerActive(true);
      setLoading(false);
      setShowNextRoundModal(false);
      setMessage("");

    }catch (error) {
      console.error("Error in next round:", error);
      alert("Errore durante il passaggio al round successivo: " + error);
    }
  }

  const handleReset = async () => {
    setLoading(true);

    setShowNextRoundModal(false);
    setShowEndGame(false);

    setIdGame(null);

    setPlayerCards([]);
    setCurrentCard(null);
    setStatus(2); // 0: in corso, 1: vinto, 2: perso
    setRound(0);
    setTimer(30);
    setWrongGuesses(0);
    setIsTimerActive(false);
    setSelectedPosition(null);
    setMessage("");
    setRoundStatus(2);
  }

  if (loading || !currentCard) {
    return (
      <>
        <StartGame handleStartGame={handleStartGame} demo={demo} show={showStartGame} setShow={setShowStartGame}/>
        <NextRoundModal  show={showNextRoundModal}  onClose={handleCloseRoundModal}  roundStatus={roundStatus}  message={message}  playerCards={playerCards}  onNextRound={handleNextRound}  id_game={id_game}/>  
        <EndGame  show={showEndGame}  onClose={setShowEndGame}  status={status}  message={message}  playerCards={playerCards} reset={handleReset} setShowStartGame={setShowStartGame} demo={demo}/>    
        {loading && (
          <Container  fluid  className="d-flex justify-content-center align-items-center mt-4"  >
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Caricamento partita...</p>
            </div>
          </Container>
        )}
      </>
    );
  }

  return (
    <>
      <StartGame handleStartGame={handleStartGame} demo={demo} show={showStartGame} setShow={setShowStartGame}/>
        <NextRoundModal  show={showNextRoundModal}  onClose={handleCloseRoundModal}  roundStatus={roundStatus}  message={message}  playerCards={playerCards}  onNextRound={handleNextRound}  id_game={id_game}/>  
        <EndGame  show={showEndGame}  onClose={setShowEndGame}  status={status}  message={message}  playerCards={playerCards} reset={handleReset} setShowStartGame={setShowStartGame} demo={demo}/>    
      <Container fluid>
        <Timer timer={timer} round={round} wrongGuesses={wrongGuesses} isActive={isTimerActive}/>
        <Button className="conf-button" variant="primary" onClick={handleConfirm}>
          Conferma
        </Button>
        <Row className="align-items-center justify-content-center">
          <Col xs="auto" className="d-flex justify-content-center mb-3">
            <MyCardOr card={currentCard} />
          </Col>
        </Row>
        <Row className="align-items-center justify-content-center">
          <Col xs="auto" className="d-flex align-items-center">
            <Form.Check  inline  name="group1"  type="radio"  id="0"  className="radio-between-cards"  checked={selectedPosition === 0}  onChange={handlePositionChange}/>
          </Col>
          {playerCards.map((card, index) => (
            <React.Fragment key={`card-group-${index}`}>
              <Col xs="auto"  className="d-flex justify-content-center mb-3">
                <MyCardVer card={card} />
              </Col>
              <Col  xs="auto"  className="d-flex align-items-center">
                <Form.Check  inline  name="group1"  type="radio"  id={(index + 1).toString()}  className="radio-between-cards"  checked={selectedPosition === index + 1}  onChange={handlePositionChange}/>
              </Col>
            </React.Fragment>
          ))}
        </Row>
      </Container>
    </>
  );
}




export default GameComponent;
