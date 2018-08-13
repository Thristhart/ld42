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
let timeSinceLevelStart = 0;

class Level {
  constructor() {
    this.started = false;
    this.loaded = false;
    this.duration = 72000;
    this.circleColor = "pink";
  }
  begin() {
    if(this.music) {
      this.music.play();
    }
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
  }
  load() {
    this.loaded = true;
    state.dying = false;
  }
  update(dt) {
    if(this.levelStartDuration > 0) {
      this.levelStartDuration -= dt;
    }
    if(this.levelStartDuration <= 0 && !this.started) {
      this.started = true;
    }
  }
}

class MeadowLevel extends Level {
  constructor() {
    super();
    this.background = Images.MEADOW;
    this.music = new Howl({
      src: "./assets/we_groovin.mp3"
    });
    this.duration = 60500;
    this.timeSinceLastBird = 0;
    this.timeSinceLastCharger = 0;
    this.timePerBird = 2500;
    this.timePerCharger = 7500;
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    UI.dialog.className = "mentor";
    UI.dialog.text.innerHTML = `My dearest Ellomir, the poison has finally run its course. Soon I will cross the Path of Tirofu and dream the Great Dream. You must continue on in my place. I have taught you everything you need to know. The Sages of Kitr will pursue you, but you cannot let them have our precious cargo. Now quickly, take the orb, use its powers, and flee!`;
    UI.showDialog();
    
    buildCircleCache();
    
    Input.events.once("click", () => {
      UI.hideDialog();
      this.load();
      this.begin();
    });
  }
  update(dt) {
    super.update(dt);
    this.timeSinceLastBird += dt;
    this.timeSinceLastCharger += dt;
    if(this.timeSinceLastBird > this.timePerBird) {
      this.timeSinceLastBird = 0;
      let spawnPos = getRandomEdgePosition();
      let bird = new Bird(spawnPos.x, spawnPos.y);
      entities.push(bird);
    }
    if(this.timeSinceLastCharger > this.timePerCharger) {
      this.timeSinceLastCharger = 0;
      let spawnX = Math.random() * 800 + 100;
      let bird = new Charger(spawnX, 0);
      entities.push(bird);
    }
  }
}
class DungeonLevel extends Level {
  constructor() {
    super();
    this.background = Images.DUNGEON;
    this.music = new Howl({
      src: "./assets/we_pumpin.mp3"
    }).volume(0.8);
    this.duration = 72000;
    this.circleColor = "#3089e0";
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    UI.dialog.className = "mage";
    UI.dialog.text.innerHTML = `OH GODS I'M GONNA PUKE!`;
    UI.showDialog();
    
    buildCircleCache();

    setTimeout(() => {
      Input.events.once("click", () => {
        UI.dialog.text.innerHTML = `Nope, we're good li'l orb friend. Totally, definitely, perfectly-Uhhh, where the hell am I? You really do let us move between worlds like my former master said. I thought my ex-master was pulling my leg with all this orb talk. I guess you could call him my POST-master, eh? Oh boy, am I talking to an orb right now? Is that what's happen-what was that sound?!`;
        Input.events.once("click", () => {
          UI.hideDialog();
          this.load();
          this.begin();
        });
      });
    }, 1000);
  }
  update(dt) {
    super.update(dt);
  }
}
class AstralLevel extends Level {
  constructor() {
    super();
    this.background = Images.DUNGEON;
    this.music = new Howl({
      src: "./assets/we_crushin.mp3"
    });
    this.duration = 72000;
    this.circleColor = "#3089e0";
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    UI.dialog.className = "mage";
    UI.dialog.text.innerHTML = `it's space?`;
    UI.showDialog();
    
    buildCircleCache();

    setTimeout(() => {
      Input.events.once("click", () => {
        UI.hideDialog();
        this.load();
        this.begin();
      });
    }, 1000);
  }
  update(dt) {
    super.update(dt);
  }
}

state.currentLevel = new MeadowLevel();

state.nextLevels = [new DungeonLevel(), new AstralLevel()];

function draw() {
  Renderer.beginDraw();
  Renderer.context.drawImage(state.currentLevel.background, 0, 0, Renderer.canvas.width, Renderer.canvas.height);

  let radius = state.circleSize;
  if(state.currentLevel.levelStartDuration > 0) {
    radius = CONSTANTS.CENTER_RADIUS + (1 - state.currentLevel.levelStartDuration / 2000) * (CONSTANTS.CIRCLE_MAX - CONSTANTS.CENTER_RADIUS);
  }
  if(state.currentLevel.loaded) {
    drawMagicCircle(radius);
  }

  entities.sort((a, b) => {
    return a.y - b.y;
  }).forEach(ent => {
    ent.draw();
  });
  if(state.dying) {
    Renderer.context.fillStyle = `rgba(0, 0, 0, ${1 - state.slowmoSeconds / 2000})`;
    Renderer.context.fillRect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
  }

  Renderer.endDraw();
}

const TWOPI = Math.PI * 2;
const THIRD_ANGLE = Math.PI * 2 / 3;

let circleCache = [];
let cacheSize = 10;
function buildCircleCache() {
  circleCache = [];
  for(let i = 1; i <= cacheSize; i++) {
    let fraction = i / cacheSize;
    circleCache.push(buildMagicCircle(CONSTANTS.CIRCLE_MAX * fraction));
  }
}
function drawMagicCircle(radius) {
  let centerX = CONSTANTS.WIDTH / 2;
  let centerY = CONSTANTS.HEIGHT / 2;
  let rotation = radius / CONSTANTS.CIRCLE_MAX * TWOPI * 2;

  let cacheImage = circleCache[Math.floor(radius / CONSTANTS.CIRCLE_MAX * cacheSize)];

  let ctx = Renderer.context;

  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.drawImage(cacheImage, -radius, -radius, radius * 2, radius * 2);

  ctx.strokeStyle = state.currentLevel.circleColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, CONSTANTS.CENTER_RADIUS, 0, TWOPI);
  ctx.stroke();

  ctx.rotate(-rotation);
  ctx.translate(-centerX, -centerY);
}
function buildMagicCircle(radius) {
  let centerX = radius;
  let centerY = radius;

  let canvas = document.createElement("canvas");
  canvas.width = radius * 2;
  canvas.height = radius * 2;
  let ctx = canvas.getContext("2d");

  ctx.translate(centerX, centerY);
  ctx.strokeStyle = state.currentLevel.circleColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TWOPI);
  ctx.arc(0, 0, radius * 0.97, 0, TWOPI);
  for(let angle = 0; angle < Math.PI * 2; angle += THIRD_ANGLE) {
    let innerCircleRadius = (radius - CONSTANTS.CENTER_RADIUS) / 6;
    let midpointLength = CONSTANTS.CENTER_RADIUS + (radius - CONSTANTS.CENTER_RADIUS) / 1.5;
    let midpointX = Math.cos(angle) * midpointLength;
    let midpointY = Math.sin(angle) * midpointLength;
    ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.lineTo(Math.cos(angle) * (midpointLength + innerCircleRadius), Math.sin(angle) * (midpointLength + innerCircleRadius));
    ctx.stroke();
    ctx.closePath();
  
    ctx.beginPath();
    ctx.arc(midpointX, midpointY, innerCircleRadius, 0, TWOPI);
    ctx.closePath();
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(midpointX + Math.cos(angle + THIRD_ANGLE) * innerCircleRadius, midpointY + Math.sin(angle + THIRD_ANGLE) * innerCircleRadius);
    let nextMidpointX = Math.cos(angle + THIRD_ANGLE) * midpointLength;
    let nextMidpointY = Math.sin(angle + THIRD_ANGLE) * midpointLength;
    ctx.lineTo(
      nextMidpointX + Math.cos(angle) * innerCircleRadius,
      nextMidpointY + Math.sin(angle) * innerCircleRadius);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.fillStyle = state.currentLevel.circleColor;
  let letterSize = radius * 0.03;
  ctx.font = `${letterSize * 3}px cursive small-caps bold`;
  for(let i = 0; i < 160; i++) {
    let angle = TWOPI / 160 * i;
    let letter = "T";
    if(i % 3 == 0) {
      letter = "X";
    }
    if(i % 5 == 0) {
      letter = "F";
    }
    ctx.rotate(angle);
    ctx.fillText(letter, 0, -radius + letterSize);
    ctx.rotate(-angle);
  }
  ctx.translate(-centerX, -centerY);
  ctx.fillStyle = "black";

  return canvas;
}

let lightningBallCooldown = 700;
let currentLightningBallCooldown = 0;
let wallCooldown = 5000;
let currentWallCooldown = 0;
let deathMusic = new Howl({
  src: "./assets/we_dead.mp3",
});
function gameloop(timestamp) {
  requestAnimationFrame(gameloop);

  if(!lastUpdateTime) {
    lastUpdateTime = timestamp;
  }

  let dt = timestamp - lastUpdateTime; 
  if(dt > 50) {
    dt = 50;
  }
  if(state.slowmoCooldown > 0) {
    state.slowmoCooldown -= dt;
    UI.Spells.slowmo.percentage = state.slowmoCooldown / 5000;
  }
  if(state.timescale !== 1) {
    state.slowmoSeconds -= dt;
    if(state.slowmoSeconds <= 0) {
      if(state.dying) {
        deathMusic.play();
        deathMusic.fade(0, 1, 1000);
        switchLevelTo(state.currentLevel);
        UI.dialog.className = "sage";
        UI.dialog.text.innerHTML = `The puny apprentice is dead! Now we can use the orb to dominate all of Time and Space! AHAHAHAHAHAHAHAHAHAHAHA!`;
        Input.events.once("click", () => {
          deathMusic.stop();
        });
        player.position.x = CONSTANTS.WIDTH / 2;
        player.position.y = CONSTANTS.HEIGHT / 2;
        player.hp = 5;
        UI.setHP(5);
      }
      state.timescale = 1;
    }
  }
  dt *= state.timescale;
  if(state.currentLevel.loaded) {
    entities.forEach(ent => {
      ent.update(dt);
    });
    if(state.timescale != state.currentLevel.music.rate()) {
      state.currentLevel.music.rate(state.timescale);
    }
  }
  if(state.currentLevel.started) {
    timeSinceLevelStart += dt;
    state.circleSize = CONSTANTS.CENTER_RADIUS + (1 - timeSinceLevelStart / state.currentLevel.duration) * (CONSTANTS.CIRCLE_MAX - CONSTANTS.CENTER_RADIUS);

    if(currentLightningBallCooldown > 0) {
      currentLightningBallCooldown -= dt;
      UI.Spells.lightning.percentage = currentLightningBallCooldown / lightningBallCooldown;
    }

    if(currentWallCooldown > 0) {
      currentWallCooldown -= dt;
      UI.Spells.wall.percentage = currentWallCooldown / wallCooldown;
    }
  }

  if(timeSinceLevelStart >= state.currentLevel.duration) {
    // spawn portal
    let nextLevel = state.nextLevels.shift();
    switchLevelTo(nextLevel);
    state.circleSize = CONSTANTS.CIRCLE_MAX;
  }

  draw();
  


  if(state.currentLevel.loaded) {
    state.currentLevel.update(dt);
  }

  lastUpdateTime = timestamp;
}

function switchLevelTo(level) {
  entities.splice(0);
  entities.push(state.player);
  state.currentLevel.music.stop();
  state.currentLevel = level;
  level.setup();
  timeSinceLevelStart = 0;
}

Input.events.on("click", () => {
  if(!state.currentLevel.started) {
    return;
  }
  if(currentLightningBallCooldown <= 0) {
    currentLightningBallCooldown = lightningBallCooldown;

    Sounds.ZAP.play();
    let ball = LightningBall.shootAt(Input.mouse.x, Input.mouse.y, state.player.x, state.player.y);

    entities.push(ball);
  }
});

Input.events.on("wallStart", () => {
  if(!state.currentLevel.started) {
    return;
  }
  if(currentWallCooldown <= 0) {
    currentWallCooldown = wallCooldown;

    let dy = Input.mouse.y - player.y;
    let dx = Input.mouse.x - player.x;

    let angle = Math.atan2(dy, dx);

    let wallAngle = angle + Math.PI / 2;

    let distance = Math.sqrt((dy * dy + dx * dx));
    let x = Input.mouse.x;
    let y = Input.mouse.y;
    if(distance > CONSTANTS.WALL_RANGE) {
      x = player.x + Math.cos(angle) * CONSTANTS.WALL_RANGE;
      y = player.y + Math.sin(angle) * CONSTANTS.WALL_RANGE;
    }
    x -= Math.cos(wallAngle) * 25;
    y -= Math.sin(wallAngle) * 25;

    let pattern = {
      spawnOffset: {
        x: (iterations) => Math.cos(wallAngle) * iterations * 10,
        y: (iterations) => Math.sin(wallAngle) * iterations * 10,
      },
      spawn: Wall,
      repeat: 5,
    };
    let wallEmitter = new PatternEmitter(x, y, pattern);

    entities.push(wallEmitter);

    Sounds.WALL.play();
  }
});

Input.events.on("slowmoStart", () => {
  if(state.slowmoCooldown <= 0) {
    state.slowmoCooldown = 5000;
    state.slowmoSeconds = 2000;
    state.timescale = 0.6;
  }
});
import Player from "./entities/player.mjs";
import CONSTANTS from "./global/constants.mjs";
import Bird from "./entities/bird.mjs";
import LightningBall from "./entities/lightning_ball.mjs";
import UI from "./global/ui.mjs";
import Images from "./global/images.mjs";
import Wall from "./entities/wall.mjs";
import PatternEmitter from "./entities/pattern_emitter.mjs";
import Sounds from "./global/sounds.mjs";
import Bullet from "./entities/bullet.mjs";
import Charger from "./entities/charger.mjs";

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

Howler.volume(0.8);

document.addEventListener("visibilitychange", function() {
  if(document.hidden) {
    state.currentLevel.music.pause();
  }
  else if(state.currentLevel.loaded) {
    state.currentLevel.music.play();
  }
});

window.entities = entities;

window.player = state.player;
window.Sounds = Sounds;

state.currentLevel.setup();

requestAnimationFrame(gameloop);
