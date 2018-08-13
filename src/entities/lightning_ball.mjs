import Renderer from "../global/renderer.mjs";
import Animates from "../behaviors/animation.mjs";
import Bullet from "./bullet.mjs";
import Sprite from "../global/sprites.mjs";
import Vector from "victor";
import Enemy from "./enemy.mjs";
import Sounds from "../global/sounds.mjs";
import Wall from "./wall.mjs";

class LightningBall extends Bullet {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(Animates);
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.animation = Sprite.LIGHTNING.BALL.clone();
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
    if(this.collidingWith.size > 0) {
      for(let collider of this.collidingWith) {
        if(collider instanceof Enemy) {
          Sounds.LIGHTNING_HIT.play();
          entities.splice(entities.indexOf(this), 1);
          collider.hurt();
          return;
        }
        if(collider instanceof Wall) {
          entities.splice(entities.indexOf(this), 1);
          collider.hurt();
          return;
        }
      }
    }
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }

  static shootAt(targetX, targetY, x, y) {
    let bullet = new LightningBall(x, y);
    let vecToTarget = new Vector(targetX, targetY)
      .subtract(bullet.position)
      .normalize();
    vecToTarget.x *= 0.3;
    vecToTarget.y *= 0.3;
    bullet.maxSpeed = 2;
    bullet.velocity.copy(vecToTarget);
    return bullet;
  }
}

export default LightningBall;