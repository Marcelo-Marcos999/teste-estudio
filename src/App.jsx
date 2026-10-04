import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTicTacToe } from './hooks/useTicTacToe';
import { loadTheme, saveTheme } from './utils/storage';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import ResetButton from './components/ResetButton';
import Scoreboard from './components/Scoreboard';
import styles from './App.module.css';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadTheme());

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

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
  { value: 'medium', label: 'Médio', icon: '⚔️' },
  { value: 'hard', label: 'Difícil', icon: '🔥' },
  { value: 'impossible', label: 'Impossível', icon: '💀' },
];

function DifficultySelector({ difficulty, onSelect, disabled }) {
  const current = DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);

  return (
    <div className={styles.difficultyWrapper}>
      <div className={styles.difficultyHeader}>
        <span className={styles.difficultyLabel}>Dificuldade</span>
        <span className={styles.difficultyCurrent} aria-live="polite">
          {current ? `${current.icon} ${current.label}` : ''}
        </span>
      </div>
      <div className={styles.difficultySelector} role="group" aria-label="Nível de dificuldade">
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${styles.difficultyButton} ${difficulty === opt.value ? styles.difficultyButtonActive : ''}`}
            onClick={() => onSelect(opt.value)}
            aria-pressed={difficulty === opt.value}
            disabled={disabled}
          >
            <span className={styles.difficultyIcon} aria-hidden="true">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const {
    cells,
    currentPlayer,
    gameOver,
    winner,
    winningLine,
    scores,
    gameMode,
    difficulty,
    isAiThinking,
    makeMove,
    resetGame,
    resetScores,
    setGameMode,
    setDifficulty,
  } = useTicTacToe();

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>Jogo da Velha</h1>
        <StatusBar
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          winner={winner}
          theme={theme}
          onToggleTheme={toggleTheme}
          gameMode={gameMode}
          isAiThinking={isAiThinking}
        />
        <ModeSelector gameMode={gameMode} onSelect={setGameMode} />
        {gameMode === 'pvai' && (
          <DifficultySelector
            difficulty={difficulty}
            onSelect={setDifficulty}
            disabled={isAiThinking}
          />
        )}
        <div className={styles.boardWrapper}>
          <Board
            cells={cells}
            onCellClick={makeMove}
            disabled={gameOver || isAiThinking}
            winningLine={winningLine}
            isAiThinking={isAiThinking}
          />
        </div>
        <div className={styles.controls}>
          <ResetButton onClick={resetGame} disabled={!gameOver && cells.every(cell => cell === null)} />
          <Scoreboard scores={scores} onResetScores={resetScores} />
        </div>
      </div>
    </div>
  );
}

function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
