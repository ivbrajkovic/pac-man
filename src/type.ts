export enum MapObject {
  Pellet,
  Wall,
  Pacman = 4,
  Empty = 5,
  Ghost = 6,
  PowerPellet = 7,
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export const getRandomDirection = () =>
  Math.floor(Math.random() * 4) as Direction;
