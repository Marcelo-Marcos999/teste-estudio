import React from 'react';
import { useTicTacToe } from './hooks/useTicTacToe';
import { useTheme } from './context/ThemeContext';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import ResetButton from './components/ResetButton';
import Scoreboard from './components/Scoreboard';
import styles from './App.module.css';

function ModeSelector({ gameMode, onSelect }) {
  return (
    <div className={styles.modeSelector} role="group" aria-label="Modo de jogo">
      <button
        type="button"
        className={`${styles.modeButton} ${gameMode === 'pvp' ? styles.modeButtonActive : ''}`}
        onClick={() => onSelect('pvp')}
        aria-pressed={gameMode === 'pvp'}
      >
        👥 PvP
      </button>
      <button
        type="button"
        className={`${styles.modeButton} ${gameMode === 'pvai' ? styles.modeButtonActive : ''}`}
        onClick={() => onSelect('pvai')}
        aria-pressed={gameMode === 'pvai'}
      >
        🤖 PvIA
      </button>
    </div>
  );
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Fácil', icon: '🌱' },
  { value: 'medium', label: 'Médio', icon: '⚡' },
  { value: 'hard', label: 'Difícil', icon: '🔥' },
  { value: 'impossible', label: 'Impossível', icon: '💀' },
];

function DifficultySelector({ difficulty, onSelect, disabled }) {
  const current = DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);

  return (
    <div className={styles.difficultyWrapper}>
      <div
        className={styles.difficultySelector}
        role="group"
        aria-label="Nível de dificuldade"
      >
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${styles.difficultyButton} ${
              difficulty === opt.value ? styles.difficultyButtonActive : ''
            }`}
            onClick={() => onSelect(opt.value)}
            aria-pressed={difficulty === opt.value}
            disabled={disabled}
          >
            <span className={styles.difficultyIcon} aria-hidden="true">
              {opt.icon}
            </span>
            <span className={styles.difficultyLabel}>{opt.label}</span>
          </button>
        ))}
      </div>
      <p className={styles.difficultyHint} aria-live="polite">
        Nível atual: <strong>{current ? current.label : '—'}</strong>
      </p>
    </div>
  );
}

function App() {
  const {
    cells,
    currentPlayer,
    gameOver,
    winner,
    scores,
    gameMode,
    difficulty,
    isAiThinking,
    winningLine,
    makeMove,
    resetGame,
    resetScores,
    setGameMode,
    setDifficulty,
  } = useTicTacToe();

  const { theme, toggleTheme } = useTheme();

  const isBoardDisabled = gameOver || isAiThinking;

  return (
    <div className={styles.app}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleGlow}>Jogo da Velha</span>
          </h1>
          <p className={styles.subtitle}>Desafie a IA em quatro níveis de dificuldade</p>
        </header>
        <StatusBar
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          winner={winner}
          theme={theme}
          onToggleTheme={toggleTheme}
          gameMode={gameMode}
          difficulty={difficulty}
          isAiThinking={isAiThinking}
        />
        <div className={styles.card}>
          <ModeSelector gameMode={gameMode} onSelect={setGameMode} />
          <DifficultySelector
            difficulty={difficulty}
            onSelect={setDifficulty}
            disabled={isAiThinking}
          />
        </div>
        <div className={styles.boardWrapper}>
          <Board
            cells={cells}
            onCellClick={makeMove}
            disabled={isBoardDisabled}
            winningLine={winningLine}
          />
        </div>
        <div className={styles.controls}>
          <ResetButton
            onClick={resetGame}
            disabled={!gameOver && cells.every((cell) => cell === null)}
          />
          <Scoreboard
            scores={scores}
            onResetScores={resetScores}
            difficulty={difficulty}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
