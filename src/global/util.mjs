class Util {
  static clamp(value, max) {
    let abs = Math.abs(value);
    if(abs > max) {
      return Math.sign(value) * max;
    }
    return value;
  }
  static getMinimumAngleDifference(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);

    return Math.PI - Math.abs(diff - Math.PI);
  }
}
export default Util;