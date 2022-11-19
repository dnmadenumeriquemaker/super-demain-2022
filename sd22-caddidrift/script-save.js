let obstacles = [];

var point = 200;

//let=caddie;
var x = (640 - 50) / 2;
var xmiddle = x;
var largeDec = 640 / 4;
var largeDec2 = (640 / 4) * 3;
//let limit = createVector(largeDec, largeDec2);
//let limi(largeDec);
let position = [largeDec + 50, largeDec2 - 50, 320];
//function preload() 
//caddie = rect(x,300,50,50);


//pour les image
let obstBanane;
let obstBarrière;
let obstBoite;
let obstHuile;
let LesObst = [obstBanane, obstBarrière, obstBoite, obstHuile];
let mot = ["pet", "dz"]

function preload() {
  obstBanane = loadImage("banane.png");
  obstBarrière = loadImage("barrière.png");
  obstBoite = loadImage("boite.png");
  obstHuile = loadImage("huile.png");
}

function setup() {
  //mettre au bonne dimention 1280/720
  createCanvas(640, 360);

  for (let i = 0; i < 2; i++) {
    obstacles.push(new Obstacle());
  }
}

function draw() {
  background("#E2D1A1");
  fill("#A89E84");
  ellipseMode(CENTER);

  rect(0, 0, largeDec, height);
  rect(largeDec2, 0, largeDec, height);
  rect(x, 300, 50, 50);
  fill(255);
  textSize(20);
  text("nombre de pint :", 10, 25);
  //text('game ovaire', width/2, height/2);

  if (keyIsPressed) {
    if (key == "a" || key == "A") {
      x = xmiddle - 110;
    } else if (key == "d" || key == "D") {
      x = xmiddle + 110;
    }
  } else {
    x = xmiddle;
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    obstacle.move();
    obstacle.draw();
  }
}

function Obstacle() {
  this.x = random(position);
  this.y = random(-height, 0);
  this.size = 20;
  //this.damagePoint= function{

  //}

  this.move = function() {
    this.y += 3;
    if (this.y > height) {
      this.y = 0;
      this.x = floor(random(position));
    }
  };
  let num = LesObst.length;

  this.draw = function() {
    //fill(255);
    //var van =random(0,3);
    image(LesObst[3], this.x, this.y);
    //text(random(mot), this.x,this.y);
    //ellipse(this.x, this.y, this.size, this.size);


  }
}