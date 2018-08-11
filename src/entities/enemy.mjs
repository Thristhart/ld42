import Entity from "./entity.mjs";
import Renderer from "../global/renderer.mjs";

import Vector from "victor";

import Kinematic from "../behaviors/kinematic.mjs";
import Friction from "../behaviors/friction.mjs";
import Collidable from "../behaviors/collidable.mjs";
import TracksPlayer from "../behaviors/trackplayer.mjs";
import RunsAtPlayer from "../behaviors/runsAtPlayer.mjs";
import ResolveCollisions from "../behaviors/resolveCollisions.mjs";

class Enemy extends Entity {
  constructor(x, y) {
    super(x, y);
    this.behaviors = [Kinematic, Friction, Collidable, ResolveCollisions];
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });

    this.collisionData = 20;
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
  }
  draw(dt) {
    if(this.collidingWith.size > 0) {
      Renderer.context.fillStyle = "peachpuff";
    }
    else {
      Renderer.context.fillStyle = "black";
    }
    Renderer.context.beginPath();
    Renderer.context.arc(this.x, this.y, 20, 0, Math.PI * 2);
    Renderer.context.fill();
  }
}

export default Enemy;