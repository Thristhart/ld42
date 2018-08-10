import Input from "../global/input.mjs";
import CONSTANTS from "../global/constants.mjs";
export default class Controllable {
  static init(entity) {
  }
  static update(entity, dt) {
    entity.acceleration.x = Input.vector.x * CONSTANTS.PLAYER_ACCEL;
    entity.acceleration.y = Input.vector.y * CONSTANTS.PLAYER_ACCEL;
  }
}