import Renderer from "../global/renderer.mjs";
import Animates from "../behaviors/animation.mjs";
import Sprite from "../global/sprites.mjs";
import Entity from "./entity.mjs";
import Collidable from "../behaviors/collidable.mjs";
import BlocksPlayer from "../behaviors/blocksPlayer.mjs";
import Hurtable from "../behaviors/hurtable.mjs";

class Wall extends Entity {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(Animates, Collidable, BlocksPlayer, Hurtable);
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.animation = Sprite.EARTH.WALL_FORM.clone();
    this.animation.events.once("loop", () => {
      this.animation = Sprite.EARTH.WALL;
    })
    this.collisionData = 15;
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Wall;