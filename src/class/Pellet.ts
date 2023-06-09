export class Pellet {
  isRender = true;
  color = 'white';
  constructor(public x: number, public y: number, public radius: number) {}
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isRender) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
