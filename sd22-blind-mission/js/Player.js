function Player() {
  
  this.x = width/2;
  this.y = height/2;
  
  // La sensibilité sera calibrée en fonction du joystick
  this.sensibility = 25;
  
  this.increaseScore = function() {
    score = score + 1;
  }
  
  this.moveLeft = function() {
    this.x -= this.sensibility;
  }

  this.moveRight = function() {
    this.x += this.sensibility;
  }

  this.moveUp = function() {
    this.y -= this.sensibility;
  }

  this.moveDown = function() {
    this.y += this.sensibility;
  }
  
  this.fire = function() {
    // On teste la collision avec chaque astéroïde
    for (let i = asteroids.length - 1; i >= 0; i--) {
      let asteroid = asteroids[i];
      
      // Taille réelle de l'astéroïde au moment du tir
      let asteroidCurrentSize = asteroid.z / 100 * asteroidSize;
      
      // Distance entre le centre de l'astéroïde et le centre de la cible
      let distanceAsteroidPlayer = dist(asteroid.x, asteroid.y, player.x, player.y);
      
      // Si le viseur tire sur l'astéroïde
      if (distanceAsteroidPlayer <= asteroidCurrentSize / 2 + hitzoneTolerance) {
        this.increaseScore();
        asteroid.explode();
      }
    }
  }
  
  this.collideWithAsteroid = function() {
    collisions = collisions + 1;
      if (collisions > 0){
        image(glitch,960, 540,1920,1080); //permet de faire un glitch sur l'écran 
      }
  }
  
  this.draw = function () {
    push();
    translate(this.x, this.y);
    image(imgPlayer, 0, 0, asteroidSize, asteroidSize);
    pop();
  };
}