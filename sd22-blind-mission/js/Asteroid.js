// Fonction pour générer un astéroïde


function Asteroid() {
  this.alive = true;
  this.fired = false;
  this.focus = false;

  this.spriteExplosion = new Sprite('explosion');

  // Position de l'astéroïde dans l'écran
  this.x = 874 + random(-400, 400);
  this.y = 530 + random(-150, 150);

  this.xOffset = random(-0.5, 0.5);

  this.targetX = random(200, 1400);
  this.targetY = random(200, 900);

  this.shake = 0;

  this.firePosition = [];

  // Angle de rotation
  this.angle = random(120);
  this.rotationSpeed = random(-1, 1);

  // Pour simuler l'astéroïde qui se rapproche,
  // on lui donne une "position pourcentage" en z (profondeur)
  // qui va en fait être l'échelle de l'astéroïde :
  // Si z = 0, alors il est très loin
  // Si z = 50, alors il est à mi-chemin
  // Si z = 100, alors collision avec le vaisseau
  this.z = 0;

  // Vitesse de déplacement dans l'espace
  // Si speed = .1, il se déplace lentement
  // Si speed = .5, il se déplace vite
  // Si speed = 1, hyperspeeeeed

  this.speedAcc = 1;
  this.speed = 0.1;

  if (score >= 1) this.speed = 0.1;
  if (score >= 20) this.speed = 0.2; //test de la fonction
  if (score >= 35) this.speed = 0.3; //test de la fonction

  this.update = function () {
    this.shake = constrain(map(this.z, 70, 100, 0, 4), 0, 4);
    this.speedAcc = constrain(map(this.z, 40, 100, 1, 3), 1, 3);

    this.x += (this.targetX - this.x) * 0.001;
    this.y += (this.targetY - this.y) * 0.001;

    /*
    this.x += this.xOffset;
    this.x = constrain(this.x, 200, 1400);
    */

    this.z += this.speed * this.speedAcc;
    this.angle += this.rotationSpeed;


    // L'astéroïde est trop près et heurte le vaisseau
    if (this.z >= 100) {
      this.collideWithPlayer();
    }

    let asteroidCurrentSize = this.z / ASTEROID_SCALE * asteroidSize;

    // Distance entre le centre de l'astéroïde et le centre de la cible
    let distanceAsteroidPlayer = dist(this.x, this.y, player.x, player.y);

    // Si le viseur tire sur l'astéroïde
    if (distanceAsteroidPlayer <= asteroidCurrentSize / 2 + hitzoneTolerance) {
      this.focus = true;
    } else {
      this.focus = false;
    }
  };

  this.draw = function () {

    if (this.alive == true) {
      let offsetX = random(this.shake * 2) - this.shake;
      let offsetY = random(this.shake * 2) - this.shake;

      push();
      translate(this.x + offsetX, this.y + offsetY);
      scale(this.z / ASTEROID_SCALE);

      push();
      rotate(radians(this.angle));

      if (this.z <= 70) {
        image(imgAsteroid, 0, 0);
      }
      else {
        image(imgAsteroidRed, 0, 0);
      }
      pop();

      if (this.focus == true) {
        image(imgFocus, 0, 0);
      }

      pop();
    }

    else {
      // tir du laser
      if (this.fired == true) {
        if (this.spriteExplosion.isPlaying()) {
          push();
          this.spriteExplosion.show(this.firePosition[0], this.firePosition[1] - 30);
          pop();
        }

      } 
      // collision avec le vaisseau
      else {
        push();
        blendMode(SCREEN);
        glitch.play();
        image(glitch, 960, 540, 1920, 1080);
        pop();
      }
    }

  };

  this.collideWithPlayer = function () {
    if (this.alive == true) {
      player.collideWithAsteroid();
      this.explode();
    }
  };

  this.explode = function () {
    this.alive = false;
    glitch.setFrame(0);

    globalShake = 10;
  };

  this.fired = function () {
    this.alive = false;
    this.fired = true;
    this.spriteExplosion.playOnce();

    this.firePosition = [player.x, player.y];

    sonexplosionAsteroide.stop();
    sonexplosionAsteroide.play();

    DELAY_BETWEEN_ASTEROIDS -= 20;
    DELAY_BETWEEN_ASTEROIDS = max(DELAY_BETWEEN_ASTEROIDS, 120);
    
    //createAsteroid();
  };

  this.isDead = function () {
    return !this.alive;
  };

  this.shouldBeRemoved = function () {
    return this.z >= 120;
  };
}
