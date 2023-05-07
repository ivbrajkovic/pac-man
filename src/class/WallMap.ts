import { Dot } from 'class/Dot';
import { Pacman } from 'class/Pacman';
import { Wall } from 'class/Wall';
import { Direction } from 'type';

type Drawable = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export class WallMap {
  private mapWidth = 0;
  private mapHeight = 0;
  private map: number[][] = [];
  private mapArray: Drawable[] = [];
  private pacmanPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(public wallSize: number) {}

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

    console.log({
      column,
      row,
    });

    return this.map[row][column] === 1;
  };

  mapInit(map: number[][]) {
    this.map = map;
    this.mapWidth = this.wallSize * map[0].length;
    this.mapHeight = this.wallSize * map.length;

    map.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        switch (column) {
          case 0:
            this.mapArray.push(
              new Dot(
                this.wallSize * columnIndex + this.wallSize / 2,
                this.wallSize * rowIndex + this.wallSize / 2,
                this.wallSize / 10,
                'white',
              ),
            );
            break;

          case 1:
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

          case 4:
            this.pacmanPosition = {
              x: this.wallSize * columnIndex,
              y: this.wallSize * rowIndex,
            };
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

    // this.map.forEach((wall) => {
    //   context.strokeStyle = 'yellow';
    //   context.strokeRect(wall.x, wall.y, 32, 32);
    // });
  }

  getPacman(velocity: number) {
    return new Pacman(
      this.pacmanPosition.x,
      this.pacmanPosition.y,
      this.wallSize,
      velocity,
      this,
    );
  }
}
