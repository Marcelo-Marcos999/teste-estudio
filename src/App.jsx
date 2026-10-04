import React, { useState, useEffect } from 'react';
import { useTicTacToe } from './hooks/useTicTacToe';
import { loadTheme, saveTheme } from './utils/storage';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import ResetButton from './components/ResetButton';
import Scoreboard from './components/Scoreboard';
import styles from './App.module.css';

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
    toggleGameMode,
  } = useTicTacToe();

  const [theme, setTheme] = useState(() => loadTheme());

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    saveTheme(theme);
  }, [theme]);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>Jogo da Velha</h1>
        <StatusBar
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          winner={winner}
          theme={theme}
          gameMode={gameMode}
          onToggleTheme={toggleTheme}
        />
        <div className={styles.boardWrapper}>
          <Board cells={cells} onCellClick={makeMove} disabled={gameOver} theme={theme} />
        </div>
        <div className={styles.controls}>
          <ResetButton
            onClick={resetGame}
            disabled={!gameOver && cells.every(cell => cell === null)}
            theme={theme}
            gameMode={gameMode}
            onToggleGameMode={toggleGameMode}
          />
          <Scoreboard scores={scores} onResetScores={resetScores} theme={theme} gameMode={gameMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
