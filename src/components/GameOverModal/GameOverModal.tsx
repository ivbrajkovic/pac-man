import { FC, useEffect, useRef } from 'react';

import styles from 'components/GameOverModal/GameOverModal.module.css';

type GameOverModalProps = {
  onRestart: () => void;
};

const GameOverModal: FC<GameOverModalProps> = (props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onRestartRef = useRef(props.onRestart);
  useEffect(() => {
    onRestartRef.current = props.onRestart;
  }, [props.onRestart]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key !== 'Enter') return;
      dialog.close();
      onRestartRef.current();
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id="game-over-modal"
      className={styles['game-over-modal']}
    >
      <h1>Game Over</h1>
      <p>Your score: 0</p>
      <p>Press Enter to restart</p>
    </dialog>
  );
};
export default GameOverModal;
