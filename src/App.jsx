import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTicTacToe } from './hooks/useTicTacToe';
import { useTheme } from './context/ThemeContext';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import ResetButton from './components/ResetButton';
import Scoreboard from './components/Scoreboard';
import { loadSound, saveSound } from './utils/storage';
import { playMove, playWin, playDraw } from './utils/sound';
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

  const [soundEnabled, setSoundEnabled] = useState(() => loadSound());
  const prevGameOver = useRef(false);

  const isBoardDisabled = gameOver || isAiThinking;

  // Efeitos sonoros reativos ao fim da partida.
  useEffect(() => {
    if (gameOver && !prevGameOver.current && soundEnabled) {
      if (winner === 'draw') {
        playDraw();
      } else if (winner) {
        playWin();
      }
    }
    prevGameOver.current = gameOver;
  }, [gameOver, winner, soundEnabled]);

  const handleMove = useCallback(
    (index) => {
      if (gameOver || cells[index] !== null) return;
      if (soundEnabled) playMove();
      makeMove(index);
    },
    [cells, gameOver, soundEnabled, makeMove]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      saveSound(!prev);
      return !prev;
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.soundButton}
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
              aria-pressed={soundEnabled}
              title={soundEnabled ? 'Som ligado' : 'Som desligado'}
            >
              <span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
            </button>
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleGlow} data-text="TIC//TAC//TOE">
              TIC//TAC//TOE
            </span>
            <span className={styles.visuallyHidden}>Jogo da Velha</span>
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
            onCellClick={handleMove}
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
            theme={theme}
            gameMode={gameMode}
            currentPlayer={currentPlayer}
            gameOver={gameOver}
            winner={winner}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
