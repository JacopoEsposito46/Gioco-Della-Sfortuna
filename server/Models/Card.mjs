
function Card (id, caption, image_path) {
  this.id_card = id;
  this.caption = caption;
  this.image_path = image_path;


  this.setScore = (score) => {
    this.score = score;
  }
}

export default Card;