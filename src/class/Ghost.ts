import ghostImage from 'assets/img/ghost.png';
import scaredGhostImage from 'assets/img/scaredGhost.png';
import scaredGhostImage2 from 'assets/img/scaredGhost2.png';
import { WallMap } from 'class/WallMap';

export class Ghost {
  isRender = true;
  normalGhost: HTMLImageElement | null = null;
  scaredGhost: HTMLImageElement | null = null;
  scaredGhost2: HTMLImageElement | null = null;
  currentImage: HTMLImageElement | null = null;

  constructor(
    public x: number,
    public y: number,
    public size: number,
    public velocity: number,
    public color: string,
    public wallMap: WallMap,
  ) {
    this.#loadImages();
  }

  #loadImages = () => {
    this.normalGhost = new Image();
    this.normalGhost.src = ghostImage;

    this.scaredGhost = new Image();
    this.scaredGhost.src = scaredGhostImage;

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = scaredGhostImage2;

    this.currentImage = this.normalGhost;
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
    // this.x += this.velocity;
    // this.y += this.velocity;

    this.draw(ctx);
  }
}
