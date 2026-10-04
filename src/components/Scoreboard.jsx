import { useEffect, useRef, useState } from 'react';
import styles from './Scoreboard.module.css';

function useCountUp(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    const from = displayRef.current;
    if (from === target) return undefined;

    let rafId;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return display;
}

function Scoreboard({
  scores,
  onResetScores,
  theme,
  gameMode = 'pvp',
  currentPlayer = null,
  gameOver = false,
}) {
  const { xWins = 0, oWins = 0, draws = 0 } = scores || {};

  const xDisplay = useCountUp(xWins);
  const oDisplay = useCountUp(oWins);
  const drawDisplay = useCountUp(draws);

  const isPvAi = gameMode === 'pvai';
  const xLabel = isPvAi ? 'Você' : 'X';
  const oLabel = isPvAi ? 'IA' : 'O';

  const xActive = !gameOver && currentPlayer === 'X';
  const oActive = !gameOver && currentPlayer === 'O';

  return (
    <section
      className={styles.scoreboard}
      data-theme={theme}
      aria-label="Placar"
    >
      <h2 className={styles.title}>Placar</h2>
      <div className={styles.scores}>
        <div
          className={`${styles.scoreItem} ${styles.scoreX} ${xActive ? styles.activeTurn : ''}`}
        >
          <span className={styles.scoreLabel}>
            {xActive && <span className={styles.turnDot} aria-hidden="true" />}
            {xLabel}
          </span>
          <span
            className={styles.scoreValue}
            aria-label={`Vitórias de ${xLabel}: ${xWins}`}
          >
            {xDisplay}
          </span>
        </div>
        <div
          className={`${styles.scoreItem} ${styles.scoreO} ${oActive ? styles.activeTurn : ''}`}
        >
          <span className={styles.scoreLabel}>
            {oActive && <span className={styles.turnDot} aria-hidden="true" />}
            {oLabel}
          </span>
          <span
            className={styles.scoreValue}
            aria-label={`Vitórias de ${oLabel}: ${oWins}`}
          >
            {oDisplay}
          </span>
        </div>
        <div className={`${styles.scoreItem} ${styles.scoreDraw}`}>
          <span className={styles.scoreLabel}>Empates</span>
          <span
            className={styles.scoreValue}
            aria-label={`Empates: ${draws}`}
          >
            {drawDisplay}
          </span>
        </div>
      </div>
      {onResetScores && (
        <button
          className={styles.resetButton}
          type="button"
          onClick={onResetScores}
          aria-label="Zerar placar"
        >
          Zerar Placar
        </button>
      )}
    </section>
  );
}

export default Scoreboard;
