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

  // If stored winner mismatches actual, correct it
  if (hasWinner && actualResult !== state.winner) {
    return { ...state, winner: null, gameOver: false };
  }

  if (isDraw && actualResult !== 'draw') {
    return { ...state, winner: null, gameOver: false };
  }

  // If actualResult indicates a winner/draw but stored winner is null, set it
  if (actualResult !== null) {
    const newWinner = actualResult; // 'X', 'O', or 'draw'
    const newGameOver = true;
    // If already correct, keep as is (but ensure gameOver true)
    if (state.winner === newWinner && state.gameOver === true) {
      return state;
    }
    return { ...state, winner: newWinner, gameOver: newGameOver };
  }

  // No winner/draw (actualResult is null)
  // If stored gameOver is true but no winner, reset
  if (state.gameOver) {
    return { ...state, gameOver: false, winner: null };
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
