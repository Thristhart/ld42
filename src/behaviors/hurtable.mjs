import entities from "../global/entities.mjs";

class Hurtable {
  static init(entity) {
    entity.hp = 1;
    entity.hurt = entity.hurt || function() {
      entity.hp--;
      if(entity.hp <= 0) {
        entity.die();
      }
      return true;
    };
    entity.die = entity.die || function() {
      entities.splice(entities.indexOf(entity), 1);
    };
  }
  static update(entity, dt) {

  }
}

export default Hurtable;