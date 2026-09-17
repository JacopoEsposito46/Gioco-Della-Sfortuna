
function Card (id_card, caption, image_path) {
  this.id_card = id_card;
  this.caption = caption;
  this.image_path = image_path;


  this.setScore = (score) => {
    this.score = score;
  }
}

export default Card;