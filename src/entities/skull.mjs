import Entity from "./entity.mjs";
import Animates from "../behaviors/animation.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";
import state from "../global/state.mjs";
import CONSTANTS from "../global/constants.mjs";
import Vector from "victor";


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
    this.animation.draw(Renderer.context, this.x, this.y - 15 + Math.sin(state.time / 1000) * 5, this.width, this.height);
  }
  update(dt) {
    super.update(dt);
    let mouseVec = Input.mouse.clone();
    mouseVec.subtract(state.player.position);
    mouseVec.subtract(state.player.collisionOffset);
    if(mouseVec.length() > 60) {
      mouseVec.normalize().multiplyScalar(60);
    }
    mouseVec.add(state.player.position).add(state.player.collisionOffset);
    this.position.copy(mouseVec);
  }
}

export default Skull;