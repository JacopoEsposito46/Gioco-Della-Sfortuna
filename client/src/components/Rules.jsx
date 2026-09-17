import { Container, Row, Col, Card, ListGroup, Alert } from "react-bootstrap";
import "./Style/font.css";
import "./Style/png.css";

function Rules() {
  const rules = [
    "Inizia con 3 carte casuali con situazioni sfortunate della vita di un palestrato",
    "Ogni round ricevi una nuova situazione sfortunata",
    "Devi indovinare dove posizionarla tra le tue carte in base all'indice di sfortuna",
    "Hai 30 secondi per decidere la posizione corretta",
    "Se indovini, ottieni la carta. Se sbagli o il tempo scade, perdi il round",
    "Vinci se raggiungi 6 carte totali",
    "Perdi se sbagli 3 volte",
    "Gli utenti registrati possono giocare partite complete e vedere la cronologia",
    "Gli utenti anonimi possono giocare solo demo di un round",
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="text-center mb-4">
            <h1 className="display-5 font-testo gap"> <img src={`http://localhost:3001/static/book.png`} className="png-1"></img>Come Si Gioca</h1>
            <p className="lead text-muted font-testo">
              Impara le regole di Stuff Happens - Gym Edition
            </p>
          </div>

          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0 font-testo">Stuff Happens - Gym Edition</h3>
            </Card.Header>
            <Card.Body>
              <h5 className="mb-3 font-testo">Regole del Gioco:</h5>
              <ListGroup variant="flush">
                {rules.map((rule, index) => (
                  <ListGroup.Item key={index}  className="px-0">
                    <div className="d-flex align-items-start">
                      <span className="font-testo">{rule}</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Row className="mt-5">
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0 font-testo"> Come Vincere-Versione completa</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0 font-testo">
                    <li>
                      Raccogli <strong>6 carte</strong> in totale
                    </li>
                    <li>Indovina correttamente la posizione delle carte</li>
                    <li>
                      Usa strategia e intuizione per valutare l'indice di
                      sfortuna
                    </li>
                    <li>
                      Gestisci bene il tempo: hai solo 30 secondi per decidere!
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-danger text-white">
                  <h5 className="mb-0 font-testo"> Come Perdere-Versione completa</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0 font-testo">
                    <li>
                      Sbagli la posizione di <strong>3 carte</strong>
                    </li>
                    <li>Il tempo scade senza aver fatto una scelta</li>
                    <li>
                      Posizioni male una carta rispetto all'indice di sfortuna
                    </li>
                    <li>Non riesci a raggiungere 6 carte prima dei 3 errori</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>          
          <Alert variant="info" className="mt-4">
            <Alert.Heading className="font-testo">
              Suggerimenti Strategici
            </Alert.Heading>
            <ul className="mb-0 font-testo">
              <li>
                <strong>Osserva attentamente</strong> le situazioni delle tue
                carte iniziali
              </li>
              <li>
                <strong>Pensa in termini relativi:</strong> è più o meno grave
                di quello che hai?
              </li>
              <li>
                <strong>Considera il contesto:</strong> alcune situazioni
                sembrano gravi ma sono relativamente comuni
              </li>
              <li>
                <strong>Non perdere tempo:</strong> fidati del tuo primo
                istinto!
              </li>
            </ul>
          </Alert>

          <Alert variant="warning" className="mt-3">
            <Alert.Heading className="font-testo">
               Modalità di Gioco
            </Alert.Heading>
            <Row>              
              <Col md={6}>
                <h6 className="font-testo">Utenti Registrati</h6>
                <ul className="small mb-3 font-testo">
                  <li>Partite complete fino alla vittoria o sconfitta</li>
                  <li>Cronologia delle partite salvata</li>
                  <li>Statistiche dettagliate</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6 className="font-testo"> Utenti Anonimi</h6>
                <ul className="small mb-0 font-testo">
                  <li>Solo partite demo di un round</li>
                  <li>Perfetto per provare il gioco</li>
                  <li>Nessun salvataggio dei progressi</li>
                </ul>
              </Col>
            </Row>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}
export default Rules;
