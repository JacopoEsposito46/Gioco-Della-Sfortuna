// imports
import express from "express";
import morgan from "morgan";
import { check, validationResult } from "express-validator";
import cors from "cors";
import dao from "./dao.mjs";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan("dev"));

app.use('/static', express.static('static'));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessState: 200,
  credentials: true,
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await dao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


// ROUTES SESSIONE E LOGIN

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), function (req, res) {
  return res.status(201).json(req.user);
});


// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// ROUTE GIOCO

// POST /api/game - Inizia una nuova partita
app.post("/api/game", [check("demo").isBoolean().optional()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const isDemo = req.body.demo || false;
  
  try {
    let id_game;
    
    // Se non è demo, l'utente deve essere autenticato
    if (!isDemo && !req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required for full game" });
    }
    
    // Crea una nuova partita solo per utenti autenticati
    if (!isDemo) {
      id_game = await dao.createGame(req.user.id_user);
      
      // Ottieni 3 carte iniziali
      const initialCards = await dao.getInitialCards(id_game);
      
      // Crea i round per le carte iniziali
      await dao.createInitialRounds(id_game, initialCards);
      
      // Ottieni la prima carta da indovinare
      const currentCard = await dao.getRandomCard(id_game);
      
      if (!currentCard) {
        return res.status(500).json({ error: "No cards available" });
      }
      
      return res.status(200).json({
        id_game: id_game,
        initialCards: initialCards,
        currentCard: {
          id_card: currentCard.id_card,
          caption: currentCard.caption,
          image_path: currentCard.image_path
        },
        demo: isDemo
      });
    } else {
      // Per demo
      id_game = `demo_${Date.now()}`;
      const initialCards = await dao.getInitialCards(id_game);
      const currentCard = await dao.getRandomCard(id_game);
      
      return res.status(200).json({
        id_game: id_game,
        initialCards: initialCards,
        currentCard: {
          id_card: currentCard.id_card,
          caption: currentCard.caption,
          image_path: currentCard.image_path
        },
        demo: isDemo
      });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/game/:id_game/status - Aggiorna lo stato del gioco corrente
app.patch("/api/game/:id_game/status", isLoggedIn, async (req, res) => {
  const id_game = req.params.id_game;

  try {
    const updatedRound = await dao.updateGameStatus(id_game);
    if (!updatedRound) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(updatedRound);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/user/:id_user/games - Ottieni la cronologia delle partite dell'utente
app.get("/api/user/:id_user/games", isLoggedIn, async (req, res) => {
  try {
    // Verifica che l'utente possa accedere solo ai propri dati
    const requestedUserId = parseInt(req.params.id_user);

    if (requestedUserId !== req.user.id_user) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const history = await dao.getGamesByUser(requestedUserId);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/game/:id_game/round - Aggiungi un round al gioco corrente
app.post("/api/game/:id_game/round", isLoggedIn,[
    check("id_game", "id_game deve essere un intero positivo").isInt({min: 1}),
    check("id_card").isInt({min: 1}).withMessage("id_card deve essere un intero positivo"),
    check("nround").isInt({min: 0}).withMessage("il numero di round deve essere un intero positivo"),
    check("status").isInt({min: 1, max: 2}).withMessage("status deve essere 1 (partita vinta) o 2 (partita persa)")], 
    async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const id_game = parseInt(req.params.id_game);
  const { id_card , nround, status } = req.body;

  try{
    const id_round = await dao.createRound(id_game, nround, id_card , status);
    if (!id_round) 
      return res.status(404).json({ error: "Game not found" });
    res.json(id_round);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/card/random - Ottieni una carta casuale per il gioco corrente
app.get("/api/card/random", async (req, res) => {  
  const id_game = req.query.id_game; // Ottieni l'id del gioco dalla query string
  
  // Protezione: solo per demo games o utenti autenticati
  const isDemo = id_game && id_game.toString().startsWith('demo_');
  if (!isDemo && !req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  try {
    const randomCard = await dao.getRandomCard(id_game);
    if (!randomCard) {
      return res.status(404).json({ error: "No cards available" });
    }
    res.json(randomCard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/card/:id_card - Ottieni il punteggio di una carta specifica
app.get("/api/card/:id_card", async (req, res) => {
  const id_card = req.params.id_card;
  
  try {
    const score = await dao.getCardScore(id_card);
    if (!score) {
      return res.status(404).json({ error: "Card or Game not found" });
    }
    res.json(score);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
