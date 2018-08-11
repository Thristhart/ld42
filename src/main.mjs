let canvas = document.getElementById("display");
canvas.width = CONSTANTS.WIDTH;
canvas.height = CONSTANTS.HEIGHT;

import Input from "./global/input.mjs";
import Renderer from "./global/renderer.mjs";
Input.attach(canvas);
Renderer.init(canvas);

import entities from "./global/entities.mjs";
import state from "./global/state.mjs";

let lastUpdateTime;

state.circleSize = CONSTANTS.WIDTH / 2;
let shrinkDuration = 60000;
let timeSinceLastBullet = 0;
let timeSinceLevelStart = 0;

function draw() {
  Renderer.beginDraw();

  Renderer.context.beginPath();
  Renderer.context.arc(CONSTANTS.WIDTH / 2, CONSTANTS.HEIGHT / 2, state.circleSize, 0, Math.PI * 2);
  Renderer.context.closePath();
  Renderer.context.stroke();

  entities.sort((a, b) => {
    return a.y - b.y;
  }).forEach(ent => {
    ent.draw();
  });

  Renderer.endDraw();
}

let lightningBallCooldown = 700;
let currentLightningBallCooldown = 0;
function gameloop(timestamp) {
  requestAnimationFrame(gameloop);

  if(!lastUpdateTime) {
    lastUpdateTime = timestamp;
  }

  let dt = timestamp - lastUpdateTime;
  if(dt > 50) {
    dt = 50;
  }
  entities.forEach(ent => {
    ent.update(dt);
  });

  draw();
  
  timeSinceLevelStart += dt;
  state.circleSize = (1 - timeSinceLevelStart / shrinkDuration) * CONSTANTS.WIDTH / 2;

  if(state.circleSize <= 0) {
    // spawn portal
    // clear level
    // restart when portal anim is finished / user presses a button?
    timeSinceLevelStart = 0;
    state.circleSize = 0;
  }

  timeSinceLastBullet += dt;
  if(timeSinceLastBullet >= 1000) {
    timeSinceLastBullet = 0;
    let pos = getRandomEdgePosition();
    let enemy = new Bird(pos.x, pos.y);
    entities.push(enemy);
  }

  if(currentLightningBallCooldown > 0) {
    currentLightningBallCooldown -= dt;
  }

  lastUpdateTime = timestamp;
}

Input.events.on("mousemove", draw);
Input.events.on("click", () => {
  if(currentLightningBallCooldown <= 0) {
    currentLightningBallCooldown = lightningBallCooldown;

    let ball = LightningBall.shootAt(Input.mouse.x, Input.mouse.y, state.player.x, state.player.y);

    entities.push(ball);
  }
});

import Player from "./entities/player.mjs";
import CONSTANTS from "./global/constants.mjs";
import Bird from "./entities/bird.mjs";
import LightningBall from "./entities/lightning_ball.mjs";

state.player = new Player(canvas.width / 2, canvas.height / 2);
entities.push(state.player);

function getRandomEdgePosition() {
  if(Math.random() < 0.5) {
    let x = Math.random() * canvas.width;
    let y = Math.random() < 0.5 ? 0 : canvas.height;
    return {x, y};
  }
  else {
    let x = Math.random() < 0.5 ? 0 : canvas.width;
    let y =  Math.random() * canvas.height;
    return {x, y};
  }
}

window.entities = entities;

window.player = state.player;

requestAnimationFrame(gameloop);