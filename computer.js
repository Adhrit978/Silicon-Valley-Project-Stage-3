class Computer {
  constructor(x, y, w, h, canW, canH) {
    this.image=loadImage("computerSub.png");
    this.explosionImage=loadImage("explosion.png");

    this.canW=canW;
    this.canH=canH;

    this.sprite=createSprite(x, y, w, h);
    this.sprite.addImage(this.image);
    this.sprite.scale=(this.canW*this.canH*0.00000055);

    this.launcher=new computerLauncher(this.sprite.x+(this.canW*this.canH*0.00003), this.sprite.y-(this.canW*this.canH*0.000035), (this.canW*this.canH*0.0001), (this.canW*this.canH*0.000037));

    this.life=300;

    this.missile;
    this.nMissiles=0;
    this.missiles=[];

    this.homingMissile;
    this.nHomingMissiles=0;
    this.homingMissiles=[];
  }

  handleLauncher() {
    Matter.Body.setPosition(this.launcher.body, {x:this.sprite.x-(this.canW*this.canH*0.000025), y:this.sprite.y-(this.canW*this.canH*0.000033)});
    this.launcher.display();
  }

  //Writing a function for AI and bouncing off the walls
  controls(wall1, wall2, wall3, wall4, wall5) {
      //Making the computer's sub bounce off the walls declared when calling the function, so I don't have to put this code in sketch.js
      this.sprite.bounceOff(wall1);
      this.sprite.bounceOff(wall2);
      this.sprite.bounceOff(wall3);
      this.sprite.bounceOff(wall4);
      this.sprite.bounceOff(wall5);

      //Giving the sub AI
          //Part 1: Making it avoid the player's missiles

          //Part 2: Making it target the player with it's own missiles
  }

  handleMissiles() {
      //Exact same logic here as function missilecount1(), except the position of the text is different and the count is for the computer's missiles
      if (this.nMissiles<65) {
        stroke("black");
        fill("black");
        if (this.nMissiles>=40) {
          stroke("orange");
          fill("orange");
        }
        if (this.nMissiles>=50) {
          stroke("red");
          fill("red");
        }
        textSize(this.canW*this.canH/55150.7);
        text(65-this.nMissiles+" missiles left", width-(this.canW*this.canH*0.00015), (this.canW*this.canH*0.00002));
    
        for (let i=0; i<this.missiles.length; i++) {
          this.missiles[i].display();
          if (this.missiles[i].body.position.x>=width||this.missiles[i].body.position.y>=height||this.missiles[i].body.position.x<=0||this.missiles[i].body.position.y<=0) {
            Matter.World.remove(world, this.missiles[i].body);
            this.missiles.splice(i, 1);
          }
        }
      }
      else {
        fill("red");
        stroke("red");
        textSize(this.canW*this.canH/55150.7);
        text("0 missiles left", width-(this.canW*this.canH*0.00015), (this.canW*this.canH*0.00002));
        for (let i=0; i<this.missiles.length; i++) {
          Matter.World.remove(world, this.missiles[i].body);
          this.missiles.splice(i, 1);
        }
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
        
        text(10-this.nHomingMissiles+" homing missiles left", width-(this.canW*this.canH*0.000215), (this.canW*this.canH*0.00004));
    
        for (let i=0; i<this.homingMissiles.length; i++) {
          this.homingMissiles[i].display();
          this.homingMissiles[i].findTarget(target);
        }
      }
      //This is here for teh same reason the else is there in missilescount2
      else {
        stroke("red");
        fill("red");
        text("0 homing missiles left", width-(this.canW*this.canH*0.000215), (this.canW*this.canH*0.00004));
    
        for (let i=0; i<this.homingMissiles.length; i++) {
          Matter.World.remove(world, this.homingMissiles[i].body);
          this.homingMissiles.splice(i, 1);
        }
      }
  }

  /*goTo(x, y) {
      //Only setting the velocityX if the sprite isn't already where you want it to be
      if (this.sprite.x!=x) {
        //If the desired x is less than the current x of the sprite the velocity will be negative. Otherwise, the velocity will be positive
        if (x<this.sprite.x) {
          this.sprite.velocityX=-5;
        }
        if (x>this.sprite.x) {
          this.sprite.velocityX=+5;
        }
      }
      //Once the desired x is reached the velocityX is set to 0
      else {
        this.sprite.velocityX=0;
      }
      //Again, the velocity will only be non-zero if the current y is not equal to the desired y
      if (this.sprite.y!=y) {
        //Same logic as for setting the x, if the desired y is less than the current y the velocity will be negative, else positive
        if (y<this.sprite.y) {
          this.sprite.velocityY=-5;
        }
        if (y>this.sprite.y) {
          this.sprite.velocityY=+5;
        }
      }
      else {
        this.sprite.velocityY=0;
      }
  }*/

  handleMissileCollision(missilesArray) {
    for (let i=0; i<missilesArray.length; i++) {
      if (missilesArray[i]!=null) {
        var collidedWithSub=dist(missilesArray[i].body.position.x, missilesArray[i].body.position.y, this.x, this.y);
        var collidedWithLauncher=dist(missilesArray[i].body.position.x, missilesArray[i].body.position.y, this.launcher.body.position.x, this.launcher.body.position.y)
        if (collidedWithSub<=(this.canW*this.canH*0.00087)||collidedWithLauncher<(canW*canH*0.00007)) {
          this.life-=10;

          var explosion=createSprite(missilesArray[i].body.position.x, missilesArray[i].body.position.y);
          explosion.addImage(this.explosionImage);
          explosion.scale=(this.canW*this.canH*0.00000025);
          explosion.lifetime=4;

          Matter.World.remove(world, missilesArray[i].body);
          missilesArray[i].sprite.destroy();
          missilesArray.splice(i, 1);
        }
      }
    }
  }

  handleLife() {
    stroke("red");
    fill("red");
    rect(width-(this.canW*this.canH*0.000288), 67.5, 300*(this.canW*this.canH*0.00000085), 22);
    stroke("green");
    fill("green");
    rect(width-(this.canW*this.canH*0.000288), 67.5, this.life*(this.canW*this.canH*0.00000085), 22);
    stroke("black");
    noFill();
    rect(width-(this.canW*this.canH*0.000288), 67.5, 300*(this.canW*this.canH*0.00000085), 22);
  }
}