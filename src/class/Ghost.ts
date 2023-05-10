import ghostImage from 'assets/img/ghost.png';
import scaredGhostImage from 'assets/img/scaredGhost.png';
import scaredGhostImage2 from 'assets/img/scaredGhost2.png';
import { Player } from 'class/Player';
import { WallMap } from 'class/WallMap';
import { Direction, getRandomDirection } from 'type';
import { getRandomNumber } from 'utility';

const POWER_DOT_ACTIVE_TIME = 6000;
const POWER_DOT_EXPIRE_TIME = POWER_DOT_ACTIVE_TIME / 2;

const getRandomTimer = () => getRandomNumber(1000, 5000);

export class Ghost extends Player {
  private _isScared = false;
  private isPaused = true;
  private isRender = true;
  private normalGhost: HTMLImageElement | null = null;
  private scaredGhost: HTMLImageElement | null = null;
  private scaredGhost2: HTMLImageElement | null = null;
  private currentImage: HTMLImageElement | null = null;
  private direction: Direction;
  private nextDirection: Direction;
  private directionChangeTimer: number;
  private timers: number[] = [];

  constructor(
    public x: number,
    public y: number,
    public size: number,
    public velocity: number,
    public color: string,
    public wallMap: WallMap,
  ) {
    super(x, y, size);
    this.#loadImages();
    this.direction = getRandomDirection();
    this.nextDirection = this.direction;
    this.directionChangeTimer = this.#resetDirectionChangeTimer();
  }

  get isScared() {
    return this._isScared;
  }

  setScared() {
    this._isScared = true;
    this.currentImage = this.scaredGhost;
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [
      setTimeout(() => {
        this._isScared = false;
        this.currentImage = this.normalGhost;
      }, POWER_DOT_ACTIVE_TIME),
      setTimeout(() => {
        this.currentImage = this.scaredGhost2;
      }, POWER_DOT_EXPIRE_TIME),
    ];
  }

  #randomizeNextDirection = () => (this.nextDirection = getRandomDirection());

  #resetDirectionChangeTimer = () => {
    clearTimeout(this.directionChangeTimer);
    return (this.directionChangeTimer = setTimeout(
      this.#randomizeNextDirection,
      getRandomTimer(),
    ));
  };

  #loadImages = () => {
    this.normalGhost = new Image();
    this.normalGhost.src = ghostImage;

    this.scaredGhost = new Image();
    this.scaredGhost.src = scaredGhostImage;

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = scaredGhostImage2;

    this.currentImage = this.normalGhost;
  };

  #move = () => {
    if (
      this.direction !== this.nextDirection &&
      Number.isInteger(this.x / this.wallMap.wallSize) &&
      Number.isInteger(this.y / this.wallMap.wallSize) &&
      !this.wallMap.isWall(this.x, this.y, this.nextDirection)
    ) {
      this.direction = this.nextDirection;
    } else if (this.wallMap.isWall(this.x, this.y, this.direction)) {
      this.nextDirection = getRandomDirection();
      this.#resetDirectionChangeTimer();
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
    if (!this.isRender) return;
    ctx.drawImage(
      this.currentImage as HTMLImageElement,
      this.x,
      this.y,
      this.size,
      this.size,
    );
  }

  update(ctx: CanvasRenderingContext2D) {
    !this.isPaused && this.#move();
    this.draw(ctx);
  }

  startMoving() {
    this.isPaused = false;
  }

  remove(): void {
    this.isRender = false;
    this.timers.forEach((timer) => clearTimeout(timer));
  }
}
