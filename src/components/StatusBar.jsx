import styles from './StatusBar.module.css';

const messageStyle = {
  flex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginLeft: 'auto',
};

const spinnerStyle = {
  display: 'inline-block',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  border: '2px solid currentColor',
  borderTopColor: 'transparent',
  animation: 'statusBarSpin 0.8s linear infinite',
};

const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  impossible: 'Impossível',
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
  isAiThinking,
}) {
  const handleToggleTheme = onToggleTheme || toggleTheme || (() => {});

  let message;
  let stateClass = '';
  if (gameOver) {
    if (winner === 'draw') {
      message = 'Empate!';
      stateClass = styles['statusBar--draw'];
    } else if (gameMode === 'pvai') {
      message = winner === 'O' ? 'IA venceu!' : 'Você venceu!';
      stateClass = winner === 'X' ? styles['statusBar--xWin'] : styles['statusBar--oWin'];
    } else {
      message = `${winner} venceu!`;
      stateClass = winner === 'X' ? styles['statusBar--xWin'] : styles['statusBar--oWin'];
    }
  } else if (isAiThinking) {
    message = 'IA pensando...';
    stateClass = styles['statusBar--oTurn'];
  } else {
    message = gameMode === 'pvai' ? 'Sua vez' : `Vez do ${currentPlayer}`;
    stateClass = currentPlayer === 'X' ? styles['statusBar--xTurn'] : styles['statusBar--oTurn'];
  }

  const modeLabel = gameMode === 'pvai' ? 'PvIA' : 'PvP';
  const difficultyLabel = DIFFICULTY_LABELS[difficulty] || '—';
  const isDark = theme === 'dark';

  return (
    <div className={`${styles.statusBar} ${stateClass}`}>
      <style>{'@keyframes statusBarSpin { to { transform: rotate(360deg); } }'}</style>
      <span style={messageStyle} aria-live="polite" aria-atomic="true">
        {isAiThinking && <span style={spinnerStyle} aria-hidden="true" />}
        <span>{message}</span>
      </span>
      <div style={actionsStyle}>
        <span className={styles.modeBadge} aria-label={`Modo de jogo: ${modeLabel}`}>
          {modeLabel}
        </span>
        <span
          className={styles.modeBadge}
          aria-label={`Nível de dificuldade: ${difficultyLabel}`}
        >
          {difficultyLabel}
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
