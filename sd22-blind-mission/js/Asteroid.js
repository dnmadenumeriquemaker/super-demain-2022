// Fonction pour générer un astéroïde

function Asteroid(x, y) {
  this.alive = true;

  // Position de l'astéroïde dans l'écran
  this.x = random(200, 1400);
  this.y = random(200, 900);

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
  this.speed = 0.1;
  if (score >= 1) {
    this.speed = 0.1;
    if (score >= 20) this.speed = 0.5; //test de la fonction
    if (score >= 35) this.speed = 1; //test de la fonction
  }

  this.update = function () {
    this.z += this.speed;
    this.angle += this.rotationSpeed;

    // L'astéroïde est trop prêt et heurte le vaisseau
    if (this.z >= 100) {
      this.collideWithPlayer();
    }
  };

  this.draw = function () {
    push();
    translate(this.x, this.y);
    scale(this.z / 100);

    rotate(radians(this.angle));
    if (this.z <= 80) {
      image(imgAsteroid, 0, 0);
    }
else {
  image(imgAsteroidRed, 0, 0); {
  }
}
    pop();
  };

  this.collideWithPlayer = function () {
    player.collideWithAsteroid();
    this.explode();
  };

  this.explode = function () {    
    this.alive = false;
  };

  this.isDead = function () {
    return !this.alive;
  };
}
