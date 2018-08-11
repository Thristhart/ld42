import Images from "./images.mjs";

class Sprite {
  constructor(image, spriteWidth, spriteHeight, sheetWidth, sheetHeight) {
    this.image = image;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.sheetWidth = sheetWidth;
    this.sheetHeight = sheetHeight;
  }
  clone() {
    let dupe = new Sprite(this.image, this.spriteWidth, this.sheetWidth, this.sheetHeight);
    for(let key in this) {
      if(this[key].clone) {
        dupe[key] = this[key].clone();
      }
      else {
        dupe[key] = this[key];
      }
    }
    return dupe;
  }
}
class Animation {
  constructor(sprite, frames) {
    this.sprite = sprite;
    this.currentFrame = 0;
    this.frames = frames;
    this.timePerFrame = 300;
    this.timeSinceLastFrame = 0;
  }
  clone() {
    return new Animation(this.sprite, this.frames);
  }
  nextFrame() {
    this.currentFrame++;
    if(this.currentFrame >= this.frames.length) {
      this.currentFrame = 0;
    }
    this.timeSinceLastFrame = 0;
  }
  draw(context, x, y, width, height) {
    let frame = this.frames[this.currentFrame];
    if(!width) {
      width = this.sprite.spriteWidth;
      height = this.sprite.spriteHeight;
    }
    context.drawImage(this.sprite.image, 
      frame.x * this.sprite.spriteWidth, frame.y * this.sprite.spriteHeight,
      this.sprite.spriteWidth, this.sprite.spriteHeight,
      x - width / 2, y - height / 2,
      width, height,
    );
  }
}
class Frame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

Sprite.MAGE = new Sprite(Images.MAGE, 26, 36, 3, 4);
Sprite.MAGE.IDLE_DOWN = new Animation(Sprite.MAGE,  [new Frame(1, 0)]);
Sprite.MAGE.IDLE_LEFT = new Animation(Sprite.MAGE,  [new Frame(1, 1)]);
Sprite.MAGE.IDLE_RIGHT = new Animation(Sprite.MAGE, [new Frame(1, 2)]);
Sprite.MAGE.IDLE_UP = new Animation(Sprite.MAGE,    [new Frame(1, 3)]);

Sprite.MAGE.WALK_DOWN = new Animation(Sprite.MAGE,
  [new Frame(0, 0), new Frame(1, 0), new Frame(2, 0)]);
Sprite.MAGE.WALK_LEFT = new Animation(Sprite.MAGE,
  [new Frame(0, 1), new Frame(1, 1), new Frame(2, 1)]);
Sprite.MAGE.WALK_RIGHT = new Animation(Sprite.MAGE,
  [new Frame(0, 2), new Frame(1, 2), new Frame(2, 2)]);
Sprite.MAGE.WALK_UP = new Animation(Sprite.MAGE,
  [new Frame(0, 3), new Frame(1, 3), new Frame(2, 3)]);

Sprite.BIRD = new Sprite(Images.BIRD, 122, 114, 3, 4);

Sprite.BIRD.IDLE_DOWN = new Animation(Sprite.BIRD,  [new Frame(1, 0)]);
Sprite.BIRD.IDLE_LEFT = new Animation(Sprite.BIRD,  [new Frame(1, 1)]);
Sprite.BIRD.IDLE_RIGHT = new Animation(Sprite.BIRD, [new Frame(1, 2)]);
Sprite.BIRD.IDLE_UP = new Animation(Sprite.BIRD,    [new Frame(1, 3)]);

Sprite.BIRD.WALK_DOWN = new Animation(Sprite.BIRD,
  [new Frame(0, 0), new Frame(1, 0), new Frame(2, 0)]);
Sprite.BIRD.WALK_LEFT = new Animation(Sprite.BIRD,
  [new Frame(0, 1), new Frame(1, 1), new Frame(2, 1)]);
Sprite.BIRD.WALK_RIGHT = new Animation(Sprite.BIRD,
  [new Frame(0, 2), new Frame(1, 2), new Frame(2, 2)]);
Sprite.BIRD.WALK_UP = new Animation(Sprite.BIRD,
  [new Frame(0, 3), new Frame(1, 3), new Frame(2, 3)]);

Sprite.BIRD.WALK_DOWN.timePerFrame = 200;
Sprite.BIRD.WALK_LEFT.timePerFrame = 200;
Sprite.BIRD.WALK_RIGHT.timePerFrame = 200;
Sprite.BIRD.WALK_UP.timePerFrame = 200;

Sprite.LIGHTNING = new Sprite(Images.LIGHTNING, 64, 64, 5, 6);

Sprite.LIGHTNING.BALL = new Animation(Sprite.LIGHTNING, 
  [new Frame(3, 2), new Frame(4, 2), new Frame(0, 3), new Frame(1, 3)]);
Sprite.LIGHTNING.BALL.timePerFrame = 100;

export default Sprite;