import styles from './StatusBar.module.css';

const DIFFICULTY_LABELS = {
  easy: { label: 'Fácil', icon: '🌱' },
  medium: { label: 'Médio', icon: '⚔️' },
  hard: { label: 'Difícil', icon: '🔥' },
  impossible: { label: 'Impossível', icon: '💀' },
};

function StatusBar({
  currentPlayer,
  gameOver,
  winner,
  theme,
  onToggleTheme,
  toggleTheme,
  gameMode,
  difficulty,
  isAiThinking = false,
}) {
  const handleToggleTheme = onToggleTheme || toggleTheme || (() => {});

  let message;
  let stateClass = '';
  if (gameOver) {
    if (winner === 'draw') {
      message = 'Empate! Ninguém venceu desta vez.';
      stateClass = styles['statusBar--draw'];
    } else {
      message = `${winner} venceu! 🎉`;
      stateClass = winner === 'X' ? styles['statusBar--xWin'] : styles['statusBar--oWin'];
    }
  } else if (isAiThinking) {
    message = 'IA pensando';
    stateClass = styles['statusBar--thinking'];
  } else {
    message = `Vez do ${currentPlayer}`;
    stateClass = currentPlayer === 'X' ? styles['statusBar--xTurn'] : styles['statusBar--oTurn'];
  }

  const modeLabel = gameMode === 'pvai' ? 'PvIA' : 'PvP';
  const isDark = theme === 'dark';
  const difficultyInfo = DIFFICULTY_LABELS[difficulty];

  return (
    <div className={`${styles.statusBar} ${stateClass}`}>
      <span className={styles.message} aria-live="polite" aria-atomic="true">
        {message}
        {isAiThinking && !gameOver && (
          <span className={styles.thinkingDots} aria-hidden="true">
            <span className={styles.thinkingDot} />
            <span className={styles.thinkingDot} />
            <span className={styles.thinkingDot} />
          </span>
        )}
      </span>
      <div className={styles.actions}>
        {gameMode === 'pvai' && difficultyInfo && (
          <span
            className={styles.difficultyBadge}
            aria-label={`Dificuldade: ${difficultyInfo.label}`}
          >
            {difficultyInfo.icon} {difficultyInfo.label}
          </span>
        )}
        <span className={styles.modeBadge} aria-label={`Modo de jogo: ${modeLabel}`}>
          {modeLabel}
        </span>
        <button
          type="button"
          className={styles.themeButton}
          onClick={handleToggleTheme}
          aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={isDark ? 'Tema claro' : 'Tema escuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}

export default StatusBar;
