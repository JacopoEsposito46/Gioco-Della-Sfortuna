import dayjs from 'dayjs';

function Game(id_game, date, status, id_user) {
  this.id_game = id_game;
  this.date = dayjs(date);
  this.status = status; // 0: in corso, 1: vinto, 2: perso
  this.id_user = id_user;
  this.rounds = [];

  // Metodo per aggiungere un round
  this.addRound = (round) => {
    if (Array.isArray(round)) {
      this.rounds.push(...round);
    } else {
      this.rounds.push(round);
    }
  }

  this.setCollectedCards = () => {
    this.collectedCard = this.rounds.filter(round => round.guessed === 1).length;
  }

}

export default Game;