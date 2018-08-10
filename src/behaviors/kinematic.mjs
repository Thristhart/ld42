import Vector from "victor";
import Util from "../global/util.mjs";

export default class Kinematic {
  static init(entity) {
    entity.acceleration = new Vector();
    entity.velocity = new Vector();
    entity.maxSpeed = 0.5;
  }
  static update(entity, dt) {
    entity.velocity.x += entity.acceleration.x * dt;
    entity.velocity.y += entity.acceleration.y * dt;
    entity.position.x += entity.velocity.x * dt;
    entity.position.y += entity.velocity.y * dt;

    entity.velocity.x = Util.clamp(entity.velocity.x, entity.maxSpeed);
    entity.velocity.y = Util.clamp(entity.velocity.y, entity.maxSpeed);
  }
}