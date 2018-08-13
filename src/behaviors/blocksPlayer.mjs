import Player from "../entities/player.mjs";

class BlocksPlayer {
  static init(entity) {

  }
  static update(entity, dt) {
    if(entity.collidingWith.size > 0) {
      for(let collider of entity.collidingWith) {
        if(collider instanceof Player) {
          if(entity.collisionType === "circle" && collider.collisionType === "circle") {
            let combinedRadius = entity.collisionData + collider.collisionData;
            let dx = (entity.x + entity.collisionOffset.x) - (collider.x + collider.collisionOffset.x);
            let dy = (entity.y + entity.collisionOffset.y) - (collider.y + collider.collisionOffset.y);
            dx *= -1;
            dy *= -1;

            let angle = Math.atan2(dy, dx);
    
            collider.position.x = (entity.x + entity.collisionOffset.x) + Math.cos(angle) * combinedRadius - collider.collisionOffset.x;
            collider.position.y = (entity.y + entity.collisionOffset.y) + Math.sin(angle) * combinedRadius - collider.collisionOffset.y;
            entity.collidingWith.delete(collider);
            collider.collidingWith.delete(entity);
          }
        }
      }
    }
  }
}

export default BlocksPlayer;