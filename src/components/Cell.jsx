import React from 'react';
import styles from './Cell.module.css';

function Cell({ value, index, onClick, disabled }) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const content = value ? value : 'vazio';
  const ariaLabel = `Linha ${row}, Coluna ${col}, ${content}`;

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick(index);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.cell} ${value ? styles.filled : ''} ${value === 'X' ? styles.x : value === 'O' ? styles.o : ''}`}
      onClick={() => !disabled && onClick(index)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <span className={styles.content} aria-hidden="true">
        {value}
      </span>
    </button>
  );
}

export default Cell;
