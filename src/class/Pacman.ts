import powerDot from 'assets/sounds/power_dot.wav';
import waka from 'assets/sounds/waka.wav';
import { Player, Rect } from 'class/Player';
import { WallMap } from 'class/WallMap';
import { Direction, MapObject } from 'type';

enum Rotation {
  Right,
  Down,
  Left,
  Up,
}

export class Pacman extends Player {
  private originalX: number;
  private originalY: number;
  private wallMap: WallMap;
  private direction: Direction | null = null;
  private nextDirection: Direction | null = null;
  private rotation: Rotation = Rotation.Right;
  private isOpeningMouth = false;
  private mouthAngle = 0.8;
  private wakaSound: HTMLAudioElement;
  private powerDotSound: HTMLAudioElement;
  private radius: number;

  onStartMove?: () => void;
  onEatPellet?: () => void;
  onEatPowerPellet?: () => void;

  private color = 'yellow';

  constructor(
    public x: number,
    public y: number,
    public rectSize: number,
    public velocity: number,
    wallMap: WallMap,
  ) {
    super(x, y, rectSize);
    this.originalX = x;
    this.originalY = y;
    this.wallMap = wallMap;
    this.wakaSound = new Audio(waka);
    this.powerDotSound = new Audio(powerDot);
    this.radius = this.rectSize / 2;
  }

  #keyDownHandler = ({ key }: KeyboardEvent) => {
    if (this.direction === null) this.onStartMove?.();
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
    document.removeEventListener('keydown', this.#keyDownHandler);
    document.addEventListener('keydown', this.#keyDownHandler);
  }
  stopKeyDownListener() {
    document.removeEventListener('keydown', this.#keyDownHandler);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.radius, this.y + this.radius);
    ctx.rotate((this.rotation * 90 * Math.PI) / 180);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, this.mouthAngle, Math.PI * 2 - this.mouthAngle);
    ctx.lineTo(0, 0);

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.restore();
  }

  update(ctx: CanvasRenderingContext2D) {
    this.#move();
    this.#animate();
    this.#eatPellet();
    this.draw(ctx);
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

  #eatPellet = () => {
    const pellet = this.wallMap.eatPellet(this.x, this.y);
    if (pellet === undefined) return;
    if (pellet === MapObject.PowerPellet) {
      this.powerDotSound.play();
      this.onEatPowerPellet?.();
    }
    if (pellet === MapObject.Pellet) {
      this.onEatPellet?.();
      this.wakaSound.play();
    }
  };

  intersects(rect: Rect): boolean {
    const x = this.x + this.radius;
    const y = this.y + this.radius;
    return (
      rect.x < x &&
      rect.x + rect.width > x &&
      rect.y < y &&
      rect.y + rect.height > y
    );
  }

  reset() {
    this.x = this.originalX;
    this.y = this.originalY;
    this.direction = null;
    this.nextDirection = null;
  }
}
