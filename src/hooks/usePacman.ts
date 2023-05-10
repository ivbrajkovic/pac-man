import { useEffect } from 'react';

import { Ghost } from 'class/Ghost';
import { Pacman } from 'class/Pacman';
import { WallMap } from 'class/WallMap';

export const usePacman = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('canvas is null');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!context) throw new Error('context is null');

    const rectSize = 32;

    // 1 - wall
    // 0 - pellet
    // 4 - pacman
    // 5 - empty
    // 6 - ghost
    // 7 - power pellet
    const map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 6, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 6, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const gameMap = new WallMap(rectSize);
    gameMap.mapInit(map);
    gameMap.setCanvasSize(canvas);

    const velocity = 1;
    const ghosts = gameMap.getGhosts(velocity);
    const pacman = gameMap.getPacman(velocity);

    pacman.startKeyDownListener();
    pacman.onStartMove = () => ghosts.forEach((g) => g.startMoving());
    pacman.onEatPowerPellet = () => ghosts.forEach((g) => g.setScared());

    const pacmanGhostCollision = (pacman: Pacman, ghosts: Ghost[]) => {
      ghosts.forEach((g, i) => {
        const ghostRect = g.getRect();
        if (!pacman.intersects(ghostRect)) return;

        if (g.isScared) {
          g.remove();
          ghosts.splice(i, 1);
        } else {
          isTicking = false;
          alert('Game Over');
          window.location.reload();
        }
      });
    };

    let isTicking = true;
    const animation = () => {
      if (!isTicking) return;
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
      gameMap.draw(context);
      pacman.update(context);
      ghosts.forEach((g) => g.update(context));
      pacmanGhostCollision(pacman, ghosts);
      requestAnimationFrame(animation);
    };
    animation();

    return () => {
      isTicking = false;
      pacman.stopKeyDownListener();
    };
  }, []);
};
