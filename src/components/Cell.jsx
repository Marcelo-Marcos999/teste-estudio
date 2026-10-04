import React from 'react';
import styles from './Cell.module.css';

function Cell({ value, index, onClick, disabled, winning = false, draw = false }) {
  const content = value || 'vazia';
  const ariaLabel = `Célula ${index + 1}, ${content}`;

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick(index);
    }
  };

  const classNames = [
    styles.cell,
    value ? styles.filled : '',
    value === 'X' ? styles.x : value === 'O' ? styles.o : '',
    winning ? styles.winning : '',
    draw ? styles.draw : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="gridcell"
      className={classNames}
      style={{ animationDelay: `${index * 50}ms` }}
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
