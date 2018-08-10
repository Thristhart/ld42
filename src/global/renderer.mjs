class Renderer {
  static init(canvas) {
    Renderer.canvas = canvas;
    Renderer.context = Renderer.canvas.getContext("2d");
  }
  static beginDraw(dt) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // TODO: camera shit?
  }

  static endDraw(dt) {
    // TODO: camera shit?
  }
}

export default Renderer;