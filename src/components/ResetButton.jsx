import React from 'react';
import styles from './ResetButton.module.css';

const ResetButton = ({
  onClick,
  disabled = false,
  gameMode = 'pvp',
  onToggleGameMode,
}) => {
  return (
    <>
      <button
        type="button"
        className={styles.resetButton}
        onClick={onClick}
        disabled={disabled}
        aria-label="Reiniciar jogo"
      >
        Reiniciar
      </button>
      <button
        type="button"
        className={styles.modeButton}
        onClick={onToggleGameMode}
        aria-label="Alternar modo de jogo"
      >
        Modo: {gameMode === 'pvai' ? 'PvAI' : 'PvP'}
      </button>
    </>
  );
};

export default ResetButton;
