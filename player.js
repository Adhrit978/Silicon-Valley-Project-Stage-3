class Player {
  constructor(x, y, w, h, canW, canH) {
      this.image=loadImage("playerSub.png");
      this.explosionImage=loadImage("explosion.png");
      this.upArrowImage=loadImage("upArrow.png");
      this.downArrowImage=loadImage("downArrow.png");
      this.leftArrowImage=loadImage("leftArrow.png");
      this.rightArrowImage=loadImage("rightArrow.png");

      this.canW=canW;
      this.canH=canH;

      this.sprite=createSprite(x, y, w, h);
      this.sprite.addImage(this.image);
      this.sprite.scale=(this.canW*this.canH*0.00000055);

      this.launcher=new playerLauncher(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000035), (this.canW*this.canH*0.0001), (this.canW*this.canH*0.000037));

      this.life=200;
      
      this.gameFailed=false;
      this.gamePassed=false;

      this.missile;
      this.nMissiles=0;
      this.missiles=[];

      this.homingMissile;
      this.nHomingMissiles=0;
      this.homingMissiles=[];

      this.upArrow=createSprite(this.canW-(this.canW*this.canH*0.00013), this.canH-(this.canW*this.canH*0.000165), 60, 60);
      this.upArrow.addImage(this.upArrowImage);
      this.upArrow.scale=(this.canW*this.canH*0.00000027);

      this.downArrow=createSprite(this.canW-(this.canW*this.canH*0.00013), this.canH-(this.canW*this.canH*0.00006), 50, 50);
      this.downArrow.addImage(this.downArrowImage);
      this.downArrow.scale=(this.canW*this.canH*0.00000027);

      this.leftArrow=createSprite(this.canW-(this.canW*this.canH*0.000187), this.canH-(this.canW*this.canH*0.000113), 50, 50);
      this.leftArrow.addImage(this.leftArrowImage);
      this.leftArrow.scale=(this.canW*this.canH*0.000000268);

      
      this.rightArrow=createSprite(this.canW-(this.canW*this.canH*0.000074), this.canH-(this.canW*this.canH*0.000113), 50, 50);
      this.rightArrow.addImage(this.rightArrowImage);
      this.rightArrow.scale=(this.canW*this.canH*0.00000027);
  }

  handleLauncher() {
      Matter.Body.setPosition(this.launcher.body, {x:this.sprite.x+(this.canW*this.canH*0.00003), y:this.sprite.y-(this.canW*this.canH*0.000035)});
      this.launcher.display();
  }

  controlsForNonPhones(wall1, wall2, wall3, wall4, wall5) {
    //Making the sub move with the arrow keys
    if (keyDown(RIGHT_ARROW)) {
        this.sprite.x+=4;
    }
    
    if (keyDown(LEFT_ARROW)) {
        this.sprite.x-=4;
    }
      
    if (keyDown(UP_ARROW)) {
        this.sprite.y-=4;
    }
      
    if (keyDown(DOWN_ARROW)) {
        this.sprite.y+=4;
    }

    //Making the player's sub bounce off the walls declared when calling the function, so I don't have to put this code in sketch.js
    this.sprite.bounceOff(wall1);
    this.sprite.bounceOff(wall2);
    this.sprite.bounceOff(wall3);
    this.sprite.bounceOff(wall4);
    this.sprite.bounceOff(wall5);
  }

  controlsForPhones(wall1, wall2, wall3, wall4, wall5) {
   
    if (mousePressedOver(this.upArrow)) {
      this.sprite.y-=4;
    }

    if (mousePressedOver(this.downArrow)) {
      this.sprite.y+=4;
    }

    if (mousePressedOver(this.leftArrow)) {
      this.sprite.x-=4;
    }

    if (mousePressedOver(this.rightArrow)) {
      this.sprite.x+=4;
    }

     //Making the player's sub bounce off the walls declared when calling the function, so I don't have to put this code in sketch.js
     this.sprite.bounceOff(wall1);
     this.sprite.bounceOff(wall2);
     this.sprite.bounceOff(wall3);
     this.sprite.bounceOff(wall4);
     this.sprite.bounceOff(wall5);
  }

  createMissiles() {
    //THis only happens if there are less than 65 missiles launched
    if (this.nMissiles<65) {
      //Creating the missile, adding it to the array, increasing the nMissiles by 1, and launching the missile
      this.missile=new playerMissile(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000037), (this.canW*this.canH*0.00008), (this.canW*this.canH*0.000027), 0);
      this.missiles.push(this.missile);
      this.nMissiles+=1;
      this.missile.launch();
    }
  }

  handleMissiles() {
    //Only doing all this if there are less than 65 missiles launched
    if (this.nMissiles<65) {
        //Setting the text colour to black
        stroke("black");
        fill("black");
        //Setting the text colour to orange if there are less than 25 missiles left
        if (this.nMissiles>=40) {
        stroke("orange");
        fill("orange");
        }
        //Setting the text colour to red is there are less than 15 missiles left
        if (this.nMissiles>=50) {
        stroke("red");
        fill("red");
        }
        //Setting the text size and actually writing the text
        textSize(20);
        text(65-this.nMissiles+" missiles left", 15, 30);

        //Displaying all missiles launched and destroying the missile and splicing the missiles array is the missiles goes off-screen
        for (let i=0; i<this.missiles.length; i++) {
          this.missiles[i].display();
          if (this.missiles[i].body.position.x>=width||this.missiles[i].body.position.y>=height||this.missiles[i].body.position.x<=0||this.missiles[i].body.position.y<=0) {
            Matter.World.remove(world, this.missiles[i].body);
            this.missiles[i].sprite.destroy();
            this.missiles.splice(i, 1);
          }
        }
    }
    //writing else to show 0 missiles left in red if all missiles are used
    else {
        stroke("red");
        fill("red");
        textSize(20);
        text("0 missiles left", 15, 30);
    }
  }

  createHomingMissiles() {
    //Only doing this if there are less than 10 homing missiles already launched
    if (this.nHomingMissiles<10) {
      //Creating the missile, adding it to the array, and increasing the nHomingMissiels by 1
      this.homingMissile=new playerHomingMissile(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000037), (this.canW*this.canH*0.00014), (this.canW*this.canH*0.00003), 0);
      this.homingMissiles.push(this.homingMissile);
      this.nHomingMissiles+=1;
    }
  }

  handleHomingMissiles(target) {
    if (this.nHomingMissiles<10) {
        stroke("black");
        fill("black");
    
        if (this.nHomingMissiles>=3) {
          stroke("orange");
          fill("orange");
        }
    
        if (this.nHomingMissiles>=6) {
          stroke("red");
          fill("red");
        }
    
        text(10-this.nHomingMissiles+" homing missiles left", 15, 50);
    
        for (let i=0; i<this.homingMissiles.length; i++) {
          this.homingMissiles[i].display();
          //The findTarget had to be put here because the if conditions need to be constantly updated, for which it needs to be called in draw, same ad display().
          this.homingMissiles[i].findTarget(target);
        }
        //No need to remove the homing missile if it goes off-screen because that is impossible, the homing missile will just find the target
      }
      //Writing an 0 missiles left in red if all homing missiles are used
      else {
        stroke("red");
        fill("red");
        textSize(20);
        text("0 homing missiles left", 15, 50);
      }
  }

  handleMissileCollision(missilesarray) {
    for (let i=0; i<missilesarray.length; i++) {
      if (missilesarray[i]!=null) {
        var collidedWithSub=dist(missilesarray[i].body.position.x, missilesarray[i].body.position.y, this.x, this.y);
        var collidedWithLauncher=dist(missilesarray[i].body.position.x, missilesarray[i].body.position.y, this.launcher.body.position.x, this.launcher.body.position.y)
        if (collidedWithSub<=(this.canW*this.canH*0.00087)||collidedWithLauncher<=(canW*canH*0.00007)) {
          this.life-=10;
          var explosion=createSprite(missilesarray[i].body.position.x, missilesarray[i].body.position.y);
          explosion.addImage(this.explosionImage);
          explosion.scale=0.35;
          explosion.lifetime=4;

          Matter.World.remove(world, missilesarray[i].body);
          missilesarray.splice(i, 1);
        }
      }
    }
  }

  handleLife() {
    noStroke();
    fill("red");
    rect((this.canW*this.canH*0.000015), (this.canW*this.canH*0.000045), 200*((this.canW*this.canH)/1369014), 15*((this.canW*this.canH)/1369014))
    fill("green");
    rect((this.canW*this.canH*0.000015), (this.canW*this.canH*0.000045), this.life*((this.canW*this.canH)/1369014), 15*((this.canW*this.canH)/1369014));
    stroke("black");
    noFill();
    rect((this.canW*this.canH*0.000015), (this.canW*this.canH*0.000045), 200*((this.canW*this.canH)/1369014), 15*((this.canW*this.canH)/1369014));

    if (this.life==0) {
      this.gameFailed=true;
      this.gameFail();
    }

    if (computer.life==0) {
      this.gamePassed=true;
      this.gamePass();
    }
  }

  gamePass() {
    swal(
      {
        title: `You win :)`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/sub.png",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }

  gameFail() {
    swal(
      {
        title: `You lose :(`,
        imageUrl:"https://raw.githubusercontent.com/Adhrit978/image/main/sub2.png",
        imageSize: "222x222",
        confirmButtonText: 'Play again'
      },
      function (isConfirm) {
        if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
  }
}