import Enemy from "./enemy.mjs";
import FacingSprites from "../behaviors/facingSprites.mjs";
import Animates from "../behaviors/animation.mjs";
import RunsAtPlayer from "../behaviors/runsAtPlayer.mjs";
import TracksPlayer from "../behaviors/trackplayer.mjs";
import Sprite from "../global/sprites.mjs";
import Renderer from "../global/renderer.mjs";
import Player from "./player.mjs";
import Wall from "./wall.mjs";
import Sounds from "../global/sounds.mjs";

class Charger extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.behaviors.push(TracksPlayer, RunsAtPlayer, Animates, FacingSprites);
    
    this.sprite = Sprite.CHARGER.clone();
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.collisionData = 50;
    this.width = 130;
    this.height = 132;

    this.hp = 3;

    this.chargeStartDuration = "not charging";
    this.charging = false;
    this.hasWhinnied = false;
  }
  update(dt) {
    super.update(dt);
    let dx = Math.abs(this.playerVector.x);
    let dy = Math.abs(this.playerVector.y);
    if(!this.charging && !(this.chargeStartDuration > 0) && dx < this.collisionData / 2) {
      this.chargeStartDuration = 2000;
      this.chargeVector = {x: 0, y: Math.sign(this.playerVector.y) * 1.3};
    }
    if(!this.charging && !(this.chargeStartDuration > 0) && dy < this.collisionData / 2) {
      this.chargeStartDuration = 2000;
      this.chargeVector = {y: 0, x: Math.sign(this.playerVector.x) * 1.3};
    }
    if(this.chargeStartDuration > 0) {
      this.chargeStartDuration -= dt;
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.animation.timePerFrame = 50;
    }
    if(this.chargeStartDuration < 430 && !this.hasWhinnied) {
      Sounds.CHARGER_WHINNY.play();
      this.hasWhinnied = true;
    }
    if(this.chargeStartDuration <= 0 && !this.charging) {
      this.charging = true;
      this.chargeStartDuration = "not charging";
      this.animation.timePerFrame = 100;
      Sounds.CHARGER_CHARGE.play();
      this.hasWhinnied = false;
    }
    if(this.charging) {
      this.velocity.copy(this.chargeVector);
    }
    if(this.charging && (this.position.x < 100 || this.position.y < 0 || this.position.y > 900 || this.position.x > 800)) {
      this.charging = false;
      let angle = this.velocity.angle();
      this.velocity.x = -Math.cos(angle) * 2;
      this.velocity.y = -Math.sin(angle) * 2;
    }
    
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
        if(collider instanceof Wall && this.charging) {
          collider.hurt();
          this.charging = false;
          let angle = this.velocity.angle();
          this.velocity.x = -Math.cos(angle) * 3;
          this.velocity.y = -Math.sin(angle) * 3;
          return;
        }
      }
    }
  }
  draw(dt) {
    this.animation.draw(Renderer.context, this.x, this.y, this.width, this.height);
  }
}

export default Charger;