import CONSTANTS from "../global/constants.mjs"

export default class Friction {
  static init(entity) {
  }
  static update(entity, dt) {
    entity.velocity.x *= CONSTANTS.FRICTION;
    entity.velocity.y *= CONSTANTS.FRICTION;
  }
}