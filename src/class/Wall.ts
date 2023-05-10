export class Wall {
  color = '#3a7bd5';
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
