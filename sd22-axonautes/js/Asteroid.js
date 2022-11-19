let x = 0;
let directionasteroidx = 4;
let y = 100;
let directionasteroidy = 2;

function showAsteroids() {
  image(asteroids, x, y);
  x += directionasteroidx;
  y += directionasteroidy;

  if ((directionasteroidx >= 0 && x >= width)
     || (directionasteroidx < 0 && x < 0)) {
    directionasteroidx = random(2, 4);
    if (random(1) > 0.5) {
      directionasteroidx = -directionasteroidx;
    }
    if (directionasteroidx > 0) {
      x = random(-500, -100);
    } else {
      x = random(width + 200, height + 100);
    }
    y = random(-100, height + 100);
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
