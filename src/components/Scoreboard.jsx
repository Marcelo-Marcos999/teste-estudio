import styles from './Scoreboard.module.css';

function Scoreboard({ scores, onResetScores }) {
  const { xWins = 0, oWins = 0, draws = 0 } = scores || {};

  return (
    <section className={styles.scoreboard} aria-label="Placar">
      <h2 className={styles.title}>Placar</h2>
      <div className={styles.scores}>
        <div className={styles.scoreItem}>
          <span className={styles.label}>X</span>
          <span className={styles.value}>{xWins}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.label}>O</span>
          <span className={styles.value}>{oWins}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.label}>Empates</span>
          <span className={styles.value}>{draws}</span>
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
