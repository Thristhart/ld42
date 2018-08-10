class Util {
  static clamp(value, max) {
    let abs = Math.abs(value);
    if(abs > max) {
      return Math.sign(value) * max;
    }
    return value;
  }
}
export default Util;