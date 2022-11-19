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
  
  this.hitzoneDiam = 50;

  // Chaque joueur a sa propre vitesse :
  // this.speed : valeur qui gère la vitesse
  // this.vel : vecteur qui déplace le joueur

  this.speed = 0;
  this.vel = createVector(0, 0);
  
  
  // On récupère les limites de déplacement
  // du joueur selon sa zone
  
  this.zoneLeft = zones[this.zoneId].left;
  this.zoneRight = zones[this.zoneId].right;
    
  this.speed1 = 0; 
  this.speed2 = playerMaxSpeed / 3 * 1; 
  this.speed3 = playerMaxSpeed / 2 * 2; 
  this.speed4 = playerMaxSpeed; 

  
  // Joueur à gauche de l'écran
  
  if (this.zoneId == 'A') {
    this.pos = createVector(150, height / 2);
    this.heading = 0;
    this.a = 0;
    this.img = loadImage("assets/axonautepink.png");
    this.headingMin = -PI;
    this.headingMax = PI;
    
    this.distSpeed1 = 8; // en dessous de 2 cm
    this.distSpeed2 = 10; // entre 2 et 4 cm
    this.distSpeed3 = 16; // entre 4 et 6 cm
    this.distSpeed4 = 24; // entre 6 et 8 cm
  }

  // Joueur à droite de l'écran
  
  else {
    this.pos = createVector(width - 150, height / 2);
    this.heading = radians(180); // il regarde à gauche
    this.a = radians(180);
    this.img = loadImage("assets/axonauteblue.png");
    this.headingMin = 0;
    this.headingMax = TWO_PI;
    
    this.distSpeed1 = 8; // en dessous de 2 cm
    this.distSpeed2 = 10; // entre 2 et 4 cm
    this.distSpeed3 = 16; // entre 4 et 6 cm
    this.distSpeed4 = 24; // entre 6 et 8 cm
  }

  this.update = function () {
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
    if (this.pos.x < this.zoneLeft) {
      this.pos.x = this.zoneRight;
    }

    // Si le joueur est trop à droite de sa zone
    if (this.pos.x > this.zoneRight) {
      this.pos.x = this.zoneLeft;
    }

    // Si le joueur est trop en haut de sa zone
    if (this.pos.y < 0) {
      this.pos.y = height;
    }

    // Si le joueur est trop en bas de sa zone
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
  };

  // On affiche notre joueur
  // grâce à toutes ses coordonnées

  this.draw = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    image(this.img, -45, 0, 120, 50); // taille de l'image
    
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
  
  this.hasCaptured = function() {
    this.score++;
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
    } else if (s > this.distSpeed3) {
        this.speed = this.speed4;
    }
    if (this.zoneId == 'A') {
    //console.log('dist', s);
    //console.log('speed', this.speed);
    }
  };
}
