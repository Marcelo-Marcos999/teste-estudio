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

function App() {
  const {
    cells,
    currentPlayer,
    gameOver,
    winner,
    scores,
    gameMode,
    makeMove,
    resetGame,
    resetScores,
    setGameMode,
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
        />
        <ModeSelector gameMode={gameMode} onSelect={setGameMode} />
        <div className={styles.boardWrapper}>
          <Board cells={cells} onCellClick={makeMove} disabled={gameOver} />
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
