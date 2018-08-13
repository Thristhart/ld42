import Vector from "victor";

class Entity {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.behaviors = [];
    
    this.behaviors.forEach(behavior => {
      behavior.init(this);
    });
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  set x(x) {
    this.position.x = x;
  }
  set y(y) {
    this.position.y = y;
  }
  update(dt) {
    this.behaviors.forEach(behavior => {
      behavior.update(this, dt);
    });
  }
  draw(dt) {
    // stub
  }
}

export default Entity;