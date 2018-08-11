import CONSTANTS from "../global/constants.mjs";

class RunsAtPlayer {
  static init(entity) {
  }
  static update(entity) {
    let playerDirection = entity.playerVector.clone().normalize();
    entity.acceleration.x = playerDirection.x * CONSTANTS.ENEMY_ACCEL;
    entity.acceleration.y = playerDirection.y * CONSTANTS.ENEMY_ACCEL;
  }
}

export default RunsAtPlayer;