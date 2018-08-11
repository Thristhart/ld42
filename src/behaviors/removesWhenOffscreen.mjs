import entities from "../global/entities.mjs";
import CONSTANTS from "../global/constants.mjs";

class RemovesWhenOffscreen {
  static init(entity) {

  }
  static update(entity) {
    if(entity.x < 0 || entity.y < 0 ||
       entity.x > CONSTANTS.WIDTH || entity.y > CONSTANTS.HEIGHT) {
      let index = entities.indexOf(entity);
      entities.splice(index, 1);
    }
  }
}

export default RemovesWhenOffscreen;