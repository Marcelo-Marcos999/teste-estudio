import styles from './StatusBar.module.css';

function StatusBar({ currentPlayer, gameOver, winner, theme, onToggleTheme, gameMode }) {
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
    <div
      className={`${styles.statusBar} ${theme === 'dark' ? styles.dark : ''}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.message}>{message}</span>
      <div className={styles.indicators}>
        <span className={styles.modeIndicator}>
          Modo: {gameMode === 'pvai' ? 'PvAI' : 'PvP'}
        </span>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}

export default StatusBar;
