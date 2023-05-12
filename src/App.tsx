import 'index.css';

import { useEffect, useRef } from 'react';

import { Game } from 'class/Game';
import { GameOverModal, useGameOverModal } from 'components/GameOverModal';
import { RECT_SIZE, VELOCITY } from 'components/constants';
import { map } from 'map';

const PACMAN_LIFE = 3;

function App() {
  const gameRef = useRef<Game | null>(null);
  const lifeRef = useRef<HTMLParagraphElement>(null);
  const scoreRef = useRef<HTMLParagraphElement>(null);
  const levelRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { openDialog } = useGameOverModal();

  useEffect(() => {
    const life = lifeRef.current;
    const score = scoreRef.current;
    const canvas = canvasRef.current;
    if (!life || !score || !canvas) return;

    life.innerText = PACMAN_LIFE.toString();
    score.innerText = '0';

    const game = Game.getGameInstance({
      canvas,
      map,
      rectSize: RECT_SIZE,
      velocity: VELOCITY,
      pacmanLife: PACMAN_LIFE,
    });
    game.onPacmanLifeChange = (value) => {
      life.innerText = value.toString();
    };
    game.onScoreChange = (value) => {
      score.innerText = value.toString();
    };
    game.onGameOver = () => {
      openDialog(score.innerText);
    };

    gameRef.current = game;
  }, [openDialog]);

  const handleRestart = () => {
    gameRef.current?.init();
  };

  return (
    <div>
      <GameOverModal onRestart={handleRestart} />
      <div data-text>
        <p>
          Life: <span ref={lifeRef} />
        </p>
        <p>
          Score: <span ref={scoreRef} />
        </p>
        <p>
          Level: <span ref={levelRef} />
        </p>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
