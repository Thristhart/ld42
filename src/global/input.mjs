import EventEmitter from "events";
import Vector from "victor";
import CONSTANTS from "./constants.mjs";

class Input {
  static attach(canvas) {
    Input.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
    };


    Input.vector = new Vector();
    Input.mouse = new Vector();

    Input.events = new EventEmitter();
    Input.canvas = canvas;
    
    canvas.addEventListener("keydown", Input.onKeydown);
    canvas.addEventListener("keyup", Input.onKeyup);
    canvas.addEventListener("mousemove", Input.onMouseMove);
    canvas.addEventListener("mousedown", Input.onClick);

    Input.events.on("leftStart", () => {
      Input.keys.left = true;
      Input.calculateInputVector();
    });
    Input.events.on("rightStart", () => {
      Input.keys.right = true;
      Input.calculateInputVector();
    });
    Input.events.on("upStart", () => {
      Input.keys.up = true;
      Input.calculateInputVector();
    });
    Input.events.on("downStart", () => {
      Input.keys.down = true;
      Input.calculateInputVector();
    });
    
    Input.events.on("leftEnd", () => {
      Input.keys.left = false;
      Input.calculateInputVector();
    });
    Input.events.on("rightEnd", () => {
      Input.keys.right = false;
      Input.calculateInputVector();
    });
    Input.events.on("upEnd", () => {
      Input.keys.up = false;
      Input.calculateInputVector();
    });
    Input.events.on("downEnd", () => {
      Input.keys.down = false;
      Input.calculateInputVector();
    });
  }

  static onKeydown(event) {
    if(event.code === "KeyA" || event.code === "ArrowLeft") {
      Input.events.emit("leftStart");
    }
    if(event.code === "KeyD" || event.code === "ArrowRight") {
      Input.events.emit("rightStart");
    }
    if(event.code === "KeyW" || event.code === "ArrowUp") {
      Input.events.emit("upStart");
    }
    if(event.code === "KeyS" || event.code === "ArrowDown") {
      Input.events.emit("downStart");
    }
  }
  
  static onKeyup(event) {
    if(event.code === "KeyA" || event.code === "ArrowLeft") {
      Input.events.emit("leftEnd");
    }
    if(event.code === "KeyD" || event.code === "ArrowRight") {
      Input.events.emit("rightEnd");
    }
    if(event.code === "KeyW" || event.code === "ArrowUp") {
      Input.events.emit("upEnd");
    }
    if(event.code === "KeyS" || event.code === "ArrowDown") {
      Input.events.emit("downEnd");
    }
  }

  static onMouseMove(event) {
    let rect = Input.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    Input.mouse.x = x / rect.width * CONSTANTS.WIDTH;
    Input.mouse.y = y / rect.height * CONSTANTS.HEIGHT;
    Input.events.emit("mousemove");
  }
  static onClick(event) {
    Input.events.emit("click");
  }

  static calculateInputVector() {
    Input.vector.x = Input.keys.left * -1 + Input.keys.right * 1;
    Input.vector.y = Input.keys.up * -1 + Input.keys.down * 1;
    if(Input.vector.x && Input.vector.y) {
      Input.vector.normalize();
    }
    return Input.vector;
  }
}

export default Input;