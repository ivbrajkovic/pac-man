import { Ghost } from 'class/Ghost';
import { Pacman } from 'class/Pacman';
import { Pellet } from 'class/Pellet';
import { PowerPellet } from 'class/PowerPellet';
import { Wall } from 'class/Wall';
import { Direction, MapObject } from 'type';

export class WallMap {
  private mapWidth = 0;
  private mapHeight = 0;
  private halfWallSize = 0;
  private map: number[][] = [];
  private mapArray: (Wall | Pellet)[] = [];

  pelletCount = 0;

  onEatAllPellets?: () => void;

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
    this.map = map.map((row) => row.slice());
    this.mapArray = [];
    this.playerPositions = [];
    this.mapWidth = this.wallSize * map[0].length;
    this.mapHeight = this.wallSize * map.length;

    map.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        switch (column) {
          case MapObject.Pellet:
            this.pelletCount++;
            this.mapArray.push(
              new Pellet(
                this.wallSize * columnIndex + this.halfWallSize,
                this.wallSize * rowIndex + this.halfWallSize,
                this.wallSize / 10,
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
              ),
            );
            break;

          case MapObject.Ghost:
            {
              const isPowerPellet = Math.random() > 0.7;

              if (isPowerPellet) {
                this.map[rowIndex][columnIndex] = MapObject.PowerPellet;
                this.mapArray.push(
                  new PowerPellet(
                    this.wallSize * columnIndex + this.halfWallSize,
                    this.wallSize * rowIndex + this.halfWallSize,
                    this.wallSize / 10,
                  ),
                );
              } else {
                this.pelletCount++;
                this.map[rowIndex][columnIndex] = MapObject.Pellet;
                this.mapArray.push(
                  new Pellet(
                    this.wallSize * columnIndex + this.halfWallSize,
                    this.wallSize * rowIndex + this.halfWallSize,
                    this.wallSize / 10,
                  ),
                );
              }

              this.playerPositions.push({
                type: MapObject.Ghost,
                x: this.wallSize * columnIndex,
                y: this.wallSize * rowIndex,
              });
            }
            break;

          case MapObject.Pacman:
            this.playerPositions.push({
              type: MapObject.Pacman,
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

  eatPellet(x: number, y: number) {
    const column = x / this.wallSize;
    const row = y / this.wallSize;

    if (!Number.isInteger(column) || !Number.isInteger(row)) return;
    if (
      this.map[row][column] !== MapObject.Pellet &&
      this.map[row][column] !== MapObject.PowerPellet
    )
      return;

    const pelletType = this.map[row][column] as
      | MapObject.Pellet
      | MapObject.PowerPellet;

    this.map[row][column] = MapObject.Empty;
    const dotX = x + this.halfWallSize;
    const dotY = y + this.halfWallSize;

    const pellet = this.mapArray.find(
      (item) =>
        item.x === dotX && //
        item.y === dotY,
    ) as Pellet | undefined;

    if (!pellet) return;

    pellet.isRender = false;
    if (pelletType === MapObject.Pellet) this.pelletCount--;
    if (this.pelletCount === 0) this.onEatAllPellets?.();

    return pelletType;
  }
}
