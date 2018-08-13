import EventEmitter from "events";
let events = new EventEmitter();
const state = {
  circleSize: 1000,
  timescale: 1,
  slowmoSeconds: 2000,
  slowmoCooldown: 0,
  events,
};
export default state;