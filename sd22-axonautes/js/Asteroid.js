let x = -100;
let directionasteroidx = 4;

let y = 100;
let directionasteroidy = 2;

let asteroidrotation = 10;

let asteroidsize = 100;

function showAsteroids() {
  asteroidrotation += .2;

  push();
  translate(x, y);
  rotate(radians(asteroidrotation));
  image(asteroids, 0, 0);

  // if (DEBUG) {
  //   fill(255, 0, 0);
  //   ellipse(0, 0, asteroidsize, asteroidsize);
  // }

  pop();


  if (frameCountSinceStep < 250) return;

  x += directionasteroidx;
  y += directionasteroidy;

  // si l'astéroide est hors champ à gauche ou à droite (selon son sens)
  if ((directionasteroidx >= 0 && x >= width + asteroidsize)
    || (directionasteroidx < 0 && x < -asteroidsize)
    || (directionasteroidy >= 0 && y > height + asteroidsize)
    || (directionasteroidy < 0 && y < -asteroidsize)
  ) {


    // on calcule une nouvelle direction/vitesse
    directionasteroidx = random(2, 4);

    // une fois sur 2, on change le sens de l'astéroide
    if (random(1) > 0.5) {
      directionasteroidx = -directionasteroidx;
    }

    // si l'astéroide va aller de gauche à droite
    if (directionasteroidx > 0) {
      x = random(-500, -100);
    }
    // si l'astéroide va aller de droite à gauche
    else {
      x = random(width + 100, height + 500);
    }

    // on calcule une position y et une direction y aléatoires pour varier
    y = random(-asteroidsize, height + asteroidsize);
    directionasteroidy = random(-2, 2);
  }
}

/* let freeze = 0

this.checkCollision = function() {
    let player = playerRedtouche;
    if(this.zoneId=='B'){
      player = playerBluetouche;
    }
      if (p5.Vector.dist(player.pos, this.pos) 
          <= (player.hitzoneDiam + this.hitzoneDiam) / 2) {
          timerFreeze++;
           if (timerFreeze > 120) {
        (1);
      }
    } else {
      waitTimer = 0;
    }
       }
  };
  
 if (playerRedtouche == true
      or playerBluetouche == true){
    freeze++;
    if(freeze>120){
      freeze=0;*/
