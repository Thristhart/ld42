let canvas = document.getElementById("display");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);

resize();


import Input from "./global/input.mjs";
import Renderer from "./global/renderer.mjs";
Input.attach(canvas);
Renderer.init(canvas);

let entities = [];

let lastUpdateTime;
function gameloop(timestamp) {
  requestAnimationFrame(gameloop);

  if(!lastUpdateTime) {
    lastUpdateTime = timestamp;
  }

  let dt = lastUpdateTime - timestamp;
  Renderer.beginDraw(dt);
  entities.forEach(ent => {
    ent.update(dt);
    ent.draw(dt);
  });
  Renderer.endDraw(dt);

  lastUpdateTime = timestamp;
}

import Player from "./entities/player.mjs";

let player = new Player(0, 0);
entities.push(player);

window.player = player;

requestAnimationFrame(gameloop);