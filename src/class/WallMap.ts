import { Dot } from 'class/Dot';
import { Ghost } from 'class/Ghost';
import { Pacman } from 'class/Pacman';
import { Wall } from 'class/Wall';
import { Direction } from 'type';

enum MapObject {
  Dot,
  Wall,
  Pacman = 4,
  Empty = 5,
  Ghost = 6,
}

export class WallMap {
  private mapWidth = 0;
  private mapHeight = 0;
  private halfWallSize = 0;
  private map: number[][] = [];
  private mapArray: (Wall | Dot)[] = [];

  private playerPositions: {
    type: MapObject.Pacman | MapObject.Ghost;
    x: number;
    y: number;
  }[] = [];

  constructor(public wallSize: number) {
    this.halfWallSize = wallSize / 2;
  }

  isWall = (x: number, y: number, direction: Direction | null) => {
    if (
      direction === null ||
      !Number.isInteger(x / this.wallSize) ||
      !Number.isInteger(y / this.wallSize)
    )
      return false;

    let column = 0,
      row = 0,
      nextColumn = 0,
      nextRow = 0;

    switch (direction) {
      case Direction.Up:
        nextRow = y - this.wallSize;
        row = nextRow / this.wallSize;
        column = x / this.wallSize;
        break;

      case Direction.Down:
        nextRow = y + this.wallSize;
        row = nextRow / this.wallSize;
        column = x / this.wallSize;
        break;

      case Direction.Left:
        nextColumn = x - this.wallSize;
        column = nextColumn / this.wallSize;
        row = y / this.wallSize;
        break;

      case Direction.Right:
        nextColumn = x + this.wallSize;
        column = nextColumn / this.wallSize;
        row = y / this.wallSize;
        break;
    }

    return this.map[row][column] === 1;
  };

  mapInit(map: number[][]) {
    this.map = map;
    this.mapWidth = this.wallSize * map[0].length;
    this.mapHeight = this.wallSize * map.length;

    map.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        switch (column) {
          case MapObject.Dot:
            this.mapArray.push(
              new Dot(
                this.wallSize * columnIndex + this.halfWallSize,
                this.wallSize * rowIndex + this.halfWallSize,
                this.wallSize / 10,
                'white',
              ),
            );
            break;

          case MapObject.Wall:
            this.mapArray.push(
              new Wall(
                this.wallSize * columnIndex,
                this.wallSize * rowIndex,
                this.wallSize,
                this.wallSize,
                'blue',
              ),
            );
            break;

          case MapObject.Pacman:
          case MapObject.Ghost:
            this.playerPositions.push({
              type: column,
              x: this.wallSize * columnIndex,
              y: this.wallSize * rowIndex,
            });
            break;
        }
      });
    });
  }

  setCanvasSize(canvas: HTMLCanvasElement) {
    canvas.width = this.mapWidth;
    canvas.height = this.mapHeight;
  }

  draw(context: CanvasRenderingContext2D) {
    this.mapArray.forEach((wall) => wall.draw(context));
  }

  getPacman(velocity: number) {
    const pacmanPosition = this.playerPositions.find(
      ({ type }) => type === MapObject.Pacman,
    );
    if (!pacmanPosition) throw new Error('Pacman not found');

    return new Pacman(
      pacmanPosition.x,
      pacmanPosition.y,
      this.wallSize,
      velocity,
      this,
    );
  }

  getGhosts = (velocity: number) =>
    this.playerPositions
      .filter(({ type }) => type === MapObject.Ghost)
      .map(({ x, y }) => new Ghost(x, y, this.wallSize, velocity, 'red', this));

  eatDot(x: number, y: number) {
    const column = x / this.wallSize;
    const row = y / this.wallSize;

    if (!Number.isInteger(column) || !Number.isInteger(row)) return;
    if (this.map[row][column] !== MapObject.Dot) return;

    this.map[row][column] = MapObject.Empty;
    const dotX = x + this.halfWallSize;
    const dotY = y + this.halfWallSize;

    const dot = this.mapArray.find(
      (item) =>
        item.x === dotX && //
        item.y === dotY,
    );

    if (!(dot instanceof Dot)) return false;

    dot.isRender = false;
    return true;
  }
}
