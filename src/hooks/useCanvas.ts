import { useEffect, useState } from 'react';

const DEBOUNCE_TIME = 250;

export const useCanvas = () => {
  const [{ canvas, context }, setState] = useState<{
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
  }>({
    canvas: null,
    context: null,
  });

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = 'black';
    setState({ canvas, context });
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const handler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let timeout: number;
    const handlerDebounced = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handler, DEBOUNCE_TIME);
    };

    addEventListener('resize', handlerDebounced);
    return () => {
      removeEventListener('resize', handlerDebounced);
    };
  }, [canvas]);

  return { canvas, context };
};
