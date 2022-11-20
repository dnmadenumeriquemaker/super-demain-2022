// Fonction pour générer un item

function Item(type, zoneId, x, y) {
  this.type = type;
  this.zoneId = zoneId;
  this.alive = true;

  this.hitzoneDiam = 50;

  if (this.zoneId == 'A') {
    this.speed = random(0.03, 0.2);
    this.vel = createVector(0, 0);
    this.img = loadImage("assets/pilepink.png");
    this.pos = createVector(x, y);
    this.heading = random(180);
    this.headingDirection = random(1) < 0.5
      ? random(-0.0005, 0)
      : random(0, 0.0005);
  }

  else {
    this.speed = random(0.03, 0.2);
    this.vel = createVector(0, 0);
    this.img = loadImage("assets/pileblue.png");
    this.pos = createVector(x, y);
    this.heading = random(180);
    this.headingDirection = random(1) < 0.5
      ? random(-0.0005, 0)
      : random(0, 0.0005);
  }

  this.zoneLeft = zones[this.zoneId].left;
  this.zoneRight = zones[this.zoneId].right;

  this.update = function () {
    this.heading += this.headingDirection;

    this.pos.add(p5.Vector.fromAngle(this.heading, this.speed));

    // Si l'item est trop à gauche de sa zone
    if (this.pos.x + this.hitzoneDiam/2 < this.zoneLeft) {
      this.pos.x = this.zoneRight + this.hitzoneDiam/2;
    }

    // Si l'item est trop à droite de sa zone
    if (this.pos.x - this.hitzoneDiam/2 > this.zoneRight) {
      this.pos.x = this.zoneLeft - this.hitzoneDiam/2;
    }

    // Si l'item est trop en haut de sa zone
    if (this.pos.y + this.hitzoneDiam/2 < 0) {
      this.pos.y = height + this.hitzoneDiam/2;
    }

    // Si l'item est trop en bas de sa zone
    if (this.pos.y - this.hitzoneDiam/2 > height) {
      this.pos.y = - this.hitzoneDiam/2;
    }

  };

  // On affiche notre item
  // grâce à toutes ses coordonnées

  this.draw = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    image(this.img, 0, 0, 20, 50); // taille de l'image

    if (DEBUG) {
      noFill();
      strokeWeight(4);
      if (this.isCaptured()) {
        stroke(0, 255, 255);
      } else {
        stroke(255, 255, 0);
      }
      ellipse(0, 0, this.hitzoneDiam, this.hitzoneDiam);
    }

    pop();
  };

  this.checkCollision = function () {
    let player = playerRed;
    if (this.zoneId == 'B') {
      player = playerBlue;
    }

    if (p5.Vector.dist(player.pos, this.pos)
      <= (player.hitzoneDiam + this.hitzoneDiam) / 2) {
      this.capture(player);
    }
  }

  this.capture = function (player) {
    this.alive = false;
    player.hasCaptured();
  }


  this.isCaptured = function () {
    return !this.alive;
  };
}
