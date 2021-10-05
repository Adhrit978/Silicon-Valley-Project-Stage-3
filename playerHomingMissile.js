class playerHomingMissile {
    //Exact same logic as missile1.js but with a different image, unttil you get to findTarget()
    constructor(x, y, w, h, angle) { 
        var options={
            friction: 1.0,
            restitution: 0.8
        }
        this.width=w;
        this.height=h;
        this.image=loadImage("playerHomingMissile.png");
        this.launched=false;

        this.body=Bodies.rectangle(x, y, this.width, this.height, options);
        Matter.Body.setAngle(this.body, angle);

        World.add(world, this.body);

        this.sprite=createSprite(x, y, w, h);
        this.sprite.visible=false;
        this.sprite.setCollider("rectangle", 0, 0, w, h);
    }

    display() {
        var pos=this.body.position;
        var angle=this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.width, this.height);
        pop();

        this.sprite.x=this.body.position.x;
        this.sprite.y=this.body.position.y;
    }

    //No launch() because the setVelocity would interfere with findTarget(), and this.launched=true; can be put in there too

    //The findTarget() makes this a homing missiles, basically. The logic is the same as in goTo() in sketch.js
    findTarget(target) {
        this.launched=true;

        var pos=this.body.position;

        if (pos.x!=target.x) {
            if (pos.x<target.x) {
                Matter.Body.setVelocity(this.body, {x:+60, y:this.body.velocity.y});
            }
            else {
                Matter.Body.setVelocity(this.body, {x:-60, y:this.body.velocity.y});
            }
        }
        else {
            Matter.Body.setVelocity(this.body, {x:0, y:this.body.velocity.y});
        }

        if (pos.y!=target.y) {
            if (pos.y<target.y) {
                Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:+30});
            }
            else {
                Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:-30});
            }
        }
        else {
            Matter.Body.setVelocity(this.body, {x:this.body.velocity.x, y:0});
        }
    }
}