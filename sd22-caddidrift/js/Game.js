class Game {
  constructor() {
    this.step;
    this.timer;
    this.timeCurrent;
    this.timeMax;
    this.timeFramecountStart;
    this.nextBackground;
    this.nextStep;
    this.timerBeforeNextAction;
    this.frameCountOfStep;
  }

  init() {
    this.step = WAITING;
    clearInterval(this.timer);
    this.timer = null;
    this.timeCurrent = 0;
    this.timeMax = GAME_DURATION;
    this.timeFramecountStart = 0;
    this.nextBackground = 'magasin';
    this.nextStep = null;
    player.hitCount = 0;
    clearTimeout(this.timerBeforeNextAction);
    this.timerBeforeNextAction = null;
    this.frameCountOfStep = 0;
    obstacles = [];
    this.initBackground();
  }

  tick() {
    this.timeCurrent++;

    if (this.timeCurrent >= this.timeMax - 5) {
      this.setNextStep(PLAYING_END);
    }

    /*
    if (this.timeCurrent >= this.timeMax) {
      this.end();
    }
    */
  }

  start() {
    this.timeFramecountStart = frameCount;

    let _this = this;
    this.timer = setInterval(function() {
      _this.tick();//on vérifis chaque x on rajoute et on vérifies ...
    }, 1000); //pour attendre 1sec/ on remet à 0 le chrono?
  }

  update() {
    if (this.is(PLAYING)) {
      // No obstacles
      if (this.timeCurrent <= .5) {
        // Wait a little for the first obstacle
      }

      // Some obstacles
      else if (this.timeCurrent <= 15) {
        if ((frameCount - this.timeFramecountStart) % 80 == 0) {
          this.createObstacle();
        } //frameCount permet de un compteur ( à une vitesse donner) mais la quel ???
      }

      // More obstacles
      else if (this.timeCurrent <= 30) {
        if ((frameCount - this.timeFramecountStart) % 60 == 0) {
          this.createObstacle();
        }
      }

      // Two obstacles at the same time
      else if (this.timeCurrent <= 40) {
        if ((frameCount - this.timeFramecountStart) % 85 == 0) { //plus le % est grand plus c' simple

          let wayLeft = 0;

          if (Math.random() < 0.5) {
            wayLeft = 1; //permte un random sur la position ses barière une chance sur 2 qu'il soit sur la voit de D ou G 
          }

          /*
          let possibleWays = [0, 1, 2];
          possibleWays = possibleWays.sort((a, b) => 0.5 - Math.random());
          */

          this.createObstacle('barriere-gauche', wayLeft);
          this.createObstacle('barriere-droite', wayLeft + 1);
        }
      }

      // Last mile
      else if (this.timeCurrent <= this.timeMax - 5) {
        if ((frameCount - this.timeFramecountStart) % 55 == 0) {
          this.createObstacle();
        }
      }

      // End of game
      else {
        // No obstacle before game ends
      }
    }


    if (this.is(PLAYING_END)) {
      // Obstacle du background (barrière de police)
      if (this.getCurrentBackground().y >= GAME_END_HITZONE_Y) {
        this.setStep(ENDING);
      }
    }
  }

  /*
  end() {
    clearInterval(this.timer);//retire le timer 
    this.timer = null;
    this.setStep(ENDING);
  }q
  */

  show() {
    rectMode(CORNER);

    if (DEBUG) {
      push();
      translate((width - ROAD_WIDTH) / 2, 0);
      if (player.way == 0) fill('red'); else fill('#C7ECF7');
      rect(WAYS_X[0], 0, WAY_WIDTH, height);
      if (player.way == 1) fill('red'); else fill('#C7ECF7');
      rect(WAYS_X[1], 0, WAY_WIDTH, height);
      if (player.way == 2) fill('red'); else fill('#C7ECF7');
      rect(WAYS_X[2], 0, WAY_WIDTH, height);
      pop();
    }

  }

  showHUD() {

    /*
    let progressionBarMargin = 30;

    fill(255);
    //rect(progressionBarMargin, progressionBarMargin + 40, width - progressionBarMargin * 2, 10);

    image(images['barre-timer'], progressionBarMargin, progressionBarMargin + 40);

    let time = map(this.timeCurrent, 0, this.timeMax + 1, 60, width - progressionBarMargin * 2 - 90);

    fill('#D33573');
    rect(progressionBarMargin + 7, progressionBarMargin + 52, time, 8);

    image(images['mini-caddie'], time, progressionBarMargin - 20);
    */
  }

  setStep(step) {
    let _this = this;

    if (step != this.step) {
      this.frameCountOfStep = 0;
    }

    this.step = step;
    this.nextStep = null;

    if (step == WAITING) {
      // triggered once
      game.init();
    }

    if (step == ONBOARDING_1) {
      // triggered once

    }

    if (step == ONBOARDING_2) {
      // triggered once

    }

    if (step == ONBOARDING_3) {
      this.timerBeforeNextAction = setTimeout(function() {
        _this.setNextStep(ONBOARDING_4);
        clearTimeout(this.timerBeforeNextAction);
      }, 500);
    }

    if (step == ONBOARDING_4) {
      clearTimeout(this.timerBeforeNextAction);
      this.timerBeforeNextAction = setTimeout(function() {
        _this.setNextStep(ONBOARDING_5);
        clearTimeout(this.timerBeforeNextAction);
      }, 3000);
    }

    if (step == ONBOARDING_5) {
      clearTimeout(this.timerBeforeNextAction);//il arrête se qu'il y a dans ses parantaise
      this.timerBeforeNextAction = setTimeout(function() {
        _this.setNextStep(PLAYING);
        clearTimeout(this.timerBeforeNextAction);
      }, 500);
    }

    if (step == PLAYING) {
      // triggered once
      this.nextBackground = 'route';
      this.start();
      clearTimeout(this.timerBeforeNextAction);
    }

    if (step == ENDING) {
      // triggered once
      clearInterval(this.timer);
      clearTimeout(this.timerBeforeNextAction);
      backgrounds = [];

      // TODO: impression ticket
    }
  }

  setNextStep(nextStep) {
    if (DEBUG) {
      console.log('setNextStep', nextStep);
    }
    this.nextStep = nextStep;
    this.nextBackground = stepsBackground[nextStep];
  }

  is(step) {
    return this.step == step;
  }

  amende() {
    return 10000 - constrain(player.hitCount * 150, 0, 9800);
  }

  createObstacle(type = null, way = null) {
    obstacles.push(new Obstacle(type, way));
  }

  createBackground(imageName, offset) {
    backgrounds.push(new Background(imageName, offset));
  }

  initBackground() {
    backgrounds = [];
    this.createBackground(this.nextBackground, height);
  }

  getCurrentBackground() {
    return backgrounds[backgrounds.length - 1];
  }

  updateBackground() {
    if (backgrounds.length > 0) {
      let currentBackground = this.getCurrentBackground();

      if (currentBackground.isReadyForNextBackground()) {
        let nextStep = this.nextStep;

        if (nextStep != null) {
          this.setStep(nextStep);
        }

        this.createBackground(
          this.nextBackground,
          currentBackground.getOffsetForNextBackground());
      }
    } else {
      this.createBackground('magasin', height);
      this.nextBackground = 'magasin';
    }
  }

  showBackground() {
    for (let i = backgrounds.length - 1; i >= 0; i--) {
      let background = backgrounds[i];

      if (!background.isVisible()) {
        backgrounds.splice(i, 1);
        continue;
      }
      background.update();
      background.show();
    }
  }

  forceStep(step) {
    game.init();
    backgrounds = [];
    game.createBackground(stepsBackground[step], height);
    game.setStep(step);
  }
}
