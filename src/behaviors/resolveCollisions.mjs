import Player from "../entities/player.mjs";
import Enemy from "../entities/enemy.mjs";

import Wall from "../entities/wall.mjs";

class ResolveCollisions {
  static init(entity) {

  }
  static update(entity, dt) {
    if(entity.collidingWith.size > 0) {
      for(let collider of entity.collidingWith) {
        if(collider instanceof Player) {

        }
        if(collider instanceof Enemy || collider instanceof Wall) {
          if(entity.collisionType === "circle" && collider.collisionType === "circle") {
            let combinedRadius = entity.collisionData + collider.collisionData;
            let dx = (entity.x + entity.collisionOffset.x) - (collider.x + collider.collisionOffset.x);
            let dy = (entity.y + entity.collisionOffset.y) - (collider.y + collider.collisionOffset.y);

            let angle = Math.atan2(dy, dx);
    
            entity.position.x = collider.x + Math.cos(angle) * combinedRadius - entity.collisionOffset.x;
            entity.position.y = collider.y + Math.sin(angle) * combinedRadius - entity.collisionOffset.y;
            
            collider.collidingWith.delete(entity);
          }
        }
      }
    }
  }
}

export default ResolveCollisions;