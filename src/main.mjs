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
    this.timePerBird = 3500;
    this.timePerCharger = 8000;
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    UI.dialog.className = "mentor";
    UI.dialog.text.innerHTML = `My dearest Ellomir, the poison has finally run its course. Soon I will cross the Path of Tirofu and dream the Great Dream. You must continue on in my place. I have taught you everything you need to know. The Sages of Kitr will pursue you, but you cannot let them have our precious cargo. Now quickly, take the skull, use its powers, and flee! Here come their familiars now!`;
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
      let spawnX = player.x + -100 + Math.random() * 200;
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
    this.timeline = new Timeline();
    this.timeline.addPoint(2880, () => {
      let pattern = {
        spawn: Bullet,
        repeat: 10,
        wait: 30,
        behavior: {
          init: (entity, iterations) => {
            let angle = Math.PI / 10 + iterations * Math.PI / 20;
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {

          },
        },
      };
      let emitter = new PatternEmitter(78, 140, pattern);
      entities.push(emitter);
    });
    this.timeline.addPoint(6200, () => {
      let pattern = {
        spawn: Bullet,
        repeat: 10,
        wait: 30,
        behavior: {
          init: (entity, iterations) => {
            let angle = Math.PI / 2 + Math.PI/ 10 + iterations * Math.PI / 20;
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {

          },
        },
      };
      let emitter = new PatternEmitter(920, 140, pattern);
      entities.push(emitter);
    });
    let left_blast = {
      spawn: Bullet,
      repeat: 10,
      behavior: {
        init: (entity, iterations) => {
          let arc_width = Math.PI / 2;
          let angle = Math.PI - Math.PI / 4 + iterations * arc_width/10;
          entity.velocity.x = Math.cos(angle) * 0.2;
          entity.velocity.y = Math.sin(angle) * 0.2;
        },
        update: (entity, dt) => {

        },
      },
    };
    this.timeline.addPoint(8500, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    let right_blast = {
      spawn: Bullet,
      repeat: 10,
      behavior: {
        init: (entity, iterations) => {
          let arc_width = Math.PI / 2;
          let angle = -Math.PI / 4 + iterations * arc_width/10;
          entity.velocity.x = Math.cos(angle) * 0.2;
          entity.velocity.y = Math.sin(angle) * 0.2;
        },
        update: (entity, dt) => {

        },
      },
    };
    this.timeline.addPoint(14100, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.addPoint(19940, () => {
      entities.push(new PatternEmitter(921, 427, {
        spawn: Bullet,
        wait: 150,
        repeat: 4,
        behavior: {
          init: (entity, iterations) => {
            let dx = state.player.x - entity.x;
            let dy = state.player.y - entity.y;
            let angle = Math.atan2(dy, dx);
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {
  
          },
        },
      }));
      
      entities.push(new PatternEmitter(78, 427, {
        spawn: Bullet,
        wait: 150,
        repeat: 4,
        behavior: {
          init: (entity, iterations) => {
            let dx = state.player.x - entity.x;
            let dy = state.player.y - entity.y;
            let angle = Math.atan2(dy, dx);
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {
  
          },
        },
      }));
    });
    this.timeline.addPoint(21750, () => {
      entities.push(new PatternEmitter(921, 140, {
        spawn: Bullet,
        wait: 300,
        repeat: 2,
        behavior: {
          init: (entity, iterations) => {
            let dx = state.player.x - entity.x;
            let dy = state.player.y - entity.y;
            let angle = Math.atan2(dy, dx);
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {
  
          },
        },
      }));
      
      entities.push(new PatternEmitter(78, 140, {
        spawn: Bullet,
        wait: 300,
        repeat: 2,
        behavior: {
          init: (entity, iterations) => {
            let dx = state.player.x - entity.x;
            let dy = state.player.y - entity.y;
            let angle = Math.atan2(dy, dx);
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {
  
          },
        },
      }));
    });
    this.timeline.addPoint(22610, () => {
      entities.push(new PatternEmitter(940, 940, {
        spawn: Bullet,
        wait: 60,
        repeat: 20,
        behavior: {
          init: (entity, iterations) => {
            let angle = (Math.PI * 5/4) + Math.sin(iterations / 20) * Math.PI / 4;
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {
  
          },
        },
      }));
      this.timeline.addPoint(25440, () => {
        entities.push(new PatternEmitter(70, 940, {
          spawn: Bullet,
          wait: 60,
          repeat: 40,
          behavior: {
            init: (entity, iterations) => {
              let angle = (-Math.PI / 6) - Math.sin(iterations / 20) * Math.PI / 4;
              entity.velocity.x = Math.cos(angle) * 0.2;
              entity.velocity.y = Math.sin(angle) * 0.2;
            },
            update: (entity, dt) => {
    
            },
          },
        }));
      });
      this.timeline.addPoint(28260, () => {
        entities.push(new PatternEmitter(940, 940, {
          spawn: Bullet,
          wait: 60,
          repeat: 20,
          behavior: {
            init: (entity, iterations) => {
              let angle = (Math.PI * 5/4) - Math.sin(iterations / 4) * Math.PI / 8;
              entity.velocity.x = Math.cos(angle) * 0.2;
              entity.velocity.y = Math.sin(angle) * 0.2;
            },
            update: (entity, dt) => {
    
            },
          },
        }));
      });
      this.timeline.addPoint(31080, () => {
        entities.push(new PatternEmitter(940, 940, {
          spawn: Bullet,
          wait: 30,
          repeat: 45,
          behavior: {
            init: (entity, iterations) => {
              let angle = (Math.PI * 5/4) + Math.sin(iterations / 20) * Math.PI / 4;
              entity.velocity.x = Math.cos(angle) * 0.2;
              entity.velocity.y = Math.sin(angle) * 0.2;
            },
            update: (entity, dt) => {
    
            },
          },
        }));
      });
      this.timeline.addPoint(33880, () => {
        entities.push(new PatternEmitter(70, 940, {
          spawn: Bullet,
          wait: 30,
          repeat: 80,
          behavior: {
            init: (entity, iterations) => {
              let angle = (-Math.PI / 6) - Math.sin(iterations / 20) * Math.PI / 4;
              entity.velocity.x = Math.cos(angle) * 0.2;
              entity.velocity.y = Math.sin(angle) * 0.2;
            },
            update: (entity, dt) => {
    
            },
          },
        }));
      });

      this.timeline.addPoint(39540, () => {
        function waveUpdate(entity, dt) {
          entity.timeAlive += dt;
          if(Math.floor(entity.timeAlive / 1500) % 2 === 0) {
            entity.velocity.x = 0;
            entity.velocity.y = 0;
          }
          else {
            entity.velocity.x = Math.cos(entity.angle) * 0.1;
            entity.velocity.y = Math.sin(entity.angle) * 0.1;
          }
        }
        entities.push(new PatternEmitter(920, 140, {
          spawn: Bullet,
          repeat: 30,
          behavior: {
            init: (entity, iterations) => {
              let angle = (Math.PI / 2) + iterations / 30 * Math.PI / 2;
              entity.angle = angle;
              entity.velocity.x = Math.cos(angle) * 0.1;
              entity.velocity.y = Math.sin(angle) * 0.1;
              entity.timeAlive = 0;
            },
            update: waveUpdate,
          },
        }));
        entities.push(new PatternEmitter(70, 140, {
          spawn: Bullet,
          repeat: 30,
          behavior: {
            init: (entity, iterations) => {
              let angle = (Math.PI / 2) - iterations / 30 * Math.PI / 2;
              entity.angle = angle;
              entity.velocity.x = Math.cos(angle) * 0.1;
              entity.velocity.y = Math.sin(angle) * 0.1;
              entity.timeAlive = 0;
            },
            update: waveUpdate,
          },
        }));
      });
    });
    
    this.timeline.addPoint(56520, () => {
      let pattern = {
        spawn: Bullet,
        repeat: 10,
        wait: 30,
        behavior: {
          init: (entity, iterations) => {
            let angle = Math.PI / 10 + iterations * Math.PI / 20;
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {

          },
        },
      };
      let emitter = new PatternEmitter(78, 140, pattern);
      entities.push(emitter);
    });
    this.timeline.addPoint(59680, () => {
      let pattern = {
        spawn: Bullet,
        repeat: 10,
        wait: 30,
        behavior: {
          init: (entity, iterations) => {
            let angle = Math.PI / 2 + Math.PI/ 10 + iterations * Math.PI / 20;
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {

          },
        },
      };
      let emitter = new PatternEmitter(920, 140, pattern);
      entities.push(emitter);
    });
    this.timeline.addPoint(62150, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(920, 427, left_blast);
      entities.push(emitter);
    });

    this.timeline.addPoint(67770, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
    this.timeline.thenWait(200, () => {
      let emitter = new PatternEmitter(78, 427, right_blast);
      entities.push(emitter);
    });
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    this.levelProgression = 0;
    UI.dialog.className = "mage";
    UI.dialog.text.innerHTML = `OH GODS I'M GONNA PUKE!`;
    UI.showDialog();
    
    buildCircleCache();

    setTimeout(() => {
      Input.events.once("click", () => {
        UI.dialog.text.innerHTML = `Nope, we're good li'l skull friend. Totally, definitely, perfectly-Uhhh, where the hell am I? You really do let us move between worlds like my former master said. I thought my ex-master was pulling my leg with all this skull talk. I guess you could call him my POST-master, eh? Oh boy, am I talking to a skull right now? Is that what's happen-what was that sound?!`;
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
    this.levelProgression += dt;
    this.timeline.update(this.levelProgression);
  }
}
class AstralLevel extends Level {
  constructor() {
    super();
    this.background = Images.ASTRAL;
    this.music = new Howl({
      src: "./assets/we_crushin.mp3"
    });
    this.duration = 56000;
    this.circleColor = "#bc203f";
    this.timeline = new Timeline();

    this.timeline.addPoint(2250, () => {
      entities.push(new PatternEmitter(124, 96, {
        spawn: Bullet,
        wait: 277,
        repeat: 300,
        behavior: {
          init: (entity, iterations) => {
            let dx = state.player.x - entity.x;
            let dy = state.player.y - entity.y;
            let angle = Math.atan2(dy, dx);
            entity.velocity.x = Math.cos(angle) * 0.2;
            entity.velocity.y = Math.sin(angle) * 0.2;
          },
          update: (entity, dt) => {
  
          },
        },
      }));
    });
    function addSage(sageCount) {
      let lifetime = 0;
      let sages = entities.filter(e => e instanceof Sage);
      if(sages.length > 0) {
        lifetime = sages[0].lifetime;
      }
      if(!sageCount) {
        sageCount = sages.length + 1;
      }
      let angle = Math.PI * 2 * lifetime / 12000;
      angle = angle % (Math.PI * 2);
      angle += ((Math.PI * 2) / (sageCount)) * sages.length;
      let x = CONSTANTS.WIDTH / 2 + Math.cos(angle) * CONSTANTS.WIDTH * 0.8;
      let y = CONSTANTS.HEIGHT / 2 + Math.sin(angle) * CONSTANTS.WIDTH * 0.8;
      let sage = new Sage(x, y);
      sage.lifetime = lifetime;
      entities.push(sage);
    }
    this.timeline.addPoint(3500, () => {
      addSage(3);
      addSage(3);
      addSage(3);
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
    this.timeline.thenWait(5000, () => {
      addSage()
    });
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    this.levelProgression = 0;
    UI.dialog.className = "sage";
    UI.dialog.text.innerHTML = `There is no escape! Give us the Skull or perish! The Sages of Kitr have the power to chase you beyond Time and Space. What hope is there for a mere wizard's apprentice? There is only pain and suffering in your future, we have seen it in the scrying pools. Give us the Skull and avoid this cruel fate.`;
    UI.showDialog();
    
    buildCircleCache();

    setTimeout(() => {
      Input.events.once("click", () => {
        UI.dialog.className = "mage";
        UI.dialog.text.innerHTML = "The Skull is my one and only friend now, and friends don't just give each other up to weird wizards! Stuff it!";
        
        Input.events.once("click", () => {
          UI.dialog.className = "sage";
          UI.dialog.text.innerHTML = "AHAHAHA, you fool! If you had given us the orb we would have just killed you. Now you must suffer!";
          Input.events.once("click", () => {
            UI.hideDialog();
            this.load();
            this.begin();
          });
        });
      });
    }, 1000);
  }
  update(dt) {
    super.update(dt);
    this.levelProgression += dt;
    this.timeline.update(this.levelProgression);
  }
}
class VictoryLevel extends Level {
  constructor() {
    super();
    this.background = Images.MEADOW;
    this.music = new Howl({
      src: "./assets/Main_Theme.mp3"
    });
    this.duration = 56000000;
    this.circleColor = "transparent";
  }
  setup() {
    this.started = false;
    this.loaded = false;
    this.levelStartDuration = 2000;
    UI.dialog.className = "skull";
    UI.dialog.text.innerHTML = `Yo dude! You totally passed the test!`;
    UI.showDialog();
    
    buildCircleCache();

    setTimeout(() => {
      Input.events.once("click", () => {
        UI.dialog.className = "skull";
        UI.dialog.text.innerHTML = `Well it wasn't exactly a test. More like an eternal struggle for like good and evil or whatever, but good job anyways! Those whack sages are stuck in that floaty dimension now. Thanks for like freeing me and stuff, my dude. I'm gonna like go now. Got some partying to do, so like take it easy. Here's a dope ass turtle as a reward!`;
        
        Input.events.once("click", () => {
          entities.splice(entities.indexOf(skull));
          entities.push(new Turtle(CONSTANTS.WIDTH / 2, CONSTANTS.HEIGHT / 2 - 80));
          UI.dialog.className = "turtle";
          UI.dialog.text.innerHTML = `IT'S A RAD TURTLE!!!`;
          
          Input.events.once("click", () => {
            UI.hideDialog();
            this.load();
            this.begin();
          });
        });
      });
    }, 1000);
  }
  update(dt) {
    super.update(dt);
  }
}

state.currentLevel = new MeadowLevel();

state.nextLevels = [new DungeonLevel(), new AstralLevel(), new VictoryLevel()];

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

  if(state.currentLevel instanceof VictoryLevel && state.currentLevel.loaded) {
    Renderer.context.font = "42px 'Inexpugnable', serif";
    Renderer.context.fillStyle = "yellow";
    Renderer.context.fillText("Thanks for playing!", 350, 150);
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
  ctx.closePath();
  ctx.stroke();

  if(!state.currentLevel instanceof VictoryLevel) {
    ctx.fillStyle = "rgba(53, 64, 72, 0.8)";
    ctx.filter = "blur(1px)";
    ctx.beginPath();
    ctx.arc(0, 0, 9 - (1 - Math.sin(state.time / 1000)) * 3, 0, TWOPI);
    ctx.closePath();
    ctx.fill();
    ctx.filter = "none";
  }


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

let lightningBallCooldown = 500;
let currentLightningBallCooldown = 0;
let wallCooldown = 4500;
let currentWallCooldown = 0;
let deathMusic = new Howl({
  src: "./assets/we_dead.mp3",
});
function gameloop(timestamp) {
  requestAnimationFrame(gameloop);

  if(!lastUpdateTime) {
    lastUpdateTime = timestamp;
  }

  state.time = timestamp;

  let dt = timestamp - lastUpdateTime; 
  if(dt > 50) {
    dt = 50;
  }
  if(state.slowmoCooldown > 0) {
    state.slowmoCooldown -= dt;
    UI.Spells.slowmo.percentage = state.slowmoCooldown / 5000;
  }
  if(state.timescale !== 1) {
    if(state.slowmoCooldown > 0) {
      CONSTANTS.PLAYER_ACCEL = 0.005;
    }
    state.slowmoSeconds -= dt;
    if(state.slowmoSeconds <= 0) {
      if(state.dying) {
        deathMusic.play();
        deathMusic.fade(0, 1, 1000);
        state.currentLevel.music.stop();
        state.currentLevel.started = false;
        state.currentLevel.loaded = false;
        UI.dialog.className = "sage";
        UI.dialog.text.innerHTML = `The puny apprentice is dead! Now we can use the skull to dominate all of Time and Space! AHAHAHAHAHAHAHAHAHAHAHA!`;
        Input.events.once("click", () => {
          state.dying = false;
          deathMusic.stop();
          switchLevelTo(state.currentLevel);
          UI.setHP(5);
        });
        player.position.x = CONSTANTS.WIDTH / 2;
        player.position.y = CONSTANTS.HEIGHT / 2;
        player.hp = 5;
      }
      state.timescale = 1;
    }
  }
  else {
    CONSTANTS.PLAYER_ACCEL = 0.003;
  }
  dt *= state.timescale;
  if(state.currentLevel.loaded && !state.levelEnding) {
    entities.forEach(ent => {
      ent.update(dt);
    });
    if(state.timescale != state.currentLevel.music.rate()) {
      state.currentLevel.music.rate(state.timescale);
    }
  }
  if(state.levelEnding) {
    skull.update(dt);
  }
  if(state.currentLevel.started && !state.levelEnding) {
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

  if(timeSinceLevelStart >= state.currentLevel.duration && !state.levelEnding) {
    state.levelEnding = true;
    skull.animation = Sprite.DARKNESS.POOF.clone();
    skull.animation.events.once("loop", () => {
      let nextLevel = state.nextLevels.shift();
      switchLevelTo(nextLevel);
      state.circleSize = CONSTANTS.CIRCLE_MAX;
    });
  }

  draw();
  


  if(state.currentLevel.loaded) {
    state.currentLevel.update(dt);
  }

  lastUpdateTime = timestamp;
}

function switchLevelTo(level) {
  currentLightningBallCooldown = 0;
  state.slowmoCooldown = 0;
  currentWallCooldown =  0;
  UI.Spells.lightning.percentage = 0;
  UI.Spells.wall.percentage = 0;
  UI.Spells.slowmo.percentage = 0;
  entities.splice(0);
  entities.push(state.player);
  entities.push(skull);
  skull.animation = Sprite.DARKNESS.SKULL.clone();
  state.currentLevel.music.stop();
  state.currentLevel = level;
  level.setup();
  timeSinceLevelStart = 0;
  state.levelEnding = false;
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
import Skull from "./entities/skull.mjs";
import Sprite from "./global/sprites.mjs";
import Timeline from "./global/timeline.mjs";
import Sage from "./entities/sage.mjs";
import Turtle from "./entities/turtle.mjs";

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

let skull = new Skull(CONSTANTS.WIDTH / 2, CONSTANTS.HEIGHT / 2);
entities.push(skull);

window.Input = Input;
window.entities = entities;

window.player = state.player;
window.Sounds = Sounds;

state.currentLevel.setup();

requestAnimationFrame(gameloop);
