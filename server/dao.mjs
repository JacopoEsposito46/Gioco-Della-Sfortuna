import sqlite from "sqlite3";
import crypto from "crypto";
import Round from "./Models/Round.mjs";
import Game from "./Models/Game.mjs";
import Card from "./Models/Card.mjs";
import dayjs from "dayjs";

const GAME_STATUS_LOST = 2;
const GAME_STATUS_WON = 1;

// open the database
const db = new sqlite.Database("database.sqlite", (err) => {
  if (err) throw err;
});

const gameCardsTaken = new Map();

//prende l'utente e verifica la password
export const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id_user: row.id_user, username: row.username };

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

//__________________________CRONOLOGIA_DAO______________________________________

export const getRoundsByGame = (id_game) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT r.*, c.caption, c.image_path, c.score FROM Rounds r, Cards c WHERE r.id_game = ? AND r.id_card = c.id_card ORDER BY round_number";
    db.all(sql, [id_game], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const rounds = rows.map((row) => {
          const round = new Round(
            row.id_round,
            row.round_number,
            row.guessed,
            row.id_game,
            row.id_card
          );
          
          // Crea e aggiungi la carta completa al round
          const card = new Card(row.id_card, row.caption, row.image_path);
          card.setScore(row.score);
          round.setCard(card); // Assumendo che il modello Round abbia questo metodo
          
          return round;
        });
        resolve(rounds);
      }
    });
  });
};

//prende tutte le partite di un utente (solo partite complete con almeno 3 round vinti o 3 round persi)
export const getGamesByUser = (id_user) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT g.*,
        COUNT(CASE WHEN r.round_number = 0 THEN 1 END) as initial_cards,
        COUNT(CASE WHEN r.round_number > 0 AND r.guessed = 1 THEN 1 END) as correct_guesses,
        COUNT(CASE WHEN r.round_number > 0 AND r.guessed = 2 THEN 1 END) as wrong_guesses,
        COUNT(CASE WHEN r.round_number > 0 THEN 1 END) as total_rounds_played
      FROM Games g 
      LEFT JOIN Rounds r ON g.id_game = r.id_game
      WHERE g.id_user = ?
      GROUP BY g.id_game
      HAVING correct_guesses >= 3 OR wrong_guesses >= 3
      ORDER BY g.date DESC
    `;

    db.all(sql, [id_user], async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        try {
          const games = rows.map(
            (row) => {
              const game = new Game(
                row.id_game,
                row.date,
                row.status,
                row.id_user
              );
              // Aggiungi le statistiche del gioco
              game.initialCards = row.initial_cards;
              game.correctGuesses = row.correct_guesses;
              game.wrongGuesses = row.wrong_guesses;
              return game;
            }
          );

          // Carica i round per ogni gioco
          for (const game of games) {
            const rounds = await getRoundsByGame(game.id_game);
            game.addRound(rounds);
            game.setCollectedCards();
          }
          resolve(games);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

//_______________________________CARTE_DAO______________________________________

//prendo tre carte iniziali in maniera casuale
export const getInitialCards = (id_game) => {
  return new Promise((resolve, reject) => {
    // Modifico la query per garantire unicità usando DISTINCT e un approccio più robusto
    const sql = `SELECT DISTINCT id_card, caption, image_path, score FROM Cards ORDER BY RANDOM() LIMIT 3`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length < 3) {
        // Se non ci sono abbastanza carte uniche nel database
        reject(new Error("Non ci sono abbastanza carte nel database per iniziare il gioco"));
      } else {
        rows.sort((a, b) => a.score - b.score);
        const cards = rows.map((row) => {
          const card = new Card(row.id_card, row.caption, row.image_path);
          card.setScore(row.score);
          
          // Inizializza o aggiorna la lista delle carte prese per questo gioco
          if (!gameCardsTaken.has(id_game)) {
            gameCardsTaken.set(id_game, []);
          }
          gameCardsTaken.get(id_game).push(row.id_card);

          return card;
        });

        resolve(cards);
      }
    });
  });
};

// prende una carta casuale
export const getRandomCard = (id_game) => {
  return new Promise((resolve, reject) => {
    const cardsTaken = gameCardsTaken.get(id_game) || [];
    const excludedPlaceholders = cardsTaken.length > 0 ? ` WHERE id_card NOT IN (${cardsTaken.map(() => "?").join(",")})`: "";
    const sql = `SELECT id_card, caption, image_path FROM Cards ${excludedPlaceholders} ORDER BY RANDOM() LIMIT 1`;
    
    db.get(sql, cardsTaken, (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(null); // Nessuna carta disponibile
      } else {
        const card = new Card(row.id_card, row.caption, row.image_path);

        if (!gameCardsTaken.has(id_game)) {
          gameCardsTaken.set(id_game, []);
        }
        gameCardsTaken.get(id_game).push(row.id_card);

        resolve(card);
      }
    });
  });
};

// prende il punteggio di una carta dal suo id
export const getCardScore = (id_card) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT score FROM Cards WHERE id_card = ?";
    db.get(sql, [id_card], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const score  = row.score;
        resolve(score);
      }
    });
  });
};

//_______________________________GAME_DAO______________________________________


export const createGame = (id_user) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Games (id_user, date, status) VALUES (?, ?, ?)";
    const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
    db.run(sql, [id_user, date, GAME_STATUS_LOST], function(err) {
      if (err) {
        reject(err);
      } else {
        const id_game = this.lastID; // Ottieni l'ID della nuova partita
        resolve(id_game); // Restituisce l'ID della nuova partita
      }
    });
  });
}

export const updateGameStatus = (id_game) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Games SET status = ? WHERE id_game = ?";
    db.run(sql, [GAME_STATUS_WON, id_game], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(true); // Restituisce true se la partita è stata aggiornata
      }
    });
  });
}

//____________________________ROUNDS_DAO______________________________________
export const createRound = (id_game, round_number, id_card, guessed) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Rounds (id_game, round_number, id_card, guessed) VALUES (?, ?, ?, ?)";
    db.run(sql, [id_game, round_number, id_card, guessed], function(err) {
      if (err) {
        reject(err);
      } else {
        const id_round = this.lastID; // Ottieni l'ID della nuova round
        resolve(id_round); // Restituisce l'ID della nuova round
      }
    });
  });
}

export const createInitialRounds = async (id_game, initialCards) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Rounds (id_game, round_number, id_card, guessed) VALUES (?, ?, ?, ?)";
    
    let completedInserts = 0;
    const totalInserts = initialCards.length;
    const insertedIds = [];
    
    if (totalInserts === 0) {
      resolve(insertedIds);
      return;
    }
    
    initialCards.forEach((card, index) => {
      db.run(sql, [id_game, 0, card.id_card, 1], function(err) { 
        if (err) {
          reject(err);
        } else {
          insertedIds.push(this.lastID);
          completedInserts++;
          
          // Risolvi solo quando tutti gli inserimenti sono completati
          if (completedInserts === totalInserts) {
            resolve(insertedIds);
          }
        }
      });
    });
  });
}


const dao = {
  getUser,
  getGamesByUser,
  getInitialCards,
  getRandomCard,
  getCardScore,
  createGame,
  updateGameStatus,
  createRound,
  getRoundsByGame,
  createInitialRounds
};

export default dao;

