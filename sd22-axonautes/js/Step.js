let frameCountSinceStep = 0;

function showStep() {

  // Écran de veille
  if (step == 0) {
    image(ecranveille, width / 2, height / 2);
    image(inserezvosmains, width / 2, 500);
    image(waitvalidationpink, 570, 400);
    image(waitvalidationblue, 720, 400);

    if (playerRed.isHere(dist2)) {
      if (playerRedActive == false) {
        pileattrapee.play();
      }
      playerRedActive = true;
    } else {
      playerRedActive = false;
    }

    if (playerBlue.isHere(dist1)) {
      if (playerBlueActive == false) {
        pileattrapee.play();
      }
      playerBlueActive = true;
    } else {
      playerBlueActive = false;
    }

    if (playerRedActive == true) {
      image(validationpink, 570, 400);
    }

    if (playerBlueActive == true) {
      image(validationblue, 720, 400);
    }

    if (playerRedActive == true && playerBlueActive == true) {
      waitTimer++;
      if (waitTimer > 80) {
        setStep(1);
      }
    } else {
      waitTimer = 0;
    }
  }



  if (step == 1) {
    image(videointro, width / 2, height / 2, width, height);
    playingvideointro = true;
  }



  if (step == 2) {
    game();

    if (fonduStep1Step2 > 0) {
      fonduStep1Step2 -= 4; // vitesse du fonduStep1Step2 blanc
      fill(255, fonduStep1Step2);
      rect(width / 2, height / 2, width, height);
    }

    if (playerRed.score + playerBlue.score == 10) {
      lastGameDuration = int((Date.now() - timerPlayStarted) / 1000);
      setStep(3);
    }

  }




  if (step == 3) {
    image(videofin, width / 2, height / 2, width, height);
    playingvidefin = true;
  }

  // score
  if (step == 4) {
    push();
    background(255);
    
    fill(0);
    textAlign(CENTER);
    textSize(100);
    textFont(futura);
    text("BRAVO!", width / 2, height / 2 - 100);

    textFont(montserrat);
    textSize(40);
    text("Vous avez réussi en " + lastGameDuration + " secondes !", width / 2, height / 2);
    pop();
  }
}

function setStep(newStep) {
  if (step != newStep) {
    frameCountSinceStep = 0;
  }

  step = newStep;

  if (newStep == 0) {
    waitTimer = 0;
    fonduStep1Step2 = 255;
  }

  if (newStep == 1) {
    videointro.play();
    videointro.volume(0);
  }

  if (newStep == 2) {
    initGame();
  } else {
    axogame.stop();
  }

  if (newStep == 3) {
    videofin.play();
    videofin.volume(0);
  }

  if (newStep == 4) {
    timerTimeout = setTimeout(function() {
      setStep(0);
    }, GAME_TIMEOUT * 1000);
  }
}
