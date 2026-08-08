/**
 * @fileoverview Summary of the script's purpose and functionality.
 * @project      Collector Challenge T2, 2026
 * @author       VORN, Sona <10034343>
 * @Grab & Dash is an underwater collecting game where the player controls a diver to collect pearls while avoiding jellyfish and starfish. The player wins by collecting all the pearls before losing all HP.
 */
// game control
let stage = 0; //keeps track of which function to run

// player
let startX = 400; //diver position at start
let startY = -10;
let p1X = startX;
let p1Y = startY;
let startHP = 4;  //playerhp
let hp = startHP; 

//multimedia
let bb2; // game menu background
let bb; // background image
let diverLeft, diverRight; // diver image
let facing = -1; // -1 = facing left (original), 1 = facing right (flipped)
let diverSound;
let SplashSound;
let gameSound;
let pearlSound;
let goSound;
let winSound;


//pearl
let pearlImg;
let Num_pearl = 20; //set the pearl in game
let pearls=[];
let pearlCount = 0; // how many collected

//jellyfish
let jellyImg;
let Num_jelly = 3; //set the jelly in game
let jellyfish=[];

//seaStar
let seaStarImg;
let Num_seaStar = 9;  //set the sea star in game
let seaStar=[];

//text
let myFont;
let breathe;
let textY;
let textX;



function setup() {
  createCanvas(800, 500);
  textAlign(CENTER);
  //making loop for pearl
  for (let i = 0; i < Num_pearl; i++) {
    pearls.push({
      x: random(30, width - 60),
      y: random(200, height - 30),
      collected: false
    });
  }
  
  //jellyfish
  for (let k = 0; k < Num_jelly; k++) {
    jellyfish.push({
      x: random(30, width - 60),
      y: random(350, height - 100),
      speed: random(0.001,0.01),
      hit: false
    });
  }

  //seaStar
  for (let s = 0; s <  Num_seaStar; s++) {
  seaStar.push({
    x: random(30, width - 60),
    y: random(250, height - 60),
    hit: false,
    speed : random(1,3),
    targetX : true //seastar moves
  });
  }
} //close setup

function draw() {
  
  //call function

  if(stage == 0) {
    if (!SplashSound.isPlaying()){             /////sound plays only on splash
      SplashSound.loop();
    }
    splash(); //Menu
  }else{
    if(SplashSound.isPlaying()){
      SplashSound.stop();
    }
  }
  
  
  if(stage == 1) {
     if (!gameSound.isPlaying()){             /////sound plays only on splash
      gameSound.loop();
    }
    game(); //Game
  }else{
    if(gameSound.isPlaying()){
      gameSound.stop();
    }
  }
  if(stage == 3) {
    if(!winSound.isPlaying()){
      winSound.play();
    }
      win(); //win the game
  }else {
      if(winSound.isPlaying()){
        winSound.stop();
    }
  }
  
  if(stage == 2) {
    if(!goSound.isPlaying()){
      goSound.play();
    }
      gameover(); //play again
  }else {
      if(goSound.isPlaying()){
        goSound.stop();
    }
  }
  
} //close draw



////////////////////////////////////////splash
function splash(){
  // background
  image(bb2, 0, 0, width, height);

  // title
    // Wave text animation
    let textY = sin(frameCount * 0.1) * 2;
    let textX = cos(frameCount * 0.1) * 2;
  
  textFont(myFont);
  fill(255);
  textSize(75);
  //text breathing
   let breathe = 20 + sin(frameCount * 0.04) * 10; //shadow behind the text
  drawingContext.shadowBlur = breathe;
  drawingContext.shadowColor = color (255); 
  textSize(60);
  text('Grab & Dash', width/2, 100 + textY);
  textSize(20);
  text('By SONA, Collector Challenge T2, 2026', width/2, 140 + textY);
  textSize(30);
  text('How to Play', width/2, 220 + textY);
  textSize(18);
  text('Use the Arrow Keys to move the diver around the ocean', width/2, 260 + textY);
  text('Obtain all pearls before time runs out', width/2, 290 + textY);
  text('Avoid hitting the jellyfish', width/2, 320 + textY);
  textSize(26);
  text('PRESS ANY KEY TO PLAY', width/2 + textX, 400 + textY);
  drawingContext.shadowBlur = 0;
  
 }//close splash




///////////////////////////////////////////game
function game(){
  
  // background
  image(bb, 0, 0, width, height);

  
  // diver
    // flipped depending on facing direction
  if (facing === 1) {
    image(diverRight, p1X, p1Y, 120, 120);
  } else {
    image(diverLeft, p1X, p1Y, 120, 120);
  }

  
  // movement
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
    p1X += 3; 
    facing = 1; // moving right -> flip
    }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { 
    p1Y += 3; 
    }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
    p1X -= 3; 
    facing = -1; // moving left
    }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { 
    p1Y -= 3; 
    }

  // keep object in the canvas
  p1X = constrain(p1X, -10, width - 110);
  p1Y = constrain(p1Y, -25, height - 95);

   // pearl
  for (let pearl of pearls){
    
  if (!pearl.collected) {
    image(pearlImg, pearl.x, pearl.y, 30, 30);
  }
     // Collision
  let diverX = p1X + 60;
  let diverY = p1Y + 60;
  let pearlX = pearl.x + 15;
  let pearlY = pearl.y + 15;

  let d = dist(diverX, diverY, pearlX, pearlY);
    //line(diverX, diverY, pearlX, pearlY);
    //text(round(d, 2), pearlX + 10, pearlY); //testing collision

  if (!pearl.collected && d < 56) {
    pearl.collected = true;
    pearlCount++;
    pearlSound.play();
  }
   } //close draw pearl

  //draw jellyfish
  for (let j of jellyfish){
  image(jellyImg, j.x, j.y, 100,100);
    if (p1Y > 0 ) {
    j.x = lerp(j.x, p1X, j.speed);
    j.y = lerp(j.y, p1Y, j.speed);
    }
    
 //collision
  let diverX = p1X + 60;
  let diverY = p1Y + 60;
  let jellyX = j.x + 50;
  let jellyY = j.y + 50;
  let d2 = dist(diverX, diverY, jellyX, jellyY);
  //line(diverX, diverY, jellyX, jellyY);
  //text(round(d2, 2), jellyX + 10, jellyY); //testing collision
  if (!j.hit && d2 < 60) {
    //print("HIT")
    hp --;
    j.hit = true;
    diverSound.play();
    p1X = 400;
    p1Y = -10; //put diver back at start positio when hitting enemy
    
  }
  if (j.hit && d2 > 100) {
    j.hit = false;
  }
    
  } //close jellyfish

  //draw seaStar
  for (let s of seaStar){
      // check edges, and reverse direction if hit the canva
  if (s.x > width - 40) {
    s.targetX = false;              /////hit right wall, turn around
  }
  if (s.x < 0) {
    s.targetX = true;               /////hit left wall, turn around
  }

    //moving seastars
    if (s.targetX) {              
      s.x = s.speed + s.x ;         ////move right
    } else {
      s.x = s.x - s.speed;          ////move left when false
    }
    image(seaStarImg, s.x, s.y, 40, 40); //seastar

    //collision
    let diverX = p1X + 60;
    let diverY = p1Y + 60;
    let ssX = s.x + 20;
    let ssY = s.y + 20;
    let d3 = dist (diverX, diverY, ssX, ssY);
    
    if(!s.hit && d3 < 60){
    hp --;
    s.hit = true;
    diverSound.play();
    p1X = 400;
    p1Y = -10; //put diver back at start positio when hitting enemy
   }

    if(s.hit && d3 > 100){
      s.hit = false;
    }
    
  }//close seaStar

  
  // progress display
  textAlign(LEFT);
  textSize(20);
  stroke(245);
  strokeWeight(1);
  fill(255);
  text('Pearls: ' + pearlCount + ' / ' + Num_pearl, 20, 50);
  text('HP: ' + hp + ' ', 20, 80);
  textAlign(CENTER); 

  //restart game
  if (hp <= 0) {
    stage = 2;
    
  }
  //win game
  if (pearlCount == Num_pearl){
    stage = 3;
    
  }
  
}//close game

//////////////////////////////////////////////gameover
function gameover (){
  
  // background
  image(bb, 0, 0, width, height);

  // sound
  
   // Wave text animation
    let textY = sin(frameCount * 0.1) * 2;
    let textX = cos(frameCount * 0.1) * 2;
    //text breathing
   let breathe = 20 + sin(frameCount * 0.04) * 30; //shadow behind the text
  drawingContext.shadowBlur = breathe;
  drawingContext.shadowColor = color (255); 
  textFont(myFont);
  textAlign(CENTER);
  textSize(60);
  fill(255);
  text('GAME OVER', width / 2 + textX, height / 2 + textY);
  textSize(25);
  text('The jellyfish got you!', width / 2 + textX, height / 2 + 50 + textY );
  text('Press ENTER to play again!', width / 2 + textX, height -150 + 50 + textY );
  text('Press ESC to return to menu', width / 2 + textX, height - 100 + 50 + textY);
  
 drawingContext.shadowBlur = 0;

} //close gameover

//////////////////////////////////////////////win
function win (){
  // background
  image(bb, 0, 0, width, height);
   // Wave text animation
    let textY = sin(frameCount * 0.1) * 2;
    let textX = cos(frameCount * 0.1) * 2;
    //text breathing
   let breathe = 20 + sin(frameCount * 0.04) * 30; //shadow behind the text
  drawingContext.shadowBlur = breathe;
  drawingContext.shadowColor = color (255); 
  textFont(myFont);
  textAlign(CENTER);
  textSize(60);
  fill(255);
  text('YOU DID IT!!', width / 2 + textX, height / 2 + textY);
  textSize(25);
  text('Press ENTER to return', width / 2 + textX, height -150 + 50 + textY );
  
 drawingContext.shadowBlur = 0;

} //close win


////////////////////////////////////function key
function keyPressed() {

  // Splash -> Game
  if (stage == 0) {
    stage = 1;
    resetGame();
  }

  // Game Over → Splash
  if (stage == 2) {
    //press Enter to play agian
    if (keyCode == ENTER) {
      stage = 1;
     resetGame();
    }
    //press ECS for quit game
    if(keyCode == ESCAPE){
      stage = 0;
    }
  }

  // Win -> Splash
  if (stage == 3) {
    if (keyCode == ENTER) {
      stage = 0;
      resetGame();
    }
  }
}

//////////////////////////////////////////resetGame
function resetGame(){
  p1X = startX;
  p1Y = startY;
  hp = startHP;
  pearlCount = 0;
  
  //reset pearls
  for(let pearl of pearls){
    pearl.x = random(30, width - 60);
    pearl.y = random(200, height - 30);
    pearl.collected = false;
  }

  //reset jellyfish
  for(let j of jellyfish){
    j.hit = false;
    j.x = random(30, width -60);
    j.y = random(350, height -60);
  }

  //reset seaStar
  for(let s of seaStar){
    s.x = random(30, width - 60),
    s.y = random(250, height - 60),
    s.hit =  false
  }
}////close resetGame

async function preload(){
  diverLeft = loadImage('IMG_3882.gif');
  diverRight = loadImage ('diverright.gif');
  bb = loadImage('Beaches.gif');
  bb2 = loadImage('lobbu.gif');
  myFont = loadFont('Amarante-Regular.ttf');
  pearlImg = loadImage('clam-pearl.gif');
  jellyImg = loadImage('jellyfish.gif');
  diverSound = loadSound('ow.mp3');
  seaStarImg = loadImage('seastar.gif');
  SplashSound = loadSound('splash.mp3')
  pearlSound = loadSound('collect.mp3');
  gameSound = loadSound('game.mp3');
  goSound = loadSound('gameover.mp3');
  winSound = loadSound('win.mp3');
  
}
