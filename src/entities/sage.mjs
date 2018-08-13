import Enemy from "./enemy.mjs";
import FacingSprites from "../behaviors/facingSprites.mjs";
import Animates from "../behaviors/animation.mjs";
import RunsAtPlayer from "../behaviors/runsAtPlayer.mjs";
import TracksPlayer from "../behaviors/trackplayer.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";
import Player from "./player.mjs";
import Vector from "victor";
import CONSTANTS from "../global/constants.mjs";
import state from "../global/state.mjs";
import entities from "../global/entities.mjs";
import Bullet from "./bullet.mjs";

class Sage extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(TracksPlayer, Animates);
    
    this.sprite = Sprite.SAGE.clone();
    this.animation = Sprite.SAGE.CAST;
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.collisionData = 20;
    this.width = 52;
    this.height = 72;
    this.lifetime = 0;
    this.id = state.sageID++;
    this.shootCooldown = 1000;
  }
  update(dt) {
    super.update(dt);
    this.lifetime += dt;
    let angle = Math.PI * 2 * this.lifetime / 12000;
    angle = angle % (Math.PI * 2);

    let sages = entities.filter(e => e instanceof Sage);
    sages.sort((a, b) => a.id - b.id);

    angle += ((Math.PI * 2) / sages.length) * sages.indexOf(this);
    let target = new Vector();

    target.x = CONSTANTS.WIDTH / 2 + Math.cos(angle) * state.circleSize * 1.2;
    target.y = CONSTANTS.HEIGHT / 2 + Math.sin(angle) * state.circleSize * 1.2;

    target.subtract(this.position);

    let distance = target.length();
    target.normalize();
    if(distance > 10) {
      target.multiplyScalar(0.4);
    }
    else {
      target.multiplyScalar(0.1);
    }

    this.velocity.copy(target);

    if(this.shootCooldown > 0) {
      this.shootCooldown -= dt;
    }
    if(this.shootCooldown <= 0) {
      this.shootCooldown = 3000;
      let bullet = Bullet.shootAt(state.player, this.x, this.y);
      entities.push(bullet);
    }
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Sage;