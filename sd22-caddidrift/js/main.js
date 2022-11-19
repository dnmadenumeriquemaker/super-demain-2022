let banière;
function preload() {
  // load images data
  imagesList.forEach(function(imageName) {
    images[imageName] = loadImage('assets/' + imageName + '.png');//raccourcie pour appeler toute les image qui sont dans le groupe assets ??!
  });

  // load spritesheets
  for (const [spriteName, data] of Object.entries(spritesData)) {
    spritesheets[spriteName] = loadImage('assets/sprite-' + spriteName + '.png');
  }

  images['caddie'] = loadImage('assets/caddie.png');
  images['mini-caddie'] = loadImage('assets/mini-caddie.png');
  banière = loadImage("assets/Caddidrift_logo.png");
}





function setup() {
  createCanvas(1280, 720);
  noStroke();
  textAlign(CENTER);

  // load sprites
  for (const [spriteName, data] of Object.entries(spritesData)) {
    let spritesheet = spritesheets[spriteName];
    let animation = [];

    for (let i = 0; i < data.frames; i++) {
      let x = data.size[0] * i;
      let img = spritesheet.get(x, 0, data.size[0], data.size[1]);
      animation.push(img);
    }

    animations[spriteName] = animation;
  }

  player = new Player();
  game = new Game();
  game.init();

  // debug
  game.forceStep(PLAYING);
}





function draw() {
  background(0);

  game.updateBackground();
  game.showBackground();

  if (game.is(WAITING)
    || game.is(ONBOARDING_1)
    || game.is(ONBOARDING_2)
    || game.is(ONBOARDING_3)
    || game.is(ONBOARDING_4)
    || game.is(ONBOARDING_5)) {


    push();
    translate(280, 0);

    player.update();
    player.show();

    pop();

    if (game.is(WAITING)) {
      fill(255);
      text('On attend un joueur !', width / 2, height / 2);
      text('Penchez le caddie à gauche pour commencer', width / 2, height / 2 + 100);
    }

    if (game.is(ONBOARDING_1)) {
      fill(255);
      text('Maintenant, penchez le caddie à droite', width / 2, height / 2);
    }

    if (game.is(ONBOARDING_2)) {
      fill(255);
      text('Maintenant, redressez le caddie', width / 2, height / 2);
    }

    if (game.is(ONBOARDING_4)) {
      fill(255);
      text('Fuyez avec le caddie plein en évitant tous les obstacles !', width / 2, height / 2);
      image(barière, 0, 0);
      //mettre le logo
    }
  }

  if (game.is(PLAYING) 
   || game.is(PLAYING_END)) {

    game.update();
    game.show();

    push();
    translate(280, 0);

    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obstacle = obstacles[i];

      if (!obstacle.isVisible()) {
        obstacles.splice(i, 1);
        continue;
      }
      obstacle.update();
      obstacle.show();
    }

    player.update();
    player.show();

    pop();

    game.showHUD();

  }

  if (game.is(ENDING)) {
   //if(frameCount >= 500){
    fill('#000000');
    rect(0,0,width, height);
    fill('#ffffff');
    textAlign(CENTER);
    text('Votre amende est de ' + game.amende() + ' €', width / 2, height / 2);
    if (frameCount >= 500){
      game.is(WAITING);
    }
    
  }
}

function keyPressed() {

  if (game.is(WAITING)
    || game.is(ONBOARDING_1)
    || game.is(ONBOARDING_2)
    || game.is(ONBOARDING_4)
    || game.is(PLAYING)
    || game.is(PLAYING_END)) {

    if (key == 'q') {
      player.wayLeft();

      if (game.is(WAITING)) {
        game.setStep(ONBOARDING_1);
      }
    }

    else if (key == 'd') {
      player.wayRight();

      if (game.is(ONBOARDING_1) && player.way == 2) {
        game.setStep(ONBOARDING_2);
      }
    }
  }

  if (key == ' ') {
    DEBUG = !DEBUG;
  }

  if (key == 'w') {
    game.forceStep(WAITING);
  }

  if (key == 'c') {
    game.forceStep(ONBOARDING_3);
  }

  if (key == 'a') {
    game.forceStep(ONBOARDING_4);
  }

  if (key == 's') {
    game.forceStep(ONBOARDING_5);
  }

  if (key == 'p') {
    game.forceStep(PLAYING);
  }

  
  if (key == 'e') {
    game.forceStep(PLAYING_END);
  }
}

function keyReleased() {
  player.wayMiddle();

  if (game.is(ONBOARDING_2)) {
    // will wait for background
    game.setNextStep(ONBOARDING_3);
  }
}