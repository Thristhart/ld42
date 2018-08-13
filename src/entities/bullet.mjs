import Entity from "./entity.mjs";

import Kinematic from "../behaviors/kinematic.mjs";
import RemovesWhenOffscreen from "../behaviors/removesWhenOffscreen.mjs";
import Collidable from "../behaviors/collidable.mjs";

import Renderer from "../global/renderer.mjs";
import Player from "./player.mjs";
import entities from "../global/entities.mjs";
import Wall from "./wall.mjs";
import state from "../global/state.mjs";

class Bullet extends Entity {
  constructor(x, y) {
    super(x, y);
    this.behaviors = [Kinematic, RemovesWhenOffscreen, Collidable];
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });
    this.collisionData = 10;
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
    if(this.collidingWith.size > 0) {
      for(let collider of this.collidingWith) {
        if(collider instanceof Player) {
          if(collider.hurt()) {
            entities.splice(entities.indexOf(this), 1);
            return;
          }
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
    Renderer.context.fillStyle = state.currentLevel.circleColor;
    Renderer.context.beginPath(this.x, this.y)
    Renderer.context.arc(this.x, this.y, 8, 0, Math.PI * 2);
    Renderer.context.fill();
  }

  static shootAt(entity, x, y) {
    let bullet = new Bullet(x, y);
    let vecToTarget = entity.position.clone()
      .subtract(bullet.position)
      .normalize();
    vecToTarget.x *= 0.3;
    vecToTarget.y *= 0.3;
    bullet.maxSpeed = 2;
    bullet.velocity.copy(vecToTarget);
    return bullet;
  }
}

export default Bullet;