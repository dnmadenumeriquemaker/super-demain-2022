// Mode : production
let DEBUG = false;
let ENABLE_ARDUINO = true;

let GAME_TIMEOUT = 10;

let IS_ARDUINO_OK = false;

let backgroundAsset = "assets/fondspatial.png";

let step = null;
let playerRedActive = false;
let playerBlueActive = false;
let waitTimer = 0;
let timerFreeze = 0;

let videointro;
let playingvideointro = false;
let videofin;
let playingvideofin = false;

let asteroidtouche;
let pileattrapee;
let batterierecue;
let axogame;
let axonautegame;

let futura, montserrat;

let gameState = step;

let pot1 = 512;
let pot2 = 512;
let dist1 = 0;
let dist2 = 0;

let fonduStep1Step2;
/*
  0 = veille
  1 = video_debut
  2 = game
  3 = video_fin
  4 = score
*/

let items = [];
let players = [];
let playerBlue, playerRed;
let spaceship;
let asteroid = [];
let spaceshipx = 0;
let spaceshipy = 0;
let energiex = 0;
let energiey = 0;

let spaceshipxtarget = 0;
let spaceshipytarget = 0;
let energiextarget = 0;
let energieytarget = 0;
let easing = 0.009;

let dropZoneDiam = 100;

let dropzonered;
let dropzoneblue;

let indicatorred;
let indicatorblue;

let zones;

let itemsPerZone = 5;

let port;
let connectBtn;

let timerPlayStarted;
let lastGameDuration;

let timerTimeout;

let timerGiveUp;

function preload() {

  // Sounds

  batterierecue = document.getElementById('batterierecue');
  pileattrapee = document.getElementById('pileattrapee');
  asteroidtouche = document.getElementById('asteroidtouche');
  axogame = document.getElementById('axogame');

  spaceship = loadImage("assets/vaisseau.png");
  energieoffpink = loadImage("assets/off_pink.png");
  energieonpink = loadImage("assets/on_pink.png");
  energieoffblue = loadImage("assets/off_blue.png");
  energieonblue = loadImage("assets/on_blue.png");
  asteroids = loadImage("assets/asteroids.png");
  ecranveille = loadImage("assets/ecran_veille.jpg");
  inserezvosmains = loadImage("assets/gif_inserez_vos_mains.gif");
  waitvalidationpink = loadImage("assets/waitvalidationpink.png");
  waitvalidationblue = loadImage("assets/waitvalidationblue.png");
  validationpink = loadImage("assets/validationpink.png");
  validationblue = loadImage("assets/validationblue.png");



  dropzonered = loadImage("assets/dropzone-red.png");
  dropzoneblue = loadImage("assets/dropzone-blue.png");

  indicatorred = loadImage("assets/indicator-red.png");
  indicatorblue = loadImage("assets/indicator-blue.png");

  futura = loadFont("assets/fr-bold.ttf");
  montserrat = loadFont("assets/Montserrat-Light.ttf")
  backgroundAsset = loadImage(backgroundAsset);
}

function setup() {
  createCanvas(1280, 720);
  ellipseMode(CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();

  if (!DEBUG) {
    noCursor();
  }

  asteroidPos = createVector(-100, 100);

  videointro = createVideo(["assets/video_debut.mp4"]);
  //videointro.size(width, height);
  videointro.onended(function() { setStep(2) });
  videointro.hide();

  videofin = createVideo(["assets/videofin.mp4"]);
  //videofin.size(width, height);
  videofin.onended(function() { setStep(4) });
  videofin.hide();

  // On définit les limites des 2 zones de jeu
  /*
  zones = {
    A: {
      left: 0,
      right: width / 2 - 100
    },
    B: {
      left: width / 2 + 100,
      right: width
    }
  };
  */
  zones = {
    A: {
      left: 0,
      right: width
    },
    B: {
      left: 0,
      right: width
    }
  };

  dropZones = {
    A: [
      createVector(width / 2 - 120, height / 2 + 140),
      createVector(width / 2 - 240, height / 2 + 0),
      createVector(width / 2 - 120, height / 2 - 140),
      createVector(width / 2 - 60, height / 2 - 200),
    ],
    B: [
      createVector(width / 2 + 120, height / 2 + 140),
      createVector(width / 2 + 240, height / 2 + 0),
      createVector(width / 2 + 120, height / 2 - 140),
      createVector(width / 2 + 60, height / 2 - 200),
    ],
  }

  initGame();

  if (ENABLE_ARDUINO) {

    port = createSerial();

    // in setup, we can open ports we have used previously
    // without user interaction

    let usedPorts = usedSerialPorts();
    if (usedPorts.length > 0) {
      port.open(usedPorts[0], 57600);
    }

  }

  if (DEBUG) {
    showDebugSliders();
  }
  //setStep(0); // TODO: 0

  // DEV ONLY
  /*
  setStep(2);
  fonduStep1Step2 = 0;
  */
}


function draw() {
  if (step == null) {
    push();
    background(0);
    textAlign(CENTER);


    if (ENABLE_ARDUINO) {
      if (!IS_ARDUINO_OK) {
        textSize(30);
        fill(255, 0, 0);
        text("Arduino non détectée\r\nRechargez la page ou appuyez sur la touche [b] pour connecter", width / 2, height / 2);

      } else {
        textSize(30);
        fill(0, 255, 0);
        text("Arduino détectée\r\nCliquez n'importe où ou presser\r\nune touche de clavier pour démarrer le dispositif", width / 2, height / 2);
      }
    }
    else {
      textSize(40);
      fill(255);
      text("Cliquez n'importe où ou presser\r\nune touche de clavier pour démarrer le dispositif", width / 2, height / 2);
    }

    pop();
    if ((!ENABLE_ARDUINO && (mouseIsPressed || keyIsPressed))
      || (ENABLE_ARDUINO && IS_ARDUINO_OK)) {
      setStep(0);
    }


    if (ENABLE_ARDUINO) {
      // changes button label based on connection status
      if (!port.opened()) {
        IS_ARDUINO_OK = false;
        console.log('Waiting for Arduino');
      } else {
        IS_ARDUINO_OK = true;
        //console.log('Connected');
      }
    }

    return;
  }

  frameCountSinceStep++;

  if (ENABLE_ARDUINO) {
    let value = port.readUntil("\n");

    if (value.length > 0) {
      let values = value.split('/');

      //console.log(values);

      pot1 = int(values[0]);
      pot2 = int(values[1]);
      dist1 = int(values[2]);
      dist2 = int(trim(values[3]));

      // console.log(dist1);
    }
  } else {

    console.log('Mode without Arduino');
  }

  if (DEBUG) {
    controlPlayersWithSliders();
  }

  controlPlayers();

  showStep();
}


function initGame() {
  console.log('init game');
  players = [];
  // On crée nos 2 joueurs
  playerRed = new Player('A'); // à gauche
  playerBlue = new Player('B'); // à droite

  // On ajoute nos 2 joueurs dans un tableau de joueurs
  players.push(playerBlue);
  players.push(playerRed);

  items = [];
  generateItems();

  setNewAsteroidPosition();

  timerPlayStarted = Date.now();
  lastGameDuration = 0;

  clearTimeout(timerTimeout);

  timerGiveUp = 0;

}


function game() {
  background(20);

  if (playerRed.alive == false && playerBlue.alive == false) {
    timerGiveUp++;

    if (timerGiveUp > 900) {
      setStep(0);
    }
  } else {
    timerGiveUp = 0;
  }

  // draws background image
  image(backgroundAsset, width / 2, height / 2, width, height);

  for (let i = players.length - 1; i >= 0; i--) {
    let player = players[i];
    player.drawDropZone();
  }

  // On affiche tous les items

  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];

    // Si l'item a été capturé, on le supprime
    // donc on ne l'affiche pas
    if (item.shouldBeRemoved()) {
      items.splice(i, 1);
      continue; // permet de passer à l'objet suivant suivant
    }

    item.update();
    if (fonduStep1Step2 <= 0) {
      item.checkCollision();
    }
    item.draw();
  }

  // On affiche les 2 joueurs
  // On affiche tous les items
  for (let i = players.length - 1; i >= 0; i--) {
    let player = players[i];
    player.checkAsteroid();
    player.update();
    player.checkDrop();
    player.draw();
  }

  showAsteroids();

  showSpaceship();

  // On affiche le HUD en dernier, devant tout le reste
  hud();

  for (let i = players.length - 1; i >= 0; i--) {
    let player = players[i];
    player.drawIndicator();
  }
}

function controlPlayers() {
  playerRed.easeHeading(pot1);
  playerBlue.easeHeading(pot2);

  playerRed.setSpeed(dist2);
  playerBlue.setSpeed(dist1);
}

function controlPlayersWithSliders() {
  let playerRedHeading = sliderPlayerRedHeading.value();
  let playerRedSpeed = sliderPlayerRedSpeed.value();
  let playerBlueHeading = sliderPlayerBlueHeading.value();
  let playerBlueSpeed = sliderPlayerBlueSpeed.value();

  dist2 = playerRedSpeed;
  dist1 = playerBlueSpeed;
  pot1 = playerRedHeading;
  pot2 = playerBlueHeading;
}





function generateItems() {
  for (const [zoneId, zone] of Object.entries(zones)) {
    for (let i = 0; i < itemsPerZone; i++) {
      items.push(new Item('battery', zoneId, random(zone.left, zone.right), random(height)));
    }
  }
}

function hud() {
  // On affiche le score
  /*
  let score = playerRed.score + playerBlue.score;
  let total = itemsPerZone * 2;

  push();
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(score + ' / ' + total, width / 2, 50);
  pop();
  */
}



function keyPressed() {
  if (ENABLE_ARDUINO) {
    if (key == "b") {
      port.open("Arduino", 57600);
    }
  }

  if (key == "l") {
    setStep(3);
  }
}

// Fonctions de debug

function showDebugSliders() {
  sliderPlayerRedHeading = createSlider(0, 1023, 512);
  sliderPlayerRedHeading.position(10, height - 210);
  sliderPlayerRedHeading.style("transform", "rotate(90deg)");
  sliderPlayerRedHeading.style("width", "80px");

  sliderPlayerRedSpeed = createSlider(0, playerRed.distSpeed4 + 4, playerRed.distSpeed4 + 4);
  sliderPlayerRedSpeed.position(-50, 130);
  sliderPlayerRedSpeed.style("transform", "rotate(-90deg)");
  sliderPlayerRedSpeed.style("width", "200px");

  sliderPlayerBlueHeading = createSlider(0, 1023, 512);
  sliderPlayerBlueHeading.position(width - 100, 130);
  sliderPlayerBlueHeading.style("transform", "rotate(-90deg)");
  sliderPlayerBlueHeading.style("width", "80px");

  sliderPlayerBlueSpeed = createSlider(0, playerBlue.distSpeed4 + 4, playerBlue.distSpeed4 + 4);
  sliderPlayerBlueSpeed.position(width - 160, height - 160);
  sliderPlayerBlueSpeed.style("transform", "rotate(90deg)");
  sliderPlayerBlueSpeed.style("width", "200px");
}
