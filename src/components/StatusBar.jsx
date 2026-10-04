import styles from './StatusBar.module.css';

const messageStyle = {
  flex: 1,
  textAlign: 'center',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginLeft: 'auto',
};

const modeBadgeStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  padding: '4px 8px',
  borderRadius: '999px',
  border: '1px solid currentColor',
  opacity: 0.85,
  whiteSpace: 'nowrap',
};

const themeButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  padding: 0,
  fontSize: '1rem',
  lineHeight: 1,
  cursor: 'pointer',
  borderRadius: '50%',
  border: '1px solid currentColor',
  background: 'transparent',
  color: 'inherit',
  transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
};

function StatusBar({
  currentPlayer,
  gameOver,
  winner,
  theme,
  onToggleTheme,
  toggleTheme,
  gameMode,
}) {
  const handleToggleTheme = onToggleTheme || toggleTheme || (() => {});

  let message;
  let stateClass = '';
  if (gameOver) {
    if (winner === 'draw') {
      message = 'Empate!';
      stateClass = styles['statusBar--draw'];
    } else {
      message = `${winner} venceu!`;
      stateClass = winner === 'X' ? styles['statusBar--xWin'] : styles['statusBar--oWin'];
    }
  } else {
    message = `Vez do ${currentPlayer}`;
    stateClass = currentPlayer === 'X' ? styles['statusBar--xTurn'] : styles['statusBar--oTurn'];
  }

  const modeLabel = gameMode === 'pvai' ? 'PvIA' : 'PvP';
  const isDark = theme === 'dark';

  return (
    <div className={`${styles.statusBar} ${stateClass}`}>
      <span style={messageStyle} aria-live="polite" aria-atomic="true">
        {message}
      </span>
      <div style={actionsStyle}>
        <span style={modeBadgeStyle} aria-label={`Modo de jogo: ${modeLabel}`}>
          {modeLabel}
        </span>
        <button
          type="button"
          style={themeButtonStyle}
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
