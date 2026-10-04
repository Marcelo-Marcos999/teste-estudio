import { IconTheme } from './icons';
import styles from './StatusBar.module.css';

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
      <span className={styles.prompt} aria-hidden="true">&gt;_</span>
      <span className={styles.message} aria-live="polite" aria-atomic="true">
        {isAiThinking && <span className={styles.spinner} aria-hidden="true" />}
        <span className={styles.messageText} key={message}>
          {message}
        </span>
        <span className={styles.cursor} aria-hidden="true" />
      </span>
      <div className={styles.actions}>
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
          <IconTheme className={styles.themeIcon} />
        </button>
      </div>
    </div>
  );
}

export default StatusBar;
