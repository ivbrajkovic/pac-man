import { useEffect } from 'react';

import { Pacman } from 'class/Pacman';
import { WallMap } from 'class/WallMap';
import { useCanvas } from 'hooks/useCanvas';

export const usePacman = () => {
  // const { canvas, context } = useCanvas();

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('canvas is null');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!context) throw new Error('context is null');

    const rectSize = 32;

    // 1 - wall
    // 0 - dot
    // 4 - pacman
    // 5 - empty
    // 6 - ghost
    const map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const gameMap = new WallMap(rectSize);
    gameMap.mapInit(map);
    gameMap.setCanvasSize(canvas);

    const velocity = 1;
    const pacman = gameMap.getPacman(velocity);
    pacman.startKeyDownListener();

    const ghost = gameMap.getGhosts(velocity);
    console.log('🚀 ~ file: usePacman.ts:46 ~ useEffect ~ ghost:', ghost);

    let isTicking = true;
    const animation = () => {
      if (!isTicking) return;
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
      gameMap.draw(context);
      pacman.update(context);
      ghost.forEach((g) => g.update(context));
      requestAnimationFrame(animation);
    };
    animation();

    return () => {
      isTicking = false;
      pacman.stopKeyDownListener();
    };
  }, []);
};
