let frameCountSinceStep = 0;

function showStep() {

  // Écran de veille
  if (step == 0) {
    image(ecranveille, width / 2, height / 2);
    image(inserezvosmains, width / 2, 500);
    image(waitvalidationpink, 600, 400);
    image(waitvalidationblue, 740, 400);

    playerRedActive = false;
    playerBlueActive = false;

    if (playerRed.isHere(dist1)) {
      playerRedActive = true;
    }

    if (playerBlue.isHere(dist2)) {
      playerBlueActive = true;
    }

    if (playerRedActive == true) {
      image(validationpink, 600, 400);
    }

    if (playerBlueActive == true) {
      image(validationblue, 740, 400);
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
      setStep(3);
    }
  }



  if (step == 3) {
    image(videofin, width / 2, height / 2, width, height);
    playingvidefin = true;
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
  }

  if (newStep == 3) {
    videofin.play();
    videofin.volume(0);
  }
}

