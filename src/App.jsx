import React from 'react';
import { useTicTacToe } from '../hooks/useTicTacToe';
import Board from '../components/Board';
import StatusBar from '../components/StatusBar';
import ResetButton from '../components/ResetButton';
import Scoreboard from '../components/Scoreboard';
import styles from './App.module.css';

function App() {
  const {
    cells,
    currentPlayer,
    gameOver,
    winner,
    scores,
    makeMove,
    resetGame,
    resetScores,
  } = useTicTacToe();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Jogo da Velha</h1>
      </header>
      <main className={styles.main}>
        <StatusBar currentPlayer={currentPlayer} gameOver={gameOver} winner={winner} />
        <Board cells={cells} onCellClick={makeMove} disabled={gameOver} />
        <div className={styles.controls}>
          <ResetButton onClick={resetGame} disabled={!gameOver && cells.every(cell => cell === null)} />
        </div>
        <Scoreboard scores={scores} onResetScores={resetScores} />
      </main>
    </div>
  );
}

export default App;
