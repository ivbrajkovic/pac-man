import { Pellet } from 'class/Pellet';

const colors = ['white', 'orange', 'red'];

export class PowerPellet extends Pellet {
  isRender = true;
  radius = 0;
  colorIndex = 0;
  color = colors[this.colorIndex];

  constructor(public x: number, public y: number, radius: number) {
    super(x, y, radius);
    this.radius = radius + 2;
    this.#colorChangeInterval();
  }

  #colorChangeInterval = () => {
    if (!this.isRender) return;
    this.colorIndex = ++this.colorIndex % colors.length;
    this.color = colors[this.colorIndex];
    setTimeout(this.#colorChangeInterval, 100);
  };
}
