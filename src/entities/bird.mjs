import Enemy from "./enemy.mjs";
import FacingSprites from "../behaviors/facingSprites.mjs";
import Animates from "../behaviors/animation.mjs";
import RunsAtPlayer from "../behaviors/runsAtPlayer.mjs";
import TracksPlayer from "../behaviors/trackplayer.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";

class Bird extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(TracksPlayer, RunsAtPlayer, Animates, FacingSprites);
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.sprite = Sprite.BIRD.clone();
    this.collisionData = 20;
    this.width = 66;
    this.height = 57;
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Bird;