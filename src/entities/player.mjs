import Entity from "./entity.mjs";

import Kinematic from "../behaviors/kinematic.mjs";
import Controllable from "../behaviors/controllable.mjs";
import Friction from "../behaviors/friction.mjs";

import Renderer from "../global/renderer.mjs";

class Player extends Entity {
  constructor(x, y) {
    super();
    this.behaviors = [Kinematic, Friction, Controllable];
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
  }
  draw(dt) {
    Renderer.context.fillRect(this.x - 10, this.y - 10, 20, 20);
  }
}

export default Player;