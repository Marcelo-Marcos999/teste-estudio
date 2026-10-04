import React from 'react';
import styles from './ResetButton.module.css';

const RefreshIcon = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const Spinner = () => (
  <svg
    className={styles.spinner}
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </svg>
);

const ResetButton = ({ onClick, disabled = false, loading = false }) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      className={styles.resetButton}
      onClick={onClick}
      disabled={isDisabled}
      aria-label="Reiniciar jogo"
      aria-busy={loading}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        {loading ? <Spinner /> : <RefreshIcon />}
      </span>
      <span>{loading ? 'Reiniciando...' : 'Reiniciar'}</span>
    </button>
  );
};

export default ResetButton;
