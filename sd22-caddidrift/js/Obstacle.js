class Obstacle {
  constructor(type, way) {
    if (way != null) {
      this.way = way; // 1, 2, 3
    } else {
      this.way = int(random(3)); // 1, 2, 3
    }

    if (type != null) {
      this.type = type;
    } else {
      this.type = obstaclesList[int(random(obstaclesList.length))];
    }

    this.x = WAYS_X[this.way];
    this.speed = GAME_SPEED;
    this.active = true;
    this.visible = true;
    this.data = obstaclesData[this.type];
    this.y = - spritesData[this.type].size[1];

    this.sprite = new Sprite(this.type);
  }

  update() {
    this.y += this.speed;

    if (this.isActive()) {

      // outside
      if (this.y > height + spritesData[this.type].size[1]) {
        this.visible = false;
      }

      if (this.way == player.way
        && this.y + this.data.hitzoneY < height - PLAYER_BACK_TOLERANCE) { // this condition is certainly not working as expected
        if (this.y + this.data.hitzoneY + this.data.hitzoneHeight >= player.y + player.hitZoneY) {
          this.hit();
          player.hit();
        }
      }
    }
  }

  hit() {
    this.active = false;
    this.sprite.playOnce();
  }

  show() {
    push();
    translate(this.x, this.y);
    imageMode(CORNER);

    this.sprite.show(-(this.sprite.w - WAY_WIDTH) / 2, 0);

    if (DEBUG) {
      if (this.isActive()) {
        fill(0, 255, 0, 100);
      } else {
        fill(255, 0, 0, 100);
      }
      rect(0, this.data.hitzoneY, WAY_WIDTH, this.data.hitzoneHeight);
    }
    pop();
  }

  isActive() {
    return this.active;
  }

  isVisible() {
    return this.visible;
  }
}