import { useState, useEffect, useCallback } from 'react';
import { checkWinner } from '../utils/checkWinner';
import { saveState, loadState, clearState, loadMode, saveMode } from '../utils/storage';
import { getBestMove } from '../utils/ai';

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

    const timer = setTimeout(() => {
      const idx = getBestMove([...state.cells], 'O');
      if (idx !== null && idx !== undefined) {
        makeMove(idx);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [gameMode, state.currentPlayer, state.gameOver, state.cells, makeMove]);

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

  return {
    cells: state.cells,
    currentPlayer: state.currentPlayer,
    gameOver: state.gameOver,
    winner: state.winner,
    scores: state.scores,
    gameMode,
    makeMove,
    resetGame,
    resetScores,
    setGameMode,
  };
}
