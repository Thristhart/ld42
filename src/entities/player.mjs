import Entity from "./entity.mjs";

import Renderer from "../global/renderer.mjs";
import state from "../global/state.mjs";
import CONSTANTS from "../global/constants.mjs";

import Vector from "victor";
import Sprite from "../global/sprites.mjs";

import Kinematic from "../behaviors/kinematic.mjs";
import Controllable from "../behaviors/controllable.mjs";
import Friction from "../behaviors/friction.mjs";
import Collidable from "../behaviors/collidable.mjs";
import FacingSprites from "../behaviors/facingSprites.mjs";
import Animates from "../behaviors/animation.mjs";
import Hurtable from "../behaviors/hurtable.mjs";
import UI from "../global/ui.mjs";
import Sounds from "../global/sounds.mjs";

class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.behaviors = [Kinematic, Friction, Controllable, Collidable, Animates, FacingSprites, Hurtable];

    this.width = 52;
    this.height = 72;

    this.facing = Math.PI / 2;

    this.sprite = Sprite.MAGE;
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.collisionData = 10;
    this.collisionOffset.y = 18;
    this.hp = 15;
  }
  hurt() {
    if(this.invincibleDuration > 0) {
      return;
    }
    this.invincibleDuration = 900; // iframes when taking damage
    
    this.hp--;
    UI.setHP(this.hp);
    Sounds.OUCH.play();
    if(this.hp <= 0) {
      this.die();
    }
    return true;
  }
  die() {
    state.timescale = 0.2;
    state.slowmoSeconds = 2000;
    state.dying = true;
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
    if(this.invincibleDuration > 0) {
      this.invincibleDuration -= dt;
    }
      
    // keep player within circle
    let combinedRadius = state.circleSize - (this.collisionData * 2);
    let dx = (this.x + this.collisionOffset.x) - CONSTANTS.WIDTH / 2;
    let dy = (this.y + this.collisionOffset.y) - CONSTANTS.HEIGHT / 2;
    let outOfCircle = combinedRadius * combinedRadius < (dx * dx + dy * dy);
    if(outOfCircle) {
      let distanceVector = new Vector(dx, dy);
      let angle = distanceVector.angle();
      this.position.x = Math.cos(angle) * combinedRadius + CONSTANTS.WIDTH / 2 - this.collisionOffset.x;
      this.position.y = Math.sin(angle) * combinedRadius + CONSTANTS.HEIGHT / 2 - this.collisionOffset.y;
    }
  }
  draw(dt) {
    if(this.invincibleDuration > 0) {
      if(this.invincibleDuration % 200 <= 50) {
        return; // blink while invincible
      }
    }
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Player;