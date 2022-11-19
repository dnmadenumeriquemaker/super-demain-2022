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

const SLEEP = 1;
const START = 2;
const PLAY = 3;
const WIN = 4;
const LOST = 5;

let STEP = SLEEP;

// Images
let imgAsteroid;
let imgPlayer;

let asteroids = [];
let player;

let asteroidSize = 370;
let density = 25;

// Permet de viser un peu à côté ;)
let hitzoneTolerance = 20;
let son;

let canFire = true;


let score;
let collisions;
let seconds;
let timer;

let typo;

// ♥ Variables des assets
let bg;
let imgplanete1;
let imgplanete2;
let imgplanete3;
let imgplanete4;
let imgplanete5;
let imgjosephine;
let logotypo;
let pilote;
let copilote;
let opacityPilot = 65;
let opacityCopilot = 65;

let lamusique; // c'est acceuil.mp3 --->   music/acceuil.mp3

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



function initial() {
  timer = null;
  seconds = 50;
  collisions = 0;
  score = 0;
  player = new Player();


}

function preload() {
  son = loadSound("assets/Gamesound.mp3");
  sonintro = loadSound("assets/sonintro.mp4");
  typo = loadFont('assets/UpheavalPro.otf');
  sonexplosion = loadSound("assets/sonexplosion.wav"); // son explosion de l'asteroide
  // ♬ Chargement deS SONS
  lamusique = loadSound("music/acceuil.mp3");
  selection_du_pilote = loadSound("music/selectionpilote.wav"); // ♬ SFX choix pilote
  selection_du_copilote = loadSound("music/selectioncopilote.wav"); // ♬ SFX choix copilote

}

function setup() {
  createCanvas(1920, 1080);

  ellipseMode(CENTER);
  imageMode(CENTER);
  fill('#00FFFF');
  textFont(typo);


  // Media
  imgAsteroid = loadImage("assets/asteroid.png");
  imgAsteroidRed = loadImage("assets/asteroidred.png");
  imgPlayer = loadImage("assets/player.png");
  fond = loadImage("assets/fond.png");
  overlay = loadImage("assets/overlay.png");
  laser = loadSound("assets/laser.mp3");
  //alerte = loadSound("assets/alerte.mp3");
  glitch = loadImage("assets/glitch.gif");
  win = loadImage("assets/win.png");
  lost = loadImage("assets/lost.png");
  chrono = loadImage("assets/chrono.png");
  sonexplosionAsteroide = loadSound("assets/sonexplosion.wav");
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
  //Chargement Titles
  logotypo = loadImage("img/TYPO.svg"); // OK
  repondretypo = loadImage("img/repondre.gif"); //OK
  // Chargement illustration : Illus du pilote et du co-pilote
  pilote = loadImage("img/pilote.png");
  copilote = loadImage("img/copilote.png");
  lamusique.loop(); // ♬ loop de la musique

}

function draw() {
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
    blendMode(MULTIPLY); // mode de fusion
    tint(255, 127);
    image(overlay_scanline, 30, 0, 0); // overlay rajouter effets de scanline retro
    pop();

    push();
    tint(255, opacityPilot);
    image(pilote, 50, 0, 560, 901);
    pop();

    push();
    tint(255, opacityCopilot);
    image(copilote, 1250, 0, 700, 901);
    pop();

    //Affichage du logo (BlindMission)
    image(logotypo, width / 2.5, 500, 400, 200);

    //Affichage de Josephine
    image(imgjosephine, width / 2.7, 0, 500, 500);

    // faire une animation "blinking" (clignement) mais retravailler le visuel <- OK FAIT
    image(repondretypo, 700, 750, 0, 0);

    pop();
  }

  if (STEP == PLAY) {
    image(fond, 960, 540, 1920, 1080);
    image(overlay, 960, 540, 1920, 1080);
    image(chrono, 235, 185, 277, 140);

    textSize(50);
    text(seconds, 200, 200);


    textSize(40);
    text(score, 1750, 900);
    text(collisions, 1700, 900);

    // Crée des astéroïdes au fil du temps
    // (avec une probabilité)
    if (random() < density / 3000) {
      createAsteroid();
    }

    // On affiche tous les astéroïdes
    for (let i = asteroids.length - 1; i >= 0; i--) {
      let asteroid = asteroids[i];

      // Si l'astéroïde a été détruit, on le supprime
      // donc on ne l'affiche pas
      if (asteroid.isDead()) {
        sonexplosionAsteroide.play();
        image(explosionAsteroideIsDead, 0, 500, 500); // gif animation asteroide dead 
        asteroids.splice(i, 1);
        continue; // permet de passer à l'astéroïde suivant
      }

      asteroid.update();
      asteroid.draw();
    }

    // On affiche le viseur
    player.draw();
  }

  if (STEP == WIN) {

    image(win, width / 2, height / 2);
    textAlign(CENTER);
    text("appuer sur start pour recommencer", 960, 740);
  }
  if (STEP == LOST) {
    image(lost, width / 2, height / 2);
  }
}

function keyPressed() {
  if (keyCode == 37) {
    player.moveLeft();
  }
  if (keyCode == 39) {
    player.moveRight();
  }
  if (keyCode == 38) {
    player.moveUp();
  }
  if (keyCode == 40) {
    player.moveDown();
  }
  if (key == "R") {
    if (canFire == true) {
      player.fire();
      canFire = false;
    }
  }

  if (key == "s") {
    setStep(START);
  }
  if (key == "w") {
    setStep(SLEEP);
  }
  if (key == "p") {
    setStep(PLAY);
  }
}

function keyReleased() {
  //TODO
  canFire = true;

}

function mouseMoved() {
  if (STEP == PLAY) {
    player.x = mouseX;
    player.y = mouseY;
  }
}

function mousePressed() {
  if (STEP == PLAY) {
    player.fire();
    laser.play();
  }
}

function createAsteroid() {
  asteroids.push(new Asteroid(random(width), random(height)));
}

function setStep(newStep) {
  STEP = newStep;

  if (STEP == START) {
    oVideo.style.display = "block";
    oVideo.currentTime = 0.0001;
    oVideo.play();
  } else {
    oVideo.pause();
    oVideo.style.display = "none";
  }

  if (STEP == PLAY) {
    initial();

    createAsteroid();

    timer = setInterval(function () {
      seconds--;
      if (seconds <= 0) {
        // TODO : faire en sorte de gagner ou perdre ICI
        clearInterval(timer);
        setStep(WIN);
      }
    }, 1000);

    collisions--;
    if (collisions >= 12) {
      setStep(LOST);
    }

  }
}


var oVideo;

document.addEventListener("DOMContentLoaded", function () {
  oVideo = document.getElementById("video");
  oVideo.addEventListener("ended", function (oEvent) {
    //document.getElementById("video").style.display = "none";
    setStep(PLAY);
  });
});
