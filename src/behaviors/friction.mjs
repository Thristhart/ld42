import CONSTANTS from "../global/constants.mjs"

export default class Friction {
  static init(entity) {
  }
  static update(entity, dt) {
    entity.velocity.x *= CONSTANTS.FRICTION;
    entity.velocity.y *= CONSTANTS.FRICTION;
    if(Math.abs(entity.velocity.x) < 0.0001) {
      entity.velocity.x = 0;
    }
    if(Math.abs(entity.velocity.y) < 0.0001) {
      entity.velocity.y = 0;
    }
  }
}