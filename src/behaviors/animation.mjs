class Animates {
  static init(entity) {

  }
  static update(entity, dt) {
    if(!entity.animation) {
      return;
    }
    entity.animation.timeSinceLastFrame += dt;
    if(entity.animation.timeSinceLastFrame > entity.animation.timePerFrame) {
      entity.animation.nextFrame();
    }
  }
}

export default Animates;