import state from "../global/state.mjs";
import Vector from "victor";

class TracksPlayer {
  static init(entity) {
    entity.player = state.player;
    entity.playerVector = new Vector();
  }
  static update(entity) {
    entity.playerVector.x = entity.player.x - entity.x;
    entity.playerVector.y = entity.player.y - entity.y;
  }
}

export default TracksPlayer;