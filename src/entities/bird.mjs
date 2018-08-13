import Enemy from "./enemy.mjs";
import FacingSprites from "../behaviors/facingSprites.mjs";
import Animates from "../behaviors/animation.mjs";
import RunsAtPlayer from "../behaviors/runsAtPlayer.mjs";
import TracksPlayer from "../behaviors/trackplayer.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";
import Player from "./player.mjs";
import Wall from "./wall.mjs";
import Vector from "victor";

class Bird extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(TracksPlayer, RunsAtPlayer, Animates, FacingSprites);
    
    this.sprite = Sprite.BIRD.clone();
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.collisionData = 20;
    this.width = 66;
    this.height = 57;
  }
  update(dt) {
    super.update(dt);
    if(this.collidingWith.size > 0) {
      for(let collider of this.collidingWith) {
        if(collider instanceof Player) {
          let isHurt = collider.hurt();
          if(isHurt) {
            let knockback = this.velocity.clone();
            knockback.x *= 20;
            knockback.y *= 20;
            collider.velocity.add(knockback);
          }
        }
      }
    }    
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Bird;