let banière;
let font;
let giFNeutre;

function preload() {
  // load images data
  imagesList.forEach(function(imageName) {
    images[imageName] = loadImage('assets/' + imageName + '.png');//raccourcie pour appeler toute les image qui sont dans le groupe assets ??!
  });
  gifNeutre = loadImage("gif/position-neutre.gif");
  gifDroite = loadImage("gif/Droite.gif");
  gifGauche = loadImage("gif/Gauche.gif");


  // load spritesheets
  for (const [spriteName, data] of Object.entries(spritesData)) {
    spritesheets[spriteName] = loadImage('assets/sprite-' + spriteName + '.png');
  }

  images['caddie'] = loadImage('assets/caddie.png');
  images['mini-caddie'] = loadImage('assets/mini-caddie.png');

  banière = loadImage("assets/Caddidrift_logo.png");

  font = loadFont('font/nominee.otf');

}





function setup() {
  //createCanvas(1280, 720);
  createCanvas(1280, 1800);
  noStroke();
  textAlign(CENTER);
  textFont(font);
  noCursor();

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
  game.forceStep(WAITING);
}





function draw() {
  var pxgif = 355;
  var pxtext = width / 2;

  var py1text = height / 2 - 200;
  var pygif = height / 2 + 0;
  var py2text = height / 2 + 370;

  //console.log(frameRate());
  background(0);

  game.frameCountOfStep++;

  game.updateBackground();
  game.showBackground();

  if (game.is(WAITING)
    || game.is(ONBOARDING_1)
    || game.is(ONBOARDING_2)
    || game.is(ONBOARDING_3)
    || game.is(ONBOARDING_4)
    || game.is(ONBOARDING_5)) {


    push();
    translate((width - ROAD_WIDTH) / 2, 0);

    player.update();
    player.show();

    pop();
    push();
    fill('#3d008f');

    if (game.is(WAITING)) {

      image(gifGauche, pxgif, pygif, 1200 / 2, 675 / 2);
      //fill(255);
      textSize(64);
      text('Asseyez-vous\ndans le caddie !', pxtext, py1text);
      textSize(50);
      text('Penchez le caddie à gauche\npour commencer', width / 2, py2text);

    }

    if (game.is(ONBOARDING_1)) {
      //fill(255);
      textSize(50);
      image(gifDroite, pxgif, pygif, 1200 / 2, 675 / 2);
      text('Maintenant,\npenchez le caddie à droite', pxtext, py1text);
    }

    if (game.is(ONBOARDING_2)) {
      //fill(255);
      textSize(50);
      image(gifNeutre, pxgif, pygif, 1200 / 2, 675 / 2);
      text('Maintenant,\nredressez le caddie', pxtext, py1text);
    }

    if (game.is(ONBOARDING_4)) {
      //fill(255);
      textSize(50);
      text('Fuyez avec le caddie plein\nen évitant tous les obstacles !', pxtext, py1text);
      //image(barriere, 0, 0); // Kévin pour Corentin : ?
      //mettre le logo
    }
  }
  pop();
  if (game.is(PLAYING)
    || game.is(PLAYING_END)) {

    game.update();
    game.show();

    push();
    translate((width - ROAD_WIDTH) / 2, 0); //changer l'origine

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



    push();
    textSize(64);
    textAlign(CENTER);
    strokeJoin(ROUND);
    strokeWeight(20);
    stroke('#3d008f');
    fill(255);
    text("Amende\n" + game.amende()+" €", width/2, 200);
    pop();

    game.showHUD();

  }

  if (game.is(ENDING)) {

    push();
    fill('#000000');
    rect(0, 0, width, height);

    if (game.frameCountOfStep > 60) {
      fill('#fe95df');
      textAlign(CENTER);
      textSize(120);
      text('Under arrest', width / 2-100 + 150, 500);
    }

    if (game.frameCountOfStep > 120) {
      image(banière, 350, 10);
      fill('#fe95df');
      textAlign(CENTER);
      textSize(40);
      text('Votre amende est de ' + game.amende() + ' €', width / 2-170, 600);
    }

    if (game.frameCountOfStep > 1500) { //après un certain temps
      game.setStep(WAITING); //c'est pour relancer le jeu à la fin 
    }
    pop();
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
    // TODO: disable helper text from here
    game.setNextStep(ONBOARDING_3);
  }
}