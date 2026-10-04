import { checkWinner } from './checkWinner.js';

const STORAGE_KEY = 'tictactoe-state';
const THEME_KEY = 'tic-tac-toe-theme';
const MODE_KEY = 'ttt:mode';
const DIFFICULTY_KEY = 'ttt:difficulty';

const DEFAULT_THEME = 'light';
const DEFAULT_MODE = 'pvp';
const DEFAULT_DIFFICULTY = 'medium';

const VALID_THEMES = ['light', 'dark'];
const VALID_MODES = ['pvp', 'pvai'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', 'impossible'];

const DEFAULT_STATE = {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  scores: { xWins: 0, oWins: 0, draws: 0 },
  winner: null,
};

function safeGetItem(key) {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function safeRemoveItem(key) {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

function readEnum(key, validValues, fallback) {
  const raw = safeGetItem(key);
  if (raw === null || raw === undefined) return fallback;
  let value = raw;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') value = parsed;
  } catch (error) {
    // raw is not JSON, use as-is
  }
  if (typeof value === 'string' && validValues.includes(value)) {
    return value;
  }
  return fallback;
}

function writeEnum(key, value, validValues) {
  if (!validValues.includes(value)) return false;
  return safeSetItem(key, value);
}

function getSystemTheme() {
  try {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch (error) {
    // matchMedia unavailable, fall back to default
  }
  return DEFAULT_THEME;
}

export function loadTheme() {
  return readEnum(THEME_KEY, VALID_THEMES, getSystemTheme());
}

export function saveTheme(theme) {
  return writeEnum(THEME_KEY, theme, VALID_THEMES);
}

export function loadMode() {
  return readEnum(MODE_KEY, VALID_MODES, DEFAULT_MODE);
}

export function saveMode(mode) {
  return writeEnum(MODE_KEY, mode, VALID_MODES);
}

export const loadGameMode = loadMode;
export const saveGameMode = saveMode;

export function loadDifficulty() {
  return readEnum(DIFFICULTY_KEY, VALID_DIFFICULTIES, DEFAULT_DIFFICULTY);
}

export function saveDifficulty(difficulty) {
  return writeEnum(DIFFICULTY_KEY, difficulty, VALID_DIFFICULTIES);
}

export const getTheme = loadTheme;
export const setTheme = saveTheme;
export const getMode = loadMode;
export const setMode = saveMode;
export const getDifficulty = loadDifficulty;
export const setDifficulty = saveDifficulty;

function isValidCells(cells) {
  return (
    Array.isArray(cells) &&
    cells.length === 9 &&
    cells.every((c) => c === null || c === 'X' || c === 'O')
  );
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

  if (actualResult !== null) {
    const newWinner = actualResult;
    const newGameOver = true;
    if (state.winner === newWinner && state.gameOver === true) {
      return state;
    }
    return { ...state, winner: newWinner, gameOver: newGameOver };
  }

  if (state.gameOver) {
    return { ...state, gameOver: false, winner: null };
  }

  return state;
}

export function saveState(state) {
  try {
    safeSetItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadState() {
  try {
    const stored = safeGetItem(STORAGE_KEY);
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
  safeRemoveItem(STORAGE_KEY);
}

export default {
  loadTheme,
  saveTheme,
  loadMode,
  saveMode,
  loadGameMode,
  saveGameMode,
  loadDifficulty,
  saveDifficulty,
  saveState,
  loadState,
  clearState,
};
