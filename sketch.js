//Variables for the physics engine
const Engine=Matter.Engine;
const World=Matter.World;
const Body=Matter.Body;
const Bodies=Matter.Bodies;

let engine;
let world;

//Variables for the computer, player, and for the walls confining the player's movements
var computer;

var player;

var wall1;
var wall2;
var wall3;
var wall4;
var wall5;

//Creating variables for the obstacle and the background's images
var backgroundImg;
var backgroundWinImg;
var backgroundLoseImg;
var obstacleImg;
var obstacles=[];

//Creating a gameState variable and setting it to play
var gamestate="play";

var canW;
var canH;
var isPhone;
var fireMissileButton;
var fireMissileButtonImg;
var fireHomingMissileButton;
var fireHomingMissileButtonImg;

function preload() {
  //Loading background image
  backgroundImg=loadImage("background.jpeg");
  backgroundWinImg=loadImage("backgroundWin.jpg");
  backgroundLoseImg=loadImage("backgroundLose.jpg");
  obstacleImg=loadImage("obstacle.png");
  fireMissileButtonImg=loadImage("fireMissile.png");
  fireHomingMissileButtonImg=loadImage("fireHomingMissile.png");
}

function setup() {
  isPhone = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isPhone==true) {
    canW=displayWidth;
    canH=displayHeight;
  }
  else {
    canW=windowWidth;
    canH=windowHeight;
  }

  console.log(canW, canH);

  //Creating the canvas and the physics engine
  createCanvas(canW, canH);

  engine=Engine.create();
  world=engine.world;

  player=new Player(200, canH/2, 10, 10, canW, canH);
  
  computer=new Computer(canW-200, canH/2, 10, 10, canW, canH);
  /*computer.sprite.velocityX=7;
  computer.sprite.velocityY=7;*/
  createComputerMissiles();
  createComputerHomingMissiles();

  //Creating 4 walls to keep the submarines from colliding or going off-screen, and making them all invisible
  wall1=createSprite(0, canH/2, 1, canH*2);
  wall2=createSprite(canW/2, canH/2, 1, canH*2);
  wall3=createSprite(canW/2, 0, canW*2, 1);
  wall4=createSprite(canW/2, canH, canW*2, 1);
  wall5=createSprite(canW, canH/2, 1, canH*2);
  wall1.visible=false;
  wall2.visible=false;
  wall3.visible=false;
  wall4.visible=false;
  wall5.visible=false;

  //fireMissileButton=createSprite(50, canH-120, 50, 50);
  //fireHomingMissileButton=createSprite(50, canH-50, 50, 50);

  fireMissileButton=createSprite((canW*canH*0.00005), canH-(canW*canH*0.00015), 10, 10);
  fireMissileButton.addImage(fireMissileButtonImg);
  fireMissileButton.scale=(canW*canH)*0.00000028;

  fireHomingMissileButton=createSprite((canW*canH*0.00005), canH-(canW*canH*0.00006), 10, 10);
  fireHomingMissileButton.addImage(fireHomingMissileButtonImg);
  fireHomingMissileButton.scale=(canW*canH)*0.00000028;
}

function draw() {
  //Updating the engine
  Engine.update(engine);

  background(backgroundImg);

  //Only calling all these function is the gamestate is play
  if (gamestate=="play") {
    /*createObstacles();
    handleObstacleCollision(player.missiles);
    handleObstacleCollision(player.homingMissiles);*/

    player.controlsForPhones(wall1, wall2, wall3, wall4, wall5, canW, canH);
    player.controlsForNonPhones(wall1, wall2, wall3, wall4, wall5);
    player.handleMissiles();
    player.handleHomingMissiles(computer.sprite);
    player.handleMissileCollision(computer.missiles);
    player.handleMissileCollision(computer.homingMissiles);
    player.handleLife();

    computer.controls(wall1, wall2, wall3, wall4, wall5);
    computer.handleMissiles();
    computer.handleHomingMissiles(player.sprite);
    computer.handleMissileCollision(player.missiles);
    computer.handleMissileCollision(player.homingMissiles);
    computer.handleLife();

    drawSprites();
    
    player.handleLauncher();
    computer.handleLauncher();

    if (player.gamePassed==true) {
      gamestate="pass";
    }
    if (player.gameFailed==true) {
      gamestate="fail";
    }
  }

  if (gamestate=="fail") {
    background(backgroundLoseImg);
    fireMissileButton.destroy();
    fireHomingMissileButton.destroy();
  }

  if (gamestate=="pass") {
    background(backgroundWinImg);
    fireMissileButton.destroy();
    fireHomingMissileButton.destroy();
  }
}

function createComputerMissiles() {
  //Setting the value of the variable to be used in the interval section of the setInterval() function, which defines the gap between 2 callings of the code. If it's random the value will be different each time the game is played (Because the function is called in setup it doesn't update ecery frame)
  var interval=Math.round(random(2000, 3000));
  //Using setInterval() so missiles are launched at "reguler" intervals
  setInterval(function() {
    //Writing the function to be called in the regular intervals, which simply creates a missile, pushes it into the array, increasing the nmissiles by 1, and launching it
    computer.missile=new computerMissile(computer.launcher.body.position.x, computer.launcher.body.position.y, 100, 30, 0);
    computer.missiles.push(computer.missile);
    computer.nMissiles+=1;
    computer.missile.launch();
  }, /*Setting the actual regular interval, somewhere between 2 and 3 seconds*/ interval);
}

function createComputerHomingMissiles() {
  //Same as createComputerMissiles(), except for the homing missiles
  var interval=Math.round(random(5000, 10000));
  setInterval(function() {
    computer.homingMissile=new computerHomingMissile(computer.launcher.body.position.x, computer.launcher.body.position.y, 100, 30, 0);
    computer.homingMissiles.push(computer.homingMissile);
    computer.nHomingMissiles+=1;
  }, interval)
}

function createObstacles() {
  if (frameCount%40==0) {
    var obstacle=createSprite(random(canW/2-30, canW/2+30), random(100, canH-100), 82, 126);
    obstacle.addImage(obstacleImg);
    obstacle.lifetime=60;

    obstacles.push(obstacle);
  }
}

function handleObstacleCollision(missilesArray) {
  for(let i=0; i<missilesArray.length; i++) {
    var loopBreak=false;
    for (let j=0; j<obstacles.length; j++) {
      if (missilesArray.length<=0) {
        loopBreak=true;
        break;
      }
      if(obstacles[j].isTouching(missilesArray[i].sprite)) {
        Matter.World.remove(world, missilesArray[i].body);
        missilesArray[i].sprite.destroy();
        missilesArray.splice(i, 1);
        if (missilesArray.length<=0) {
          loopBreak=true;
          break;
        }
      }
    }
    if (loopBreak==true) {
      break;
    }
  }
}

function keyPressed() {
  //All this only happens if the gamestate is play and isPhone is false, because there are no keys on a phone
  if (gamestate=="play"&&isPhone==false) {
    //If space is pressed a missile is created via the class
    if (keyCode==32) {
      player.createMissiles();
    }

    //If s is pressed a homing missile is created via the class
    if (keyCode==83) {
      player.createHomingMissiles();
    }
  }

  //If the game is over, and the sweetalert shows up, and space is pressed, the game will be restarted because the swal normally disappears if space is pressed
  if (gamestate=="fail") {
    if (keyCode==32) {
      player.gameFail();
    }
  }
  if (gamestate=="pass") {
    if (keyCode==32) {
      player.gamePass();
    }
  }
}

function mousePressed() {
  if (mouseX>(fireMissileButton.x-((fireMissileButton.width/2)+5))&&
  mouseX<(fireMissileButton.x+((fireMissileButton.width/2)+5))&&
  mouseY>(fireMissileButton.y-((fireMissileButton.height/2)+5))&&
  mouseY<(fireMissileButton.y+((fireMissileButton.height/2)+5))) {
    player.createMissiles();
  }
}