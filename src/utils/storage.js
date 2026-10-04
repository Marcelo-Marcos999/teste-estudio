import { checkWinner } from './checkWinner.js';

const STORAGE_KEY = 'tictactoe-state';

const DEFAULT_STATE = {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  scores: { X: 0, O: 0, draws: 0 },
  winner: null,
};

function isValidCells(cells) {
  return Array.isArray(cells) && cells.length === 9 && cells.every(c => c === null || c === 'X' || c === 'O');
}

function validateState(state) {
  if (!isValidCells(state.cells)) {
    return { ...DEFAULT_STATE, scores: state.scores || DEFAULT_STATE.scores };
  }

  const actualResult = checkWinner(state.cells);
  const hasWinner = state.winner === 'X' || state.winner === 'O';
  const isDraw = state.winner === 'draw';

  if (hasWinner && actualResult !== state.winner) {
    return { ...state, winner: null, gameOver: false };
  }

  if (isDraw && actualResult !== 'draw') {
    return { ...state, winner: null, gameOver: false };
  }

  if (state.gameOver && !hasWinner && !isDraw) {
    if (actualResult === 'X' || actualResult === 'O') {
      return { ...state, winner: actualResult };
    }
    if (actualResult === 'draw') {
      return { ...state, winner: 'draw' };
    }
    return { ...state, gameOver: false };
  }

  return state;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = {
        ...DEFAULT_STATE,
        ...parsed,
        scores: {
          ...DEFAULT_STATE.scores,
          ...(parsed.scores || {}),
        },
      };
      return validateState(merged);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return DEFAULT_STATE;
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}
