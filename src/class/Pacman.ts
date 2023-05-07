import waka from 'assets/sounds/waka.wav';
import { WallMap } from 'class/WallMap';
import { Direction } from 'type';

enum Rotation {
  Right,
  Down,
  Left,
  Up,
}

export class Pacman {
  private wallMap: WallMap;
  private direction: Direction | null = null;
  private nextDirection: Direction | null = null;
  private rotation: Rotation = Rotation.Right;
  private wallSize = 0;
  private halfWallSize = 0;
  private isOpeningMouth = false;
  private mouthAngle = 0.8;
  // private wakaSound = new Audio('assets/sounds/waka.wav');
  // private wakaSound = new Audio(waka);
  private wakaSound: HTMLAudioElement;

  constructor(
    public x: number,
    public y: number,
    public rectSize: number,
    public velocity: number,
    wallMap: WallMap,
    public color: string = 'yellow',
  ) {
    this.wallMap = wallMap;
    this.wallSize = wallMap.wallSize;
    this.halfWallSize = wallMap.wallSize / 2;
    this.wakaSound = new Audio(waka);
  }

  #keyDownHandler = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'ArrowUp':
        if (this.direction === Direction.Down) this.direction = Direction.Up;
        this.nextDirection = Direction.Up;
        break;

      case 'ArrowDown':
        if (this.direction === Direction.Up) this.direction = Direction.Down;
        this.nextDirection = Direction.Down;
        break;

      case 'ArrowLeft':
        if (this.direction === Direction.Right) this.direction = Direction.Left;
        this.nextDirection = Direction.Left;
        break;

      case 'ArrowRight':
        if (this.direction === Direction.Left) this.direction = Direction.Right;
        this.nextDirection = Direction.Right;
        break;
    }
  };
  startKeyDownListener() {
    document.addEventListener('keydown', this.#keyDownHandler);
  }
  stopKeyDownListener() {
    document.removeEventListener('keydown', this.#keyDownHandler);
  }

  #move = () => {
    if (
      this.direction !== this.nextDirection &&
      Number.isInteger(this.x / this.wallMap.wallSize) &&
      Number.isInteger(this.y / this.wallMap.wallSize) &&
      !this.wallMap.isWall(this.x, this.y, this.nextDirection)
    ) {
      this.direction = this.nextDirection;
    } else if (this.wallMap.isWall(this.x, this.y, this.direction)) {
      return;
    }

    switch (this.direction) {
      case Direction.Up:
        this.y -= this.velocity;
        this.rotation = Rotation.Up;
        break;

      case Direction.Down:
        this.y += this.velocity;
        this.rotation = Rotation.Down;
        break;

      case Direction.Left:
        this.x -= this.velocity;
        this.rotation = Rotation.Left;
        break;

      case Direction.Right:
        this.x += this.velocity;
        this.rotation = Rotation.Right;
        break;
    }
  };

  #draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.halfWallSize, this.y + this.halfWallSize);
    ctx.rotate((this.rotation * 90 * Math.PI) / 180);

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.halfWallSize,
      this.mouthAngle,
      Math.PI * 2 - this.mouthAngle,
    );
    ctx.lineTo(0, 0);

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.restore();
  }

  #animate = () => {
    if (this.isOpeningMouth) this.mouthAngle += 0.05;
    else this.mouthAngle -= 0.05;
    this.isOpeningMouth =
      this.mouthAngle <= 0
        ? true
        : this.mouthAngle >= 0.8
        ? false
        : this.isOpeningMouth;
  };

  #eatDot = () => {
    this.wallMap.eatDot(this.x, this.y);
    // && this.wakaSound.play();
  };

  update(ctx: CanvasRenderingContext2D) {
    this.#move();
    this.#animate();
    this.#eatDot();
    this.#draw(ctx);
  }
}
