function checkStep() {
  if (step == 0) {
    image(ecranveille, width / 2, height / 2);
    image(inserezvosmains, width / 2, 500);
    image(waitvalidationpink, 600, 400);
    image(waitvalidationblue, 740, 400);

    if (playerRedActive == true) {
      image(validationpink, 600, 400);
    }

    if (playerBlueActive == true) {
      image(validationblue, 740, 400);
    }

    if (playerRedActive == true && playerBlueActive == true) {
      waitTimer++;
      if (waitTimer > 120) {
        setStep(1);
      }
    } else {
      waitTimer = 0;
    }
  }

  if (step == 1) {
    image(videointro,width/2,height/2);
    playingvideointro = true;
  }
  
  if (step == 2){
    game();
    if (fondu > 0){
      fondu -= 1;
      fill(255,fondu);
      rect(width/2,height/2,width,height);
    }
    if (playerRed.score + playerBlue.score == 10){
        setStep(3);
      
    }
  }
  if (step == 3){
     image(videofin, width/2, height/2);
    playingvidefin = true;
  }

}

function setStep(newStep) {
  step = newStep;

  if (newStep == 1) {
    videointro.play();
    videointro.volume(0);
  }
  if (newStep == 3){
    videofin.play();
    videofin.volume(0);
  }
}

