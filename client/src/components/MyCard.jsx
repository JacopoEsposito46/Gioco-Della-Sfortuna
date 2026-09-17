import Card from 'react-bootstrap/Card';
import "./Style/font.css";
import { Badge } from 'react-bootstrap';
import "./Style/MyCard.css";

export function MyCardOr (props) {
    return (
        <Card className="my-card-or custom-card flex-row">
            <Card.Img  variant="left"  src={`http://localhost:3001/static/${props.card.image_path}`}  className=" my-card-or-img" />
            <Card.Body className="d-flex align-items-center">
            <Card.Text className="testo-centrato-carte flex-grow-1 d-flex align-items-center">
                {props.card?.caption || "Caricamento..."}
            </Card.Text>
            </Card.Body>
        </Card> 
    )
    
}

export function MyCardVer(props) {
    return (
        <Card  className="my-card-ver custom-card d-flex flex-column">
            <Card.Img  variant="top"  src={`http://localhost:3001/static/${props.card.image_path}`}  className="card-img-fitted"/>
            <Card.Body className="d-flex flex-column justify-content-between">
            <Card.Text className="my-card-ver-text testo-centrato-carte flex-grow-1 d-flex align-items-center mt-2">
                {props.card.caption}
            </Card.Text>
            <Badge  className="text-center mt-2" >
                Punteggio: {props.card.score || 0}
            </Badge>
            </Card.Body>
        </Card>
    )
}

export function MyCardModal (props) {
    return (
        <Card className="my-card-mod custom-card d-flex flex-column">
            <Card.Img variant="top" src={`http://localhost:3001/static/${props.card.image_path}`} className="card-img-fitted"/>
            <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Text className="my-card-mod-text testo-centrato-carte flex-grow-1 d-flex align-items-center">
                    {props.card.caption}
                </Card.Text>
                <Badge  className="text-center mt-2" >
                    Punteggio: {props.card.score || 0}
                </Badge>
            </Card.Body>
        </Card>
    )
}

export function MyCardOrHy(props) {
    return (
        <Card className="custom-card d-flex flex-row">
            <Card.Img variant='left' src={`http://localhost:3001/static/${props.round.card.image_path}`} className="my-card-or-hy-img img-fluid rounded-start" alt={props.round.card.caption} />
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                <Card.Text className="testo-centrato-carte mb-2" title={props.round.card.caption}>
                    {props.round.card.caption}
                </Card.Text>
                <Badge bg="info" className='mt-2 d-flex gap-2 flex-wrap justify-content-center'>
                    Punteggio: {props.round.card.score}
                </Badge>
            </Card.Body>
        </Card>
    )
}