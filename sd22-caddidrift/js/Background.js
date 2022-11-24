class Background {
  constructor(imageName, offset) {
    this.image = images[imageName];
    this.y = - this.image.height + offset;
    this.speed = GAME_SPEED;
    this.visible = true;
  }

  update() {
    this.y += this.speed; //lui donne la vitesse

    if (this.y >= height) {
      this.visible = false;
    }
  }

  show() { //affiche l'img
    image(this.image, 0, this.y);
  }

  isReadyForNextBackground() {
    return this.y + this.speed >= 0;
  }

  getOffsetForNextBackground() {
    return this.y;
  }

  isVisible() {
    return this.visible;
  }
}