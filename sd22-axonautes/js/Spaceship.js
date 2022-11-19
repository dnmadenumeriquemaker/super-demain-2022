
function showSpaceship(){
  image(spaceship,width/2,height/2);
}

function showEnergie(){
  if(playerRed.score>=1){
    image(energieonpink, 630, 431);
  }
  else{
    image(energieoffpink, 630, 431);
  }
  if(playerRed.score>=2){
    image(energieonpink, 630, 407);
  }
  else{
    image(energieoffpink, 630, 407);
  }
  if(playerRed.score>=3){
    image(energieonpink, 630, 383);
  }
  else{
    image(energieoffpink, 630, 383);
  }
   if(playerRed.score>=4){
    image(energieonpink, 630, 359);
  }
  else{
    image(energieoffpink, 630, 359);
  }
  if(playerRed.score>=5){
    image(energieonpink, 630, 335);
  }
  else{
    image(energieoffpink, 630, 335);
  }
  if (playerBlue.score>=1){
    image(energieonblue, 650,431);
  }
  else{
    image(energieoffblue,650,431);
  }
  if (playerBlue.score>=2){
    image(energieonblue, 650,407);
  }
  else{
    image(energieoffblue,650,407);
  }
  if (playerBlue.score>=3){
    image(energieonblue, 650,383);
  }
  else{
    image(energieoffblue,650,383);
  }
  if (playerBlue.score>=4){
    image(energieonblue, 650,359);
  }
  else{
    image(energieoffblue,650,359);
  }
  if (playerBlue.score>=5){
    image(energieonblue, 650,335);
  }
  else{
    image(energieoffblue,650,335);
  }
}