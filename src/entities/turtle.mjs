import Entity from "./entity.mjs";
import FacingSprites from "../behaviors/facingSprites.mjs";
import Animates from "../behaviors/animation.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";
import Kinematic from "../behaviors/kinematic.mjs";
import Friction from "../behaviors/friction.mjs";
import Collidable from "../behaviors/collidable.mjs";
import ResolveCollisions from "../behaviors/resolveCollisions.mjs";
import CONSTANTS from "../global/constants.mjs";

class Turtle extends Entity {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(Kinematic, Friction, Collidable, ResolveCollisions, Animates, FacingSprites);
    
    this.sprite = Sprite.COOL.clone();
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.collisionData = 20;
    this.width = 120;
    this.height = 128;
    this.timeSinceLastDirectionChange = 0;
    this.timePerDirectionChange = 2000;
  }
  update(dt) {
    super.update(dt);
    this.timeSinceLastDirectionChange += dt;
    if(this.timeSinceLastDirectionChange > this.timePerDirectionChange) {
      this.timeSinceLastDirectionChange = 0;
      this.acceleration.x = -1 + Math.random() * 2;
      this.acceleration.y = -1 + Math.random() * 2;
      this.acceleration.normalize().multiplyScalar(CONSTANTS.ENEMY_ACCEL / 2);
    }
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Turtle;