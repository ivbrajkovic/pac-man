export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export abstract class Player {
  constructor(public x: number, public y: number, public rectSize: number) {}
  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract update(ctx: CanvasRenderingContext2D): void;

  getRect(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.rectSize,
      height: this.rectSize,
    };
  }

  getRectPosition(): Rect {
    const x = this.x - this.rectSize / 2;
    const y = this.y - this.rectSize / 2;
    return { x, y, width: this.rectSize, height: this.rectSize };
  }

  intersects(rect: Rect): boolean {
    const rect1 = this.getRect();
    return (
      rect1.x < rect.x + rect.width &&
      rect1.x + rect1.width > rect.x &&
      rect1.y < rect.y + rect.height &&
      rect1.y + rect1.height > rect.y
    );
  }
}
