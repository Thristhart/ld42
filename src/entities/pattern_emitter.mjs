import Entity from "./entity.mjs";
import entities from "../global/entities.mjs";

class PatternEmitter extends Entity {
  constructor(x, y, pattern) {
    super(x, y);
    this.pattern = pattern;
    this.pointer = this.pattern; // start at the root
    this.currentDuration = 0;
    this.iterations = 0;
  }
  update(dt) {
    if(this.pointer.wait && this.currentDuration < this.pointer.wait) {
      this.currentDuration += dt;
      return;
    }
    if(this.pointer.spawn) {
      let x = this.x;
      let y = this.y;
      
      if(this.pointer.spawnOffset) {
        if(this.pointer.spawnOffset.x instanceof Function) {
          x += this.pointer.spawnOffset.x(this.iterations);
        }
        else {
          x += this.pointer.spawnOffset.x;
        }
        
        if(this.pointer.spawnOffset.y instanceof Function) {
          y += this.pointer.spawnOffset.y(this.iterations);
        }
        else {
          y += this.pointer.spawnOffset.y;
        }
      }
      let ent = new this.pointer.spawn(x, y);
      if(this.pointer.behavior) {
        this.pointer.behavior.init(ent);
        ent.behaviors.push(this.pointer.behavior);
      }
      entities.push(ent);
    }
    this.iterations++;
    if(this.pointer.repeat && this.iterations < this.pointer.repeat) {
      this.moveTo(this.pointer);
      return;
    }
    if(this.pointer.next) {
      this.moveTo(this.pointer.next);
      return;
    }
    entities.splice(entities.indexOf(this), 1);
  }
  moveTo(pointer) {
    this.currentDuration = 0;
    if(pointer !== this.pointer) {
      this.iterations = 0;
    }
    this.pointer = pointer;
  }
}

export default PatternEmitter;