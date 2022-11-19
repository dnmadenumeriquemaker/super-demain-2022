// Mode à désactiver
// lorsque le dispositif est en production
let DEBUG = true;

let backgroundAsset = "assets/fondspatial.png";

let step = 0
let playerRedActive = false;
let playerBlueActive = false;
let waitTimer = 0;
let timerFreeze = 0;

let videointro;
let playingvideointro = false;
let videofin;
let playingvideofin = false;


let gameState = step;

let pot1 = 0;
let pot2 = 0; 
let dist1 = 0;
let dist2 = 0;

let fondu = 100;
/*
  0 = veille
  1 = video_debut
  2 = game
  3 = video_fin
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



let zones;

let itemsPerZone = 5;

let port;
let connectBtn;

function setup() {
  createCanvas(1280, 720);
  ellipseMode(CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();
  
  videointro = createVideo(["assets/video_debut.mp4"]);
  videointro.size(width,height);
  videointro.onended(function(){setStep(2)});
  videointro.hide();
 
   videofin = createVideo(["assets/videofin.mp4"]);
  videofin.size(width,height);
  videofin.onended(function(){setStep(0)});
  videofin.hide();

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

  
  // On définit les limites des 2 zones de jeu
  zones = {
    A: {
      left: 0,
      right: width/2
    },
    B: {
      left: width/2,
      right: width
    }
  };

  
  // On crée nos 2 joueurs
  playerRed = new Player('A'); // à gauche
  playerBlue = new Player('B'); // à droite

  // On ajoute nos 2 joueurs dans un tableau de joueurs
  players.push(playerBlue);
  players.push(playerRed);
  
  
  generateItems();

  
  // On affiche des sliders
  // pour simuler les contrôleurs

  if (DEBUG) {
    showDebugSliders();
  }
  
  // Transform string to image asset
  backgroundAsset = loadImage(backgroundAsset);
  
  setStep(1);
  
  
  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction

  
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
  
  


  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)

  /*
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(80, 200);
  connectBtn.mousePressed(connectBtnClick);
  */
}


function draw() {
  
  let value = port.readUntil("\n");
  if (value.length > 0) {
    
    let values = value.split('/');


    pot1 = int(values[0]);
    pot2 = int(values[1]);
    dist1 = int(values[2]);
    dist2 = int(trim(values[3]));

   // console.log(dist1);
  }

  // changes button label based on connection status
  if (!port.opened()) {
    console.log('Waiting for Arduino');
  } else {
    //console.log('Connected');
  }

  checkStep();
}

function game() {
  background(20);
  
  // draws background image
  image(backgroundAsset,width/2,height/2,width,height); 
  
  controlPlayersWithArduino();

  if (DEBUG) {
  // controlPlayersWithSliders();
  }
  
  
  // On affiche tous les items
  
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];

    // Si l'item a été capturé, on le supprime
    // donc on ne l'affiche pas
    if (item.isCaptured()) {
      items.splice(i, 1);
      continue; // permet de passer à l'objet suivant suivant
    }

    item.update();
    if (fondu <= 0){
     item.checkCollision(); 
    }
    item.draw();
  }

  // On affiche les 2 joueurs
  // On affiche tous les items
  for (let i = players.length - 1; i >= 0; i--) {
    let player = players[i];
    player.update();
    player.draw();
  }
  
  // On affiche le HUD
  
  hud();
  
  push();
  
  if (frameCount % 30 == 0) {
    // toutes les 30 frames
 
  spaceshipxtarget = random(-10,10);
  spaceshipytarget = random(-50, 50);
  }
 spaceshipx += (spaceshipxtarget - spaceshipx) * easing;
   spaceshipy += (spaceshipytarget - spaceshipy) * easing;
  translate(spaceshipx, spaceshipy);
   showSpaceship();
  
   showEnergie();
  
  pop();
  
  showAsteroids();
  

}

function controlPlayersWithArduino() {
  

  playerRed.easeHeading(pot1);
  playerBlue.easeHeading(pot2);

  playerRed.setSpeed(dist1);
  playerBlue.setSpeed(dist2);
  
  
  // Vitesse du joueur rouge (gauche)
  /*
  let playerRedSpeed = map(dist1, 0, 1023, 0, playerMaxSpeed);
  playerRed.setSpeed(playerRedSpeed);
  */
  
  // Vitesse du joueur bleu (droite)
  /*
  let playerBlueSpeed = map(dist2, 0, 1023, 0, playerMaxSpeed);
  playerBlue.setSpeed(playerBlueSpeed);
  */
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
  let score = playerRed.score + playerBlue.score;
  let total = itemsPerZone*2;
  
  push();
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(score + ' / ' + total, width/2, 50);
  pop();
}



function keyPressed() {
  if (key == "b") {
    port.open("Arduino", 57600);
  }
}

// Fonctions de debug

function showDebugSliders() {
  sliderPlayerRedHeading = createSlider(0, 1023, 512);
  sliderPlayerRedHeading.position(10, height - 210);
  sliderPlayerRedHeading.style("transform", "rotate(90deg)");
  sliderPlayerRedHeading.style("width", "80px");

  sliderPlayerRedSpeed = createSlider(0, 1023, 0);
  sliderPlayerRedSpeed.position(-50, 130);
  sliderPlayerRedSpeed.style("transform", "rotate(-90deg)");
  sliderPlayerRedSpeed.style("width", "200px");

  sliderPlayerBlueHeading = createSlider(0, 1023, 512);
  sliderPlayerBlueHeading.position(width - 100, 130);
  sliderPlayerBlueHeading.style("transform", "rotate(-90deg)");
  sliderPlayerBlueHeading.style("width", "80px");

  sliderPlayerBlueSpeed = createSlider(0, 1023, 0);
  sliderPlayerBlueSpeed.position(width - 160, height - 160);
  sliderPlayerBlueSpeed.style("transform", "rotate(90deg)");
  sliderPlayerBlueSpeed.style("width", "200px");
}

function controlPlayersWithSliders() {
  // On oriente la direction du joueur rouge
  // avec le slider

  //let playerRedHeading = map(sliderPlayerRedHeading.value(), 0, 1023, -PI, PI);
  let playerRedHeading = sliderPlayerRedHeading.value();

  playerRed.easeHeading(playerRedHeading);

  // On gère la vitesse du joueur rouge
  // avec le slider

  let playerRedSpeed = map(
    sliderPlayerRedSpeed.value(),
    0,
    1023,
    0,
    playerMaxSpeed
  );
  playerRed.setSpeed(playerRedSpeed);

  // -----

  // On oriente la direction du joueur bleu
  // avec le slider

  let playerBlueHeading = sliderPlayerBlueHeading.value();

  playerBlue.easeHeading(playerBlueHeading);

  // On gère la vitesse du joueur bleu
  // avec le slider

  let playerBlueSpeed = map(
    sliderPlayerBlueSpeed.value(),
    0,
    1023,
    0,
    playerMaxSpeed
  );
  playerBlue.setSpeed(playerBlueSpeed);
}
