

const TIMEOUT_DURATION = 10; // TODO: more time after videos
const GAME_DURATION = 90;
const ASTEROID_SCALE = 50;
let DELAY_BETWEEN_ASTEROIDS;

const ENABLE_MICRO = true;
const SLEEP_TIMER_DURATION = 100;
const SLEEP_PLAYERS_OPACITY = 65;

const MAX_COLLISIONS = 12;

const SLEEP_VOLUME = 0.8;

const SLEEP = 1;
const START = 2;
const PLAY = 3;
const WIN = 4;
const LOST = 5;

let sleepTimer;

let STEP = null;

let EVENTS_READY = false;

let globalShake = 0;

// Images
let imgAsteroid;
let imgPlayer;

let asteroids = [];
let player;

let asteroidSize = 370;

// Permet de viser un peu à côté ;)
let hitzoneTolerance = 20;
let son;

let canFire = true;


let score;
let collisions;
let seconds;
let timer;

let timerBeforeRestart;

let typo;

// ♥ Variables des assets
let hud;
let bg;
let imgplanete1;
let imgplanete2;
let imgplanete3;
let imgplanete4;
let imgplanete5;
let imgjosephine;
let gifjosephine;
let logotypo;
let pilote;
let copilote;
let opacityPilot;
let opacityCopilot;
let vie;
let vieMask;

let imgfocus;

let musiqueIntro; // c'est acceuil.mp3 --->   music/acceuil.mp3

// ♥ Je en place les cordonnées de base de mes planetes :
// y = la hauteur
// y+(numero) = numero de la planete

x = 596;
y1 = 1080; // ici je met 1080 car c'est la hauteur de mon canvas(Les planetes vont donc démarrer en dessous)
y2 = 2000; // ajout d'un décalage en fesant demarrer les planettes 2000pixels plus bas.
y3 = 3000; // ajout d'un décalage en fesant demarrer les planettes 3000pixels plus bas.
y4 = 4000; // ajout d'un décalage en fesant demarrer les planettes 4000pixels plus bas.
y5 = 5000; // ajout d'un décalage en fesant demarrer les planettes 5000pixels plus bas.

// ♥ je met une variable pour que l'opacité des illus puissent etre modifiables
opacitychangingpilote = 255; // Pour afficher les illus > mettre 255
opacitychangingcopilote = 255; // Pour afficher les illus > mettre 255

let spritesheets = [];
let animations = [];
let spritesData = {
  'explosion': {
    size: [305, 309],
    frames: 26,
    speed: 0.9,
  },
};



function initGame() {
  clearInterval(timer);
  timer = null;

  asteroids = [];
  seconds = GAME_DURATION;

  collisions = 0;
  score = 0;
  player = new Player();

  globalShake = 0;

  musiqueJeu.pause();
  musiqueJeu.currentTime = 0.0001;
  musiqueJeu.play();

  DELAY_BETWEEN_ASTEROIDS = 400;
}

function preload() {

  typo = loadFont('assets/UpheavalPro.otf');

  sonImpactVaisseau = document.getElementById("sonImpactVaisseau"); // son explosion de l'asteroide
  // ♬ Chargement deS SONS
  musiqueIntro = document.getElementById("musiqueIntro");
  musiqueJeu = document.getElementById("musiqueJeu");
  laser = document.getElementById("laser");
  sonexplosionAsteroide = document.getElementById("sonexplosionAsteroide");

  selection_du_pilote = document.getElementById("selection_du_pilote"); // ♬ SFX choix pilote
  selection_du_copilote = document.getElementById("selection_du_copilote"); // ♬ SFX choix copilote




  // Media
  imgFocus = loadImage("assets/focus.gif");
  imgAsteroid = loadImage("assets/asteroid.png");
  imgAsteroidRed = loadImage("assets/asteroidred.png");
  imgPlayer = loadImage("assets/player.png");
  fond = loadImage("assets/fond.png");
  hud = loadImage("assets/hud.png");
  //alerte = loadSound("assets/alerte.mp3");
  glitch = loadImage("assets/glitch.gif");
  win = loadImage("assets/win.png");
  lost = loadImage("assets/lost.png");
  chrono = loadImage("assets/chrono.png");
  explosionAsteroideIsDead = loadImage("assets/animationexplosion.gif") // il n'apparait pas, probleme de dimensions ?

  bg = loadImage("img/bg.png");
  overlay_scanline = loadImage("img/visualeffects/overlayscanline.png");
  //Chargement des planetes
  imgplanete1 = loadImage("img/planete1.png"); //OK
  imgplanete2 = loadImage("img/planete2.png"); //OK
  imgplanete3 = loadImage("img/planete3.png"); //OK
  imgplanete4 = loadImage("img/planete4.png"); //OK
  imgplanete5 = loadImage("img/planete5.png"); //OK
  //Chargement illustration  : Josephine
  imgjosephine = loadImage("img/josephine.png"); //OK
  gifjosephine = loadImage("assets/josephine.gif"); //OK
  vie = loadImage("assets/vie.png"); //OK
  //Chargement Titles
  logotypo = loadImage("img/TYPO.svg"); // OK
  repondretypo = loadImage("img/repondre.gif"); //OK
  // Chargement illustration : Illus du pilote et du co-pilote
  pilote = loadImage("img/pilote.png");
  copilote = loadImage("img/copilote.png");
  piloteop = loadImage("img/pilote-opacity.png");
  copiloteop = loadImage("img/copilote-opacity.png");

  // load spritesheets
  for (const [spriteName, data] of Object.entries(spritesData)) {
    spritesheets[spriteName] = loadImage('assets/sprite-' + spriteName + '.png');
  }
}


function setup() {
  createCanvas(1920, 1080);

  ellipseMode(CENTER);
  imageMode(CENTER);
  fill('#00FFFF');
  textFont(typo);
  noCursor();

  vieMask = createGraphics(213, 178);

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

  if (ENABLE_MICRO === true) {
    navigator.getUserMedia(
      { audio: true },
      function (stream) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var ctx = new AudioContext();

        // Create an AudioNode from the stream.
        var mediaStreamSource = ctx.createMediaStreamSource(stream);

        // Connect it to the destination to hear yourself (or any other node for processing!)
        mediaStreamSource.connect(ctx.destination);

      },
      function (err) {
        console.log(err);
      }
    );
  }
}

function initEvents() {
  setStep(SLEEP);
}


function draw() {
  if (STEP == null) {
    push();
    background(0);
    textSize(40);
    textAlign(CENTER);
    text("Cliquez n'importe où\r\nou appuyez sur n'importe quelle touche de clavier\r\npour démarrer le dispositif", width / 2, height / 2);
    pop();
  }

  if (STEP == SLEEP) {
    push();
    imageMode(CORNER);
    //text("Écran d'attente", width / 2, height / 2);

    background(bg);

    //Affichage des planètes qui défilent ♥ Preview
    // image(imgplanete+numerodelaplanete,x, y+n,width,height);
    image(imgplanete1, 500, y1, 500, 500);
    image(imgplanete2, 1600, y2, 300, 300);
    image(imgplanete3, 100, y3, 500, 500);
    image(imgplanete4, 900, y4, 900, 600);
    // image(imgplanete5, 1500, y5, 500, 500); (je ne l(utilise pas))
    // Animation des planètes :
    // Je n'ai pas trouvé comment faire pour looper les redemarrage des planetes
    //Animation de la planete  1 :

    if (y1 > -1000) {
      y1 -= 1;
    } else {
      y1 = height;
    }

    if (y2 > -2000) {
      y2 -= 1;
    } else {
      y2 = height;
    }

    if (y3 > -4000) {
      y3 -= 2;
    } else {
      y3 = height;
    }

    if (y4 > -4000) {
      y4 -= 2;
    } else {
      y4 = height;
    }

    //Animation de la planete  5 :
    //y5 = y5 - 1;
    //{
    //}

    //☺ à mettre en opacité 50% et lorsque le présumé pilote clique sur le bouton start -> opacité à 100 % de l'image pour dire qu'il a bien cliqué dessus.(en attente aussi du co-pilote)

    push();
    //blendMode(MULTIPLY); // mode de fusion
    //tint(255, 127);
    //image(overlay_scanline, 30, 0, 0); // overlay rajouter effets de scanline retro
    pop();

    push();
    //tint(255, opacityPilot);
    image(pilote, 1250, 0, 560, 901);
    pop();

    push();
    //tint(255, opacityCopilot);
    image(copilote, 50, 0, 700, 901);
    pop();

    //Affichage du logo (BlindMission)
    image(logotypo, width / 2.5, 500, 400, 200);

    //Affichage de Josephine
    image(imgjosephine, width / 2.7, 0, 500, 500);

    // faire une animation "blinking" (clignement) mais retravailler le visuel <- OK FAIT
    image(repondretypo, 700, 750, 0, 0);

    pop();

    if (opacityPilot == 255 && opacityCopilot == 255) {
      sleepTimer -= 1.2;

      push();
      fill(0, map(sleepTimer, SLEEP_TIMER_DURATION, 0, 0, 255));
      rect(0, 0, width, height);
      pop();

      if (!musiqueIntro.paused || musiqueIntro.currentTime) {
        musiqueIntro.volume = constrain(map(sleepTimer, SLEEP_TIMER_DURATION, 0, SLEEP_VOLUME, 0), 0, 1);
      }
      if (sleepTimer <= 0) {
        setStep(START);
      }
    }
  }

  if (STEP == PLAY) {



    image(fond, 960, 540, 1920, 1080);

    // Crée des astéroïdes au fil du temps
    // (avec une probabilité)
    if (frameCount % DELAY_BETWEEN_ASTEROIDS == 0) {
      createAsteroid();
    }

    // On affiche tous les astéroïdes
    for (let i = asteroids.length - 1; i >= 0; i--) {
      let asteroid = asteroids[i];

      // Si l'astéroïde a été détruit, 
      // on lance les animations
      if (asteroid.isDead()) {
        // sonexplosionAsteroide.stop();
        // sonexplosionAsteroide.play();
      }

      // Si l'astéroide est trop "vieux", on le supprime
      // donc on ne l'affiche pas
      if (asteroid.shouldBeRemoved()) {
        asteroids.splice(i, 1);
        continue; // permet de passer à l'astéroïde suivant
      }

      asteroid.update();
      asteroid.draw();
    }

    push();
    translate(random(-globalShake, globalShake), random(-globalShake, globalShake));

    // On affiche le viseur
    player.draw();

    image(hud, 960, 540, 1920, 1080);

    vieMask.clear();
    vieMask.fill(255);
    vieMask.rect(0, map(collisions, 0, MAX_COLLISIONS, 0, 178), 213, 178);

    (masked = vie.get()).mask(vieMask);
    image(masked, 1726, 859);

    image(chrono, 235, 185, 277, 140);

    textAlign(CENTER);
    textSize(50);
    text(seconds, 230, 200);

    image(gifjosephine, 1712, 232);

    textSize(80);
    text(score, 1720, 660);
    //text(collisions, 1700, 900);
    pop();

    if (collisions >= MAX_COLLISIONS) {
      setStep(LOST);
    }

    globalShake -= .2;
    globalShake = max(globalShake, 0);
  }

  if (STEP == WIN) {
    /*
    image(win, width / 2, height / 2);
    textAlign(CENTER);
    textSize(40);
    text("Appuyez sur start pour recommencer", 960, 740);
    */
  }
  if (STEP == LOST) {
    //image(lost, width / 2, height / 2);
  }
}

function keyPressed() {
  if (STEP == SLEEP) {
    if (keyCode === 65) {
      image(pilote, 1250, 0, 560, 901);
      if (opacityPilot != 255) {
        selection_du_pilote.volume = 0.6;
        selection_du_pilote.pause();
        selection_du_pilote.currentTime = 0.00001;
        selection_du_pilote.play(); // ♬ ajoute un SFX lorsque le pilote est choisis
        opacityPilot = 255;
      }
    }

    if (keyCode === 66) {
      image(copilote, 50, 0, 700, 901);
      if (opacityCopilot != 255) {
        selection_du_copilote.volume = 0.6;
        selection_du_copilote.pause();
        selection_du_copilote.currentTime = 0.00001;
        selection_du_copilote.play();
        opacityCopilot = 255;
      }
    }
  }

  if (STEP == PLAY) {

    if (keyIsDown(37)) {
      player.moveLeft();
    }
    if (keyIsDown(39)) {
      player.moveRight();
    }
    if (keyIsDown(38)) {
      player.moveUp();
    }
    if (keyIsDown(40)) {
      player.moveDown();
    }
    if (keyIsDown(82)) {
      if (canFire == true) {
        player.fire();

        laser.pause();
        laser.currentTime = 0.00001;
        laser.play();

        canFire = false;
      }
    }
  }

  if (key == "w") {
    setStep(SLEEP);
  }
  if (key == "s") {
    setStep(START);
  }
  if (key == "p") {
    setStep(PLAY);
  }
  if (key == "i") {
    setStep(WIN);
  }
  if (key == "l") {
    setStep(LOST);
  }

  checkEvents();
}

function keyReleased() {
  //TODO: avoid repeated fire with joystick
  canFire = true;

}

function mouseMoved() {
  if (STEP == PLAY) {
    player.x = mouseX;
    player.y = mouseY;
    player.checkPosition();
  }
}

function mousePressed() {

  checkEvents();

  if (STEP == PLAY) {
    player.fire();

    laser.pause();
    laser.currentTime = 0.00001;
    laser.play();
  }
}

function checkEvents() {
  if (!EVENTS_READY) {
    EVENTS_READY = true;
    initEvents();
  }
}

function createAsteroid() {
  asteroids.push(new Asteroid());
}


var oVideo;

document.addEventListener("DOMContentLoaded", function () {
  oVideo = document.getElementById("video");
  oVideo.addEventListener("ended", function (oEvent) {
    //document.getElementById("video").style.display = "none";
    setStep(PLAY);
  });
});

var winVideo;

document.addEventListener("DOMContentLoaded", function () {
  winVideo = document.getElementById("winvideo");
  winVideo.addEventListener("ended", function (oEvent) {
    setTimerBeforeRestart();
  });
});

var lostVideo;

document.addEventListener("DOMContentLoaded", function () {
  lostVideo = document.getElementById("lostvideo");
  lostVideo.addEventListener("ended", function (oEvent) {
    setTimerBeforeRestart();
  });
});



function setTimerBeforeRestart() {

  setStep(SLEEP);
  /*
  clearTimeout(timerBeforeRestart);
  timerBeforeRestart = setTimeout(function () {
    setStep(SLEEP);
  }, TIMEOUT_DURATION * 1000); 
  */
}






function setStep(newStep) {
  STEP = newStep;

  if (!EVENTS_READY) return;

  // disable potentially playing sounds by default
  if (musiqueIntro) {
    musiqueIntro.pause();
  }

  // waiting screen
  if (STEP == SLEEP) {
    if (musiqueIntro) {
      musiqueIntro.pause();
    }
      musiqueIntro.currentTime = 0.0001; // ♬ loop de la musique
      musiqueIntro.volume = SLEEP_VOLUME;
      musiqueIntro.play(); // ♬ loop de la musique
    

    sleepTimer = SLEEP_TIMER_DURATION;
    opacityCopilot = SLEEP_PLAYERS_OPACITY;
    opacityPilot = SLEEP_PLAYERS_OPACITY;
  }

  // rules: video
  if (STEP == START) {
    oVideo.style.display = "block";
    oVideo.currentTime = 0.0001;
    oVideo.play();
  } else {
    oVideo.pause();
    oVideo.style.display = "none";
  }

  // start game
  if (STEP == PLAY) {
    initGame();

    createAsteroid();

    timer = setInterval(function () {
      seconds--;
      if (seconds <= 0) {
        // TODO : faire en sorte de gagner ou perdre ICI
        clearInterval(timer);
        setStep(WIN);
      }
    }, 1000);
  } else {
    clearInterval(timer);
  }


  if (STEP == WIN) {
    // win: video
    winVideo.style.display = "block";
    winVideo.currentTime = 0.0001;
    winVideo.play();
  } else {
    winVideo.pause();
    winVideo.style.display = "none";
  }

  if (STEP == LOST) {
    // lost: video
    lostVideo.style.display = "block";
    lostVideo.currentTime = 0.0001;
    lostVideo.play();
  } else {
    lostVideo.pause();
    lostVideo.style.display = "none";
  }

  if (STEP == WIN || STEP == LOST) {

  } else {
    clearTimeout(timerBeforeRestart);
  }

  if (STEP != PLAY) {
    if (musiqueJeu) {
      musiqueJeu.pause();
    }
  }
}