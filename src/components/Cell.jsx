import React, { useId } from 'react';
import styles from './Cell.module.css';

// Peça "X": dois traços finos cruzados (V invertido), pontas brilhantes e
// uma linha de energia central. O traço é "desenhado" via stroke-dashoffset.
function XMark({ gradientId }) {
  const stroke = `url(#${gradientId})`;
  return (
    <svg className={styles.piece} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className={styles.stopA} />
          <stop offset="100%" className={styles.stopB} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={stroke} strokeWidth="7" strokeLinecap="round">
        <line className={styles.stroke1} pathLength="100" x1="24" y1="24" x2="76" y2="76" />
        <line className={styles.stroke2} pathLength="100" x1="76" y1="24" x2="24" y2="76" />
      </g>
      <line
        className={styles.energy}
        pathLength="100"
        x1="50"
        y1="32"
        x2="50"
        y2="68"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g className={styles.tips}>
        <circle cx="24" cy="24" r="3.4" />
        <circle cx="76" cy="24" r="3.4" />
        <circle cx="24" cy="76" r="3.4" />
        <circle cx="76" cy="76" r="3.4" />
      </g>
    </svg>
  );
}

// Peça "O": anel duplo concêntrico — externo fino e interno com arco
// incompleto, simulando um circuito com um nó de conexão.
function OMark({ gradientId }) {
  const stroke = `url(#${gradientId})`;
  return (
    <svg className={styles.piece} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className={styles.stopA} />
          <stop offset="100%" className={styles.stopB} />
        </linearGradient>
      </defs>
      <circle
        className={styles.ringOuter}
        pathLength="100"
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        className={styles.ringInner}
        pathLength="100"
        d="M50 22 A 28 28 0 1 1 22 50"
        fill="none"
        stroke={stroke}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle className={styles.node} cx="50" cy="22" r="4" />
    </svg>
  );
}

function Cell({ value, index, onClick, disabled, winning = false, draw = false }) {
  const gradientId = `piece-${useId().replace(/[:]/g, '')}`;
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
    value ? styles.pop : '',
    value === 'X' ? styles.x : value === 'O' ? styles.o : '',
    winning ? styles.winning : '',
    winning ? styles.glow : '',
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
        {value === 'X' && <XMark gradientId={gradientId} />}
        {value === 'O' && <OMark gradientId={gradientId} />}
      </span>
    </button>
  );
}

export default Cell;
