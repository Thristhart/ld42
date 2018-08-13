import Util from "../global/util.mjs";

class FacingSprites {
  static init(entity) {
    entity.facing = Math.PI / 2;
    entity.animation = entity.sprite.IDLE_DOWN;
  }
  static update(entity, dt) {
    let moving = !(entity.velocity.x === 0 && entity.velocity.y === 0);
    if(moving) {
      entity.facing = entity.velocity.angle();
    }

    let rightDistance = Util.getMinimumAngleDifference(entity.facing, 0);
    let downDistance = Util.getMinimumAngleDifference(entity.facing, Math.PI / 2);
    let leftDistance = Util.getMinimumAngleDifference(entity.facing, Math.PI);
    let upDistance = Util.getMinimumAngleDifference(entity.facing, -Math.PI / 2);
    let sorted = [rightDistance, downDistance, leftDistance, upDistance].sort();
    let closest = sorted[0];
    if(closest === rightDistance) {
      if(moving) {
        entity.animation = entity.sprite.WALK_RIGHT;
      }
      else {
        entity.animation = entity.sprite.IDLE_RIGHT;
      }
    }
    if(closest === downDistance) {
      if(moving) {
        entity.animation = entity.sprite.WALK_DOWN;
      }
      else {
        entity.animation = entity.sprite.IDLE_DOWN;
      }
    }
    if(closest === leftDistance) {
      if(moving) {
        entity.animation = entity.sprite.WALK_LEFT;
      }
      else {
        entity.animation = entity.sprite.IDLE_LEFT;
      }
    }
    if(closest === upDistance) {
      if(moving) {
        entity.animation = entity.sprite.WALK_UP;
      }
      else {
        entity.animation = entity.sprite.IDLE_UP;
      }
    }
  }
}

export default FacingSprites;