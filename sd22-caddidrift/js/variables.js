let DEBUG = false;

const ROAD_WIDTH = 720; //largeur de la zonne de jeu
const WAY_WIDTH = 200;//largeur des rect de voix
const PLAYER_BACK_TOLERANCE = 70;
const GAME_DURATION = 60;
const GAME_SPEED = 10; // 12 //rapiditerdu  jeus
const WAYS_X = [0, 260, 520];

const WAITING = 0; // ask to bend left
const ONBOARDING_1 = 1; // is bending left, ask to bend right
const ONBOARDING_2 = 2; // is bending right, ask to stay in the middle
const ONBOARDING_3 = 3; // is in the middle: checkout //quand on peut pas tourner
const ONBOARDING_4 = 4; // after checkout: roof view + countdown
const ONBOARDING_5 = 5; // countdown over: outside of the store
const PLAYING = 6; // is playing: starts timer //pas compris se que c'était
const PLAYING_END = 7; // police bareer
const ENDING = 8;

let player;
let game;

let backgrounds = [];
let obstacles = [];
let images = [];
let spritesheets = [];
let animations = [];
let sprites = [];


let imagesList = [ //il faut remplacer tout le magasin
  'magasin',
  'magasin-caisse',
  'magasin-allee',
  'magasin-sortie',
  'route',
  'route-fin',
];

let obstaclesData = { //définie la taille des images obstacles
  'banane': {
    hitzoneY: 80,
    hitzoneHeight: 110,
  },
  'barriere-gauche': {
    hitzoneY: 60,
    hitzoneHeight: 70,
  },
  'barriere-droite': {
    hitzoneY: 60,
    hitzoneHeight: 70,
  },
  'caisse': {
    hitzoneY: 80,
    hitzoneHeight: 160,
  },
  'huile': {
    hitzoneY: 40,
    hitzoneHeight: 120,
  },
};

let obstaclesList = [ //tout les obstacles  à une case
  'banane',
  'caisse',
  'huile',
];

let spritesData = { //définie la vitesse du spreat ???
  'banane': {
    size: [260, 260],
    frames: 3,
    speed: 0.3,
  },
  'caisse': {
    size: [260, 260],
    frames: 8,
    speed: 0.3,
  },
  'huile': {
    size: [260, 260],
    frames: 4,
    speed: 0.3,
  },
  'barriere-gauche': {
    size: [300, 260],
    frames: 4,
    speed: 0.3,
  },
  'barriere-droite': {
    size: [300, 260],
    frames: 4,
    speed: 0.3,
  },
  'caddie': {
    size: [260, 260],
    frames: 4,
    speed: 0.4,//pour ralentir le caddi
  },
  'minus-one': {
    size: [200, 200],
    frames: 5,
    speed: 0.2, //J modif réduit la vitess
  },
};

let stepsBackground = {}
stepsBackground[WAITING] = 'magasin';
stepsBackground[ONBOARDING_1] = 'magasin';
stepsBackground[ONBOARDING_2] = 'magasin';
stepsBackground[ONBOARDING_3] = 'magasin-caisse';
stepsBackground[ONBOARDING_4] = 'magasin-allee';
stepsBackground[ONBOARDING_5] = 'magasin-sortie';
stepsBackground[PLAYING] = 'route';
stepsBackground[PLAYING_END] = 'route-fin';