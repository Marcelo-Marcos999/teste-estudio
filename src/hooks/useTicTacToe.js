import { useState, useEffect, useCallback } from 'react';
import { checkWinner, getWinningLine } from '../utils/checkWinner';
import {
  saveState,
  loadState,
  clearState,
  loadMode,
  saveMode,
  loadDifficulty,
  saveDifficulty,
} from '../utils/storage';
import { escolherJogada } from '../utils/ai';

const INITIAL_STATE = {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  winner: null,
  scores: { xWins: 0, oWins: 0, draws: 0 },
};

export function useTicTacToe() {
  const [state, setState] = useState(() => {
    const loaded = loadState();
    return loaded ? { ...INITIAL_STATE, ...loaded } : INITIAL_STATE;
  });

  const [gameMode, setGameModeState] = useState(() => loadMode());
  const [difficulty, setDifficultyState] = useState(() => loadDifficulty());
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const makeMove = useCallback((index) => {
    setState((prev) => {
      if (prev.gameOver || prev.cells[index] !== null) {
        return prev;
      }

      const newCells = [...prev.cells];
      newCells[index] = prev.currentPlayer;

      const result = checkWinner(newCells);
      const isGameOver = result !== null;
      let newWinner = null;
      let newScores = { ...prev.scores };

      if (result === 'X') {
        newWinner = 'X';
        newScores.xWins += 1;
      } else if (result === 'O') {
        newWinner = 'O';
        newScores.oWins += 1;
      } else if (result === 'draw') {
        newWinner = 'draw';
        newScores.draws += 1;
      }

      return {
        ...prev,
        cells: newCells,
        currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
        gameOver: isGameOver,
        winner: newWinner,
        scores: newScores,
      };
    });
  }, []);

  useEffect(() => {
    if (gameMode !== 'pvai') return undefined;
    if (state.gameOver) return undefined;
    if (state.currentPlayer !== 'O') return undefined;

    setIsAiThinking(true);
    const delay = 400 + Math.floor(Math.random() * 300);
    const timer = setTimeout(() => {
      const idx = escolherJogada([...state.cells], difficulty);
      setIsAiThinking(false);
      if (idx !== null && idx !== undefined) {
        makeMove(idx);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsAiThinking(false);
    };
  }, [gameMode, state.currentPlayer, state.gameOver, state.cells, makeMove, difficulty]);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cells: Array(9).fill(null),
      currentPlayer: 'X',
      gameOver: false,
      winner: null,
    }));
  }, []);

  const resetScores = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scores: { xWins: 0, oWins: 0, draws: 0 },
    }));
  }, []);

  const setGameMode = useCallback((mode) => {
    saveMode(mode);
    setGameModeState(mode);
    setState((prev) => ({
      ...prev,
      cells: Array(9).fill(null),
      currentPlayer: 'X',
      gameOver: false,
      winner: null,
    }));
  }, []);

  const setDifficulty = useCallback((level) => {
    saveDifficulty(level);
    setDifficultyState(level);
    setState((prev) => ({
      ...prev,
      cells: Array(9).fill(null),
      currentPlayer: 'X',
      gameOver: false,
      winner: null,
    }));
  }, []);

  return {
    cells: state.cells,
    currentPlayer: state.currentPlayer,
    gameOver: state.gameOver,
    winner: state.winner,
    scores: state.scores,
    gameMode,
    difficulty,
    isAiThinking,
    winningLine: getWinningLine(state.cells),
    makeMove,
    resetGame,
    resetScores,
    setGameMode,
    setDifficulty,
  };
}
