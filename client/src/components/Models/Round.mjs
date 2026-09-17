function Round(id_round, round_number, guessed, id_game, id_card) {
  this.id_round = id_round;
  this.round_number = round_number;
  this.guessed = guessed;
  this.id_game = id_game;
  this.id_card = id_card;

  this.setCard= (card) =>{
    this.card = card;
  }
}

export default Round;