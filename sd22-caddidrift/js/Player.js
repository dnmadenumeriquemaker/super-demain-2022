class Player {
  constructor() {
    this.way = 1;
    this.y = height - 260 - 20;
    this.hitZoneY = 70;//le y des collision
    this.hitCount = 0;
    this.x = WAYS_X[this.way];

    this.sprite = new Sprite('caddie');
    this.sprite.loop();

    this.spriteMinusOne = new Sprite('minus-one');
  }

  update() {
    this.x += (WAYS_X[this.way] - this.x) * 0.3;
  }

  show() {
    push();
    fill(0);
    imageMode(CORNER);
    translate(this.x, this.y);

    if (this.spriteMinusOne.isPlaying()) {
      tint(255, 0, 0, 150);
    }

    this.sprite.show(-(this.sprite.w - WAY_WIDTH) / 2, 0);
    noTint();

    if (this.spriteMinusOne.isPlaying()) {
      this.spriteMinusOne.show(-(this.spriteMinusOne.w - WAY_WIDTH) / 2, -100);
    }

    if (DEBUG) {
      fill(255, 0, 0);
      rect(0, this.hitZoneY, WAY_WIDTH, 10);
    }
    pop();
  }

  wayLeft() {
    this.way = 0;
  }

  wayMiddle() {
    this.way = 1;
  }

  wayRight() {
    this.way = 2;
  }

  hit() {
    this.hitCount++;
    this.spriteMinusOne.playOnce();
  }
}