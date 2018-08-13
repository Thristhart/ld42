import Entity from "./entity.mjs";
import Animates from "../behaviors/animation.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";
import state from "../global/state.mjs";

class Skull extends Entity {
  constructor(x, y) {
    super(x, y);
    this.startY = y;
    this.behaviors.push(Animates);
    this.animation = Sprite.DARKNESS.SKULL;
    this.width = 96;
    this.height = 96;
  }
  draw() {
    this.animation.draw(Renderer.context, this.x, this.y - 80 + Math.sin(state.time / 1000) * 12, this.width, this.height);
  }
}

export default Skull;