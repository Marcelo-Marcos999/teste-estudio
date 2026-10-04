import React from 'react';
import styles from './ResetButton.module.css';

const ResetButton = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      className={styles.resetButton}
      onClick={onClick}
      disabled={disabled}
      aria-label="Reiniciar jogo"
    >
      Reiniciar
    </button>
  );
};

export default ResetButton;
