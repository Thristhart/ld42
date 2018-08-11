import Player from "../entities/player.mjs";
import Enemy from "../entities/enemy.mjs";

import Vector from "victor";

class ResolveCollisions {
  static init(entity) {

  }
  static update(entity, dt) {
    if(entity.collidingWith.size > 0) {
      for(let collider of entity.collidingWith) {
        if(collider instanceof Player) {

        }
        if(collider instanceof Enemy) {
          if(entity.collisionType === "circle" && collider.collisionType === "circle") {
            let combinedRadius = entity.collisionData + collider.collisionData;
            let dx = entity.x - collider.x;
            let dy = entity.y - collider.y;
    
            let distanceVector = new Vector(dx, dy);
            let angle = distanceVector.angle();
    
            entity.position.x = Math.cos(angle) * combinedRadius + collider.x;
            entity.position.y = Math.sin(angle) * combinedRadius + collider.y;
            entity.collidingWith.delete(collider);
            collider.collidingWith.delete(entity);
          }
        }
      }
    }
  }
}

export default ResolveCollisions;