const STEP_WAIT = 0;
const STEP_COUNTDOWN = 1;
const STEP_PLAY = 2;
const STEP_END = 3;

const GAME_DURATION = 90;

let step = STEP_WAIT;

let font;

let timerCountdown = null;
let countdown;
let timerPlayRemaining;
let timerPlay = null;
let timerAction = null;

let animationTimeAction = 0;

let colorBlue = '#4FC1E2';
let colorPurple = '#AA3C8E';
let colorOrange = '#EE7517';

let currentButtonLetterToPress = null;
let score;


let spritesheets = [];
let animations = [];
let sprites = [];

let spritesData = {
  'rules': {
    size: [2160, 720],
    frames: 7,
    speed: 0.06,
  },
};

let imgRules;
let imgChampi;
let imgLand;

let imgFleur;
let imgFleurTimer;

let fleur1, fleur2, fleur3;

// Petit champi : 9 boutons (+ bouton rouge ?)
// Moyen champi : 10 boutons
// Grand champi : 10 boutons

let fleursTimer = [];
let scoreTexts = [];

let frameCountPlay;

let ENABLE_ARDUINO = true;
let IS_ARDUINO_OK = false;
let port;

const buttons = {
  // champi bleu
  'b': 14,
  'q': 15,
  'c': 16,
  'd': 17,
  'e': 18,
  'f': 19,
  'g': 20,
  'h': 21,
  'i': 22,

  // champi orange
  's': 23,
  't': 24,
  //'l': 25, // BROKEN
  'v': 26,
  'z': 27,
  'x': 28,
  'y': 29,
  'w': 30,
  '7': 31,

  // champi violet
  'j': 32,
  'k': 33,
  'l': 34,
  ',': 35,
  'n': 36,
  'o': 37,
  'p': 38,
  'a': 39,
  'r': 40,
}

const buttonsLetters = [
  // champi bleu
  'b',
  'q',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',

  // champi orange
  's',
  't',
  //'l': 25, // BROKEN
  'v',
  'z',
  'x',
  'y',
  'w',
  '7',

  // champi violet
  'j',
  'k',
  'l',
  ',',
  'n',
  'o',
  'p',
  'a',
  'r',
];

function preload() {
  font = loadFont('assets/Dela.ttf');

  // load spritesheets
  for (const [spriteName, data] of Object.entries(spritesData)) {
    spritesheets[spriteName] = loadImage('assets/' + spriteName + '.png');
  }

  imgChampi = loadImage('assets/champi.png');
  imgLand = loadImage('assets/land.png');
  imgFleur = loadImage('assets/fleur_01.png');
  imgFleurTimer = loadImage('assets/fleur_contour.png');
}


function setup() {
  createCanvas(2160, 2160);
  background(0);
  textFont(font);
  imageMode(CENTER);
  strokeJoin(ROUND);
  frameRate(30);

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

  imgRules = new Sprite('rules');

  fleur1 = new Fleur(620, 200);
  fleur2 = new Fleur(1960, 1000);
  fleur3 = new Fleur(250, 1320);


  if (ENABLE_ARDUINO) {

    port = createSerial();

    // in setup, we can open ports we have used previously
    // without user interaction

    let usedPorts = usedSerialPorts();
    if (usedPorts.length > 0) {
      port.open(usedPorts[0], 57600);
    }

  }

  //setStep(STEP_WAIT);
  //setStep(STEP_COUNTDOWN);
  setStep(STEP_PLAY);


}

function draw() {

  if (ENABLE_ARDUINO) {
    // changes button label based on connection status
    if (!port.opened()) {
      IS_ARDUINO_OK = false;
      console.log('Waiting for Arduino');
    } else {
      IS_ARDUINO_OK = true;
      //console.log('Connected');
    }

    if (IS_ARDUINO_OK) {
      port.write(16);
    }

    /*
    
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
    */
  } else {
    console.log('Mode without Arduino');
  }


  background(colorBlue);
  //fill(colorBlue);
  //noStroke();
  //circle(width / 2, height / 2, 2160);

  animationTimeAction++;

  if (step == STEP_WAIT) {

    fleur1.update();
    fleur1.show();
    fleur2.update();
    fleur2.show();
    fleur3.update();
    fleur3.show();

    push();
    translate(width / 2, 800);
    scale(map(cos(frameCount / 7), -1, 1, 1, 1.1));
    image(imgChampi, 0, -200);
    image(imgLand, 0, 150);
    pop();

    imgRules.show(width / 2, height - 720 / 2);
  }

  if (step == STEP_COUNTDOWN) {
    push();
    fill(255);
    stroke(0);
    strokeWeight(60);
    textSize(map(animationTimeAction, 0, 30, 1260, 560));
    textAlign(CENTER);

    let txt = countdown;
    if (countdown == 0) {
      txt = 'Go !';
    }

    text(txt, width / 2, height / 2 + map(animationTimeAction, 0, 30, 450, 250));
    pop();
  }

  if (step == STEP_PLAY) {
    timerAction++;
    frameCountPlay = frameCount - frameCountPlayStarted;

    push();
    translate(width / 2, height / 2);
    rotate(radians(-90));

    for (let i = 0; i < fleursTimer.length; i++) {
      fleursTimer[i].update();
      fleursTimer[i].show();
    }
    pop();


    push();
    fill(255);
    textSize(280);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(60);
    translate(width / 2, height / 2 + map(cos(frameCountPlay / 5), -1, 1, 75, 100));
    scale(map(cos(frameCountPlay / 5), -1, 1, 0.8, 1));
    text(score, 0, 0);
    pop();

    for (let i = scoreTexts.length - 1; i >= 0; i--) {
      if (scoreTexts[i].shouldBeRemoved()) {
        splice(i, 1);
        continue;
      }

      scoreTexts[i].update();
      scoreTexts[i].show();
    }


    console.log(currentButtonLetterToPress);
  }

  if (step == STEP_END) {
    // end
  }

  // DEBUG
  push();
  let sw = 600;

  stroke(0);
  strokeWeight(sw);
  noFill();
  circle(width / 2, height / 2, 2160 + sw);
  pop();
}

function mousePressed() {
  if (step == STEP_END) {
    setStep(STEP_WAIT);
  }
  else if (step == STEP_WAIT) {
    setStep(STEP_COUNTDOWN);
  }
  else if (step == STEP_COUNTDOWN) {
    setStep(STEP_PLAY);
  }
  else if (step == STEP_PLAY) {
    setStep(STEP_END);
  }
}

function keyPressed() {

  if (ENABLE_ARDUINO) {
    if (key == "b") {
      port.open("Arduino", 57600);
    }
  }


  if (step == STEP_PLAY) {
    for (const [buttonLetter, buttonLedPin] of Object.entries(buttons)) {
      if (key == buttonLetter) {
        if (buttonLetter == currentButtonLetterToPress) {
          // Right button
          console.log('Bon bouton !');

          rightButton();
          setNextButton();
        } else {
          // Wrong button
          console.log('Mauvais bouton');
          wrongButton();
        }
      }
    }
  }
}

function setStep(newStep) {
  if (newStep != step) {
    animationTimeAction = 0;
  }

  step = newStep;

  if (newStep == STEP_WAIT) {
    imgRules.loop();
  }

  if (newStep == STEP_COUNTDOWN) {
    countdown = 3;

    clearInterval(timerCountdown);
    timerCountdown = setInterval(function () {
      countdown--;
      animationTimeAction = 0;

      if (countdown < 0) {
        setStep(STEP_PLAY);
      }
    }, 1000);
  } else {
    clearInterval(timerCountdown);
  }

  if (newStep == STEP_PLAY) {
    score = 0;
    timerPlayRemaining = GAME_DURATION;
    frameCountPlayStarted = frameCount;

    setFleursTimer();
    setNextButton();

    clearInterval(timerPlay);

    timerPlay = setInterval(function () {
      timerPlayRemaining--;

      if (timerPlayRemaining <= 0) {
        setStep(STEP_END);
        clearInterval(timerPlay);
      }
    }, 1000);
  } else {
    clearInterval(timerPlay);
  }



  if (newStep == STEP_END) {

  }
}

function setFleursTimer() {
  fleursTimer = [];
  let nbFleurs = 16;

  for (let i = 0; i < nbFleurs; i++) {
    let angle = 360 / nbFleurs * i;
    let x = Math.cos(angle * PI / 180) * 900;
    let y = Math.sin(angle * PI / 180) * 900;
    let timeMin = GAME_DURATION / nbFleurs * i;
    let timeMax = GAME_DURATION / nbFleurs * (i + 1);
    fleursTimer.push(new FleurTimer(x, y, timeMin, timeMax));
  }
}

function setNextButton() {
  currentButtonLetterToPress = buttonsLetters[int(random(buttonsLetters.length))];
  timerAction = 0;
}

function getCurrentButtonLedPin() {
  return buttons[currentButtonLetterToPress];
}

function rightButton() {
  let inc = constrain(int(map(timerAction, 0, 60 * 10, 20, 2)), 2, 20) * 50;

  scoreTexts.push(new ScoreText('+' + inc, width / 2, height / 2, '+'));

  score += inc;

  checkScore();
}

function wrongButton() {
  score -= 100;

  scoreTexts.push(new ScoreText('-' + 100, width / 2, height / 2 + 300, '-'));

  checkScore();
}

function checkScore() {
  score = max(score, 0); // on évite le score négatif
}

class Fleur {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.a = random(100);
    this.dir = ((random(1) < 0.5) ? 1 : -1) * random(0.3, 0.6);
  }

  update() {
    this.a += this.dir;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.a));
    scale(1.3);
    image(imgFleur, 0, 0);
    pop();
  }
}

class FleurTimer {
  constructor(x, y, min, max) {
    this.x = x;
    this.y = y;
    this.a = random(100);
    this.aSpeed = 1;
    this.scale = 1;
    this.min = min * 30; // frames count
    this.max = max * 30; // frames count
  }

  update() {
    this.scale = constrain(map(frameCountPlay, this.min, this.max, 1, 0), 0, 1);
    if (frameCountPlay >= this.min && frameCountPlay <= this.max) {
      this.aSpeed = map(frameCountPlay, this.min, this.max, 1, 15);
    }
    this.a += this.aSpeed;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.a));
    scale(this.scale);
    image(imgFleurTimer, 0, 0);
    pop();
  }
}



class ScoreText {
  constructor(txt, x, y, type) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.type = type;
    this.alpha = 255;
    this.alive = true;
  }

  update() {
    if (this.type == '+') {
      this.y -= 16;
    } else {
      this.y += 16;
    }

    this.alpha -= 15;

    if (this.alpha <= 0) {
      this.alive = false;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    if (this.type == '+') {
      fill(34, 164, 133, this.alpha);
    } else {
      fill(209, 36, 98, this.alpha);
    }
    textSize(300);
    textAlign(CENTER);
    stroke(0, this.alpha);
    strokeWeight(60);
    text(this.txt, 0, 0);
    pop();
  }

  shouldBeRemoved() {
    return !this.alive;
  }
}