import styles from './StatusBar.module.css';

function StatusBar({ currentPlayer, gameOver, winner }) {
  let message;
  if (gameOver) {
    if (winner === 'draw') {
      message = 'Empate!';
    } else {
      message = `${winner} venceu!`;
    }
  } else {
    message = `Vez do ${currentPlayer}`;
  }

  return (
    <div className={styles.statusBar} aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

export default StatusBar;
