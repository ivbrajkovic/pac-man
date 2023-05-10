import { useCallback, useEffect, useRef } from 'react';

export const useGameOverModal = () => {
  const dialogRef = useRef<HTMLDialogElement>();
  useEffect(() => {
    dialogRef.current = document.getElementById(
      'game-over-modal',
    ) as HTMLDialogElement;
  }, []);

  const openDialog = useCallback((score: string) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dialog.querySelector('p')!.innerText = 'Your score: ' + score;
    dialog.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  return { dialogRef, openDialog, closeDialog };
};
