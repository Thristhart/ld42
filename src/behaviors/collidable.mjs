import entities from "../global/entities.mjs";
import Vector from "victor";

class Collidable {
  static init(entity) {
    entity.collisionType = "circle";
    entity.collisionData = 3; // radius
    entity.collisionOffset = new Vector(0, 0);
    entity.collidingWith = new Set();
  }
  static update(entity) {
    entity.collidingWith.clear();
    for(let i = 0; i < entities.length; i++) {
      let ent = entities[i];
      if(ent === entity) {
        continue;
      }
      if(ent.collisionType) {
        if(ent.collisionType === "circle" && entity.collisionType === "circle") {
          let combinedRadius = ent.collisionData + entity.collisionData;
          let dx = (ent.x + ent.collisionOffset.x) - (entity.x + entity.collisionOffset.x);
          let dy = (ent.y + ent.collisionOffset.y) - (entity.y + entity.collisionOffset.y);
          let isColliding = combinedRadius * combinedRadius > (dx * dx + dy * dy);
          if(isColliding) {
            entity.collidingWith.add(ent);
            ent.collidingWith.add(entity);
            continue;
          }
        }
        entity.collidingWith.delete(ent);
        ent.collidingWith.delete(entity);
      }
    }
  }
}

export default Collidable;