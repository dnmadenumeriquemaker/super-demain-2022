// Effet de décélération du joueur
// lorsqu'il flotte dans l'espace
// - 0.99 : meilleure valeur
// - 0.95 : le joueur s'arrêtera plus vite,
//          il y a moins de "drift",
//          et il faut augmenter le max speed à 0.8

let playerInertia = 0.99;
let playerMaxSpeed = 0.1;
let playerHeadingEasing = 0.05;

function Player(zoneId, x, y, heading) {
  this.zoneId = zoneId;
  this.score = 0;
  this.ableToCapture = true;

  this.opacity = 255;

  this.hitzoneDiam = 50;
  this.offsetHitzoneDiam = 200;

  // Chaque joueur a sa propre vitesse :
  // this.speed : valeur qui gère la vitesse
  // this.vel : vecteur qui déplace le joueur

  this.speed = 0;
  this.vel = createVector(0, 0);


  // On récupère les limites de déplacement
  // du joueur selon sa zone

  this.zoneLeft = zones[this.zoneId].left;
  this.zoneRight = zones[this.zoneId].right;

  // On définit les 4 paliers de vitesse
  this.speed1 = 0;
  this.speed2 = playerMaxSpeed / 3 * 1;
  this.speed3 = playerMaxSpeed / 2 * 2;
  this.speed4 = playerMaxSpeed;

  this.dropZonePos = null;


  // Joueur à gauche de l'écran

  if (this.zoneId == 'A') {
    this.pos = createVector(150, height / 2);
    this.a = 512;
    this.img = loadImage("assets/axonautepink.png");
    this.headingMin = -PI;
    this.headingMax = PI;
    this.heading = map(this.a, 0, 1023, this.headingMin, this.headingMax);
    this.c = color('#F21C74');

    this.distSpeed1 = 6; // en dessous de 2 cm
    this.distSpeed2 = 12; // entre 2 et 4 cm
    this.distSpeed3 = 16; // entre 4 et 6 cm
    this.distSpeed4 = 22; // entre 6 et 8 cm
  }

  // Joueur à droite de l'écran

  else {
    this.pos = createVector(width - 150, height / 2);
    this.a = 512;
    this.img = loadImage("assets/axonauteblue.png");
    this.headingMin = 0;
    this.headingMax = TWO_PI;
    this.heading = map(this.a, 0, 1023, this.headingMin, this.headingMax);
    this.c = color('#47BEBB');

    this.distSpeed1 = 6; // en dessous de 2 cm
    this.distSpeed2 = 12; // entre 2 et 4 cm
    this.distSpeed3 = 16; // entre 4 et 6 cm
    this.distSpeed4 = 22; // entre 6 et 8 cm
  }

  this.update = function () {
    this.opacity += 10;
    this.opacity = min(this.opacity, 255);
    // Pour actualiser la position du joueur,
    // on va faire 3 étapes :

    // 1)
    // On va appliquer une force (la vitesse)
    // pour déplacer plus ou moins
    // le joueur dans sa direction
    // (c'est comme si quelqu'un nous pousse dans le dos
    //  plus ou moins fort)

    // - si la vitesse this.speed est nulle (0),
    //   alors le joueur n'accélère pas

    // - si la vitesse this.speed est supérieure à 0,
    //   alors le joueur accélère

    var force = p5.Vector.fromAngle(this.heading);
    force.mult(this.speed);
    this.vel.add(force);

    // 2)
    // On déplace les coordonnées du joueur
    // en le déplaçant sur X et Y
    // en fonction de la vitesse

    this.pos.add(this.vel);

    // 3)
    // On réduit de plus en plus
    // le potentiel mouvement inertique
    // que le joueur a
    // (c'est ce qui donne l'effet "flotter dans le vide"
    //  donc l'effet de décélération)

    this.vel.mult(playerInertia);

    // Puis on vérifie la position du joueur
    // dans sa zone de jeu

    // Si le joueur est trop à gauche de sa zone
    if (this.pos.x + this.offsetHitzoneDiam / 2 < this.zoneLeft) {
      this.pos.x = this.zoneRight + this.offsetHitzoneDiam / 2;
    }

    // Si le joueur est trop à droite de sa zone
    if (this.pos.x - this.offsetHitzoneDiam / 2 > this.zoneRight) {
      this.pos.x = this.zoneLeft - this.offsetHitzoneDiam / 2;
    }

    // Si le joueur est trop en haut de sa zone
    if (this.pos.y + this.offsetHitzoneDiam / 2 < 0) {
      this.pos.y = height + this.offsetHitzoneDiam / 2;
    }

    // Si le joueur est trop en bas de sa zone
    if (this.pos.y - this.offsetHitzoneDiam / 2 > height) {
      this.pos.y = - this.offsetHitzoneDiam / 2;
    }

  };

  // On affiche notre joueur
  // grâce à toutes ses coordonnées

  this.draw = function () {
    push();
    translate(this.pos.x, this.pos.y);

    let shake = map(this.opacity, 0, 255, radians(15), 0);

    rotate(this.heading + random(-shake, shake));

    if (this.opacity < 255) {
      tint(255, this.opacity);
      scale(map(this.opacity, 0, 255, .8, 1));
    }

    image(this.img, -45, 0, 120, 50); // taille de l'image

    // a une batterie sur lui
    if (this.ableToCapture == false) {
      push();

      // let ringSize = 40 + cos(frameCount / 10) * 5;
      // noFill();
      // strokeWeight(2);
      // stroke(255);
      // ellipse(50, 0, ringSize, ringSize);

      let batterySize = map(cos(frameCount / 10), -1, 1, 1, 1.2);

      rotate(radians(180));
      image(this.capturedItem.img, -35, 0, 20 * batterySize, 50 * batterySize);
      pop();
    }

    if (DEBUG) {
      noFill();
      strokeWeight(0);
      if (this.zoneId == 'A') {
        stroke(255, 0, 0);
      } else {
        stroke(0, 0, 255);
      }

      ellipse(0, 0, this.hitzoneDiam, this.hitzoneDiam);
    }

    pop();
  };

  this.drawIndicator = function () {
    let img = indicatorblue;

    if (this.zoneId == 'A') {
      img = indicatorred;
    }

    let indicatorPos = null;
    let indicatorAngle = 0;
    let indicatorScale = 1;

    if (this.zoneId == 'B' && this.pos.x > width - 80) {
      indicatorPos = createVector(min(this.pos.x - 50, width - 40), constrain(this.pos.y, 40, height - 40));
      indicatorAngle = map(this.pos.y, 0, height, 90 - 20, 90 + 20);
      indicatorScale = constrain(map(this.pos.x, width - 80, width - 50, 0, 1), 0, 1);
    }

    else if (this.zoneId == 'A' && this.pos.x < 80) {
      indicatorPos = createVector(max(this.pos.x + 50, 40), constrain(this.pos.y, 40, height - 40));
      indicatorAngle = map(this.pos.y, 0, height, -90 + 20, -90 - 20);
      indicatorScale = constrain(map(this.pos.x, 80, 50, 0, 1), 0, 1);
    }

    else if (this.pos.y > height - 80) {
      indicatorPos = createVector(this.pos.x, min(this.pos.y - 50, height - 40));
      indicatorAngle = 180;
      indicatorScale = constrain(map(this.pos.y, height - 80, height - 50, 0, 1), 0, 1);
    }

    else if (this.pos.y < 80) {
      indicatorPos = createVector(this.pos.x, max(this.pos.y + 50, 40));
      indicatorAngle = 0;
      indicatorScale = constrain(map(this.pos.y, 80, 50, 0, 1), 0, 1);
    }

    if (indicatorPos) {
      push();
      translate(indicatorPos.x, indicatorPos.y);
      rotate(radians(indicatorAngle));
      image(img, 0, 0, 40 * indicatorScale, 40 * indicatorScale);
      pop();
    }
  }


  this.drawDropZone = function () {
    // a une batterie sur lui
    if (this.ableToCapture == false) {
      push();

      translate(this.dropZonePos.x, this.dropZonePos.y);
      rotate(radians(frameCount));

      let dropSize = dropZoneDiam + cos(frameCount / 10) * 10;

      if (this.zoneId == 'A') {
        image(dropzonered, 0, 0, dropSize, dropSize);
      } else {
        image(dropzoneblue, 0, 0, dropSize, dropSize);
      }

      pop();
    }
  };

  this.checkDrop = function () {
    // S'il a une batterie sur lui
    if (this.canCapture() == false) {
      if (p5.Vector.dist(this.pos, this.dropZonePos)
        <= (this.hitzoneDiam + dropZoneDiam) / 2) {
        this.capturedItem.drop();
        this.hasDropped();
      }
    }
  }

  this.checkAsteroid = function () {

    if (p5.Vector.dist(this.pos, asteroidPos)
      <= (this.hitzoneDiam + asteroidsize) / 2) {
      this.opacity = 50;

      if (this.canCapture() == false) {
        this.releaseItem();
      }

    }
  }

  this.hasCaptured = function (item) {
    this.ableToCapture = false;
    this.capturedItem = item;

    // generate new drop zone

    this.dropZonePos = dropZones[this.zoneId][int(random(dropZones[this.zoneId].length))];
  }

  this.releaseItem = function () {
    this.ableToCapture = true;
    //this.capturedItem.alive = false; // remplacer par new x, y
    this.capturedItem.resetPosition();
    this.capturedItem = null;
  }

  this.hasDropped = function () {
    this.score++;
    this.ableToCapture = true;
  }

  this.canCapture = function () {
    return this.ableToCapture;
  }

  // Fonctions qui gèrent les changements de valeur

  this.easeHeading = function (a) {
    this.a += (a - this.a) * playerHeadingEasing;
    this.heading = map(this.a, 0, 1023, this.headingMin, this.headingMax);
  };

  this.setHeading = function (a) {
    this.a = a;
    this.heading = map(this.a, 0, 1023, this.headingMin, this.headingMax);
  };

  this.setSpeed = function (s) {
    if (s <= this.distSpeed1) {
      this.speed = this.speed1;
    } else if (s > this.distSpeed1 && s <= this.distSpeed2) {
      this.speed = this.speed2;
    } else if (s > this.distSpeed2 && s <= this.distSpeed3) {
      this.speed = this.speed3;
    } else if (s > this.distSpeed3 && s <= this.distSpeed4) {
      this.speed = this.speed4;
    } else {
      // supérieur à this.distSpeed4, donc pas de main détectée
      this.speed = 0;
    }
  };

  this.isHere = function (s) {
    return s < this.distSpeed4;
  }
}
