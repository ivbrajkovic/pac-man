/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect, useRef } from 'react';

const GAME_OVER_TEXT = 'Game Over';
const GAME_WON_TEXT = 'You Won!';

export const useGameOverModal = () => {
  const dialogRef = useRef<HTMLDialogElement>();
  useEffect(() => {
    dialogRef.current = document.getElementById(
      'game-over-modal',
    ) as HTMLDialogElement;
  }, []);

  const openDialog = useCallback((won: boolean, score: string) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const lastScore = +(localStorage.getItem('pacmanLastScore') ?? '0');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dialog.querySelector('h1')!.innerText = won
      ? GAME_WON_TEXT
      : GAME_OVER_TEXT;

    const bestScoreParagraph = dialog.querySelector(
      'p:nth-child(2)',
    )! as HTMLParagraphElement;
    bestScoreParagraph.textContent = `Best Score: ${lastScore} `;

    const scoreParagraph = dialog.querySelector(
      'p:nth-child(3)',
    )! as HTMLParagraphElement;
    scoreParagraph.textContent = `Your Score: ${score}`;

    localStorage.setItem(
      'pacmanLastScore',
      Math.max(Number(lastScore), Number(score)).toString(),
    );

    dialog.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  return { dialogRef, openDialog, closeDialog };
};
