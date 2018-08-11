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

    entity.velocity.limit(entity.maxSpeed, 0.75);
  }
}