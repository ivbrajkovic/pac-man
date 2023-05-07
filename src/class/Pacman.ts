import { WallMap } from 'class/WallMap';
import { Direction } from 'type';

export class Pacman {
  private wallMap: WallMap;
  private direction: Direction | null = null;
  private nextDirection: Direction | null = null;

  constructor(
    public x: number,
    public y: number,
    public rectSize: number,
    public velocity: number,
    wallMap: WallMap,
  ) {
    this.wallMap = wallMap;
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
      Number.isInteger(this.x / this.rectSize) &&
      Number.isInteger(this.y / this.rectSize) &&
      !this.wallMap.isWall(this.x, this.y, this.nextDirection)
    ) {
      this.direction = this.nextDirection;
    } else if (this.wallMap.isWall(this.x, this.y, this.direction)) {
      return;
    }

    switch (this.direction) {
      case Direction.Up:
        this.y -= this.velocity;
        break;

      case Direction.Down:
        this.y += this.velocity;
        break;

      case Direction.Left:
        this.x -= this.velocity;
        break;

      case Direction.Right:
        this.x += this.velocity;
        break;
    }
  };

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(
      this.x + this.rectSize / 2,
      this.y + this.rectSize / 2,
      this.rectSize / 2,
      0,
      Math.PI * 2,
    );
    ctx.lineTo(this.x, this.y);
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D) {
    this.#move();
    this.draw(ctx);
  }
}
