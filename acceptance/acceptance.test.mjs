import assert from 'node:assert/strict';
import { checkWinner } from '../src/utils/checkWinner.js';
import { clearState, loadState, saveState } from '../src/utils/storage.js';

// Helper to reset storage before each persistence test
function resetStorage() {
  clearState();
}

/* ---------- checkWinner tests ---------- */
// Empty board
assert.strictEqual(checkWinner([]), null);
assert.strictEqual(checkWinner([null, null, null, null, null, null, null, null, null]), null);

// Single player moves, no winner
assert.strictEqual(checkWinner(['X', null, null, null, null, null, null, null, null]), null);
assert.strictEqual(checkWinner(['X', 'O', null, null, null, null, null, null, null]), null);

// X wins on top row
assert.strictEqual(checkWinner(['X', 'X', 'X', 'O', 'O', null, null, null, null]), 'X');
// X wins on middle row
assert.strictEqual(checkWinner([null, 'X', 'X', 'O', 'O', 'X', null, null, null]), 'X');
// X wins on bottom row
assert.strictEqual(checkWinner([null, null, null, 'O', 'X', 'O', 'X', 'X', 'O']), 'X');

// X wins on first column
assert.strictEqual(checkWinner(['X', 'O', 'O', 'X', null, 'O', 'X', null, null]), 'X');
// X wins on second column
assert.strictEqual(checkWinner([null, 'X', 'O', null, 'X', 'O', null, 'X', 'O']), 'X');
// X wins on third column
assert.strictEqual(checkWinner(['O', 'O', 'X', 'O', null, 'X', 'X', null, 'X']), 'X');

// X wins on main diagonal
assert.strictEqual(checkWinner(['X', 'O', 'O', 'O', 'X', null, null, 'O', 'X']), 'X');
// X wins on anti-diagonal
assert.strictEqual(checkWinner(['O', 'O', 'X', null, 'X', 'O', 'X', 'O', 'X']), 'X');

// O wins on top row
assert.strictEqual(checkWinner(['O', 'O', 'O', 'X', 'X', null, null, null, null]), 'O');
// O wins on middle row
assert.strictEqual(checkWinner([null, 'O', 'O', 'X', 'X', 'O', null, null, null]), 'O');
// O wins on bottom row
assert.strictEqual(checkWinner([null, null, null, 'X', 'X', 'O', 'O', 'O', 'X']), 'O');

// O wins on first column
assert.strictEqual(checkWinner(['O', 'X', 'X', 'O', 'X', null, 'O', 'X', null]), 'O');
// O wins on second column
assert.strictEqual(checkWinner([null, 'O', 'X', null, 'O', 'X', null, 'O', 'X']), 'O');
// O wins on third column
assert.strictEqual(checkWinner(['X', 'X', 'O', 'X', null, 'O', 'X', 'O', 'O']), 'O');

// O wins on main diagonal
assert.strictEqual(checkWinner(['O', 'X', 'X', 'X', 'O', null, null, 'X', 'O']), 'O');
// O wins on anti-diagonal
assert.strictEqual(checkWinner(['X', 'X', 'O', null, 'O', 'X', 'O', 'X', 'O']), 'O');

// Full board draw (no winner)
assert.strictEqual(checkWinner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), null);
assert.strictEqual(checkWinner(['O', 'X', 'O', 'X', 'O', 'X', 'X', 'O', 'X']), null);

// All X (multiple winning lines)
assert.strictEqual(checkWinner(['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']), 'X');
// All O (multiple winning lines)
assert.strictEqual(checkWinner(['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']), 'O');

// Invalid board lengths (should return null or handle gracefully)
assert.strictEqual(checkWinner([1,2,3]), null);
assert.strictEqual(checkWinner(['X','X']), null);

/* ---------- storage tests ---------- */
// clearState removes all keys
resetStorage();
assert.strictEqual(localStorage.length, 0);
clearState();
assert.strictEqual(localStorage.length, 0);

// saveState / loadState roundtrip
resetStorage();
saveState('theme', 'dark');
assert.strictEqual(loadState('theme'), 'dark');
saveState('score', { wins: 5, losses: 2 });
assert.deepStrictEqual(loadState('score'), { wins: 5, losses: 2 });

// Overwrite existing key
resetStorage();
saveState('count', 1);
saveState('count', 2);
assert.strictEqual(loadState('count'), 2);

// Missing key returns undefined
resetStorage();
assert.strictEqual(loadState('nonexistent'), undefined);

// Persistence simulation (save then load after clear)
resetStorage();
saveState('userPref', { theme: 'light', mode: 'PvAI' });
clearState(); // simulate app restart clearing storage? Actually persistence means it stays, but we test that loadState retrieves saved data after clear? Not realistic. Instead we test that saveState writes to localStorage and loadState reads it back without clearing.
resetStorage();
saveState('userPref', { theme: 'light', mode: 'PvAI' });
assert.deepStrictEqual(loadState('userPref'), { theme: 'light', mode: 'PvAI' });

// Theme persistence scenario
resetStorage();
saveState('appTheme', 'dark');
assert.strictEqual(loadState('appTheme'), 'dark');
saveState('appTheme', 'light');
assert.strictEqual(loadState('appTheme'), 'light');

// Ensure storage functions handle JSON serialization
resetStorage();
saveState('jsonData', { a: 1, b: [2,3] });
assert.deepStrictEqual(loadState('jsonData'), { a: 1, b: [2,3] });

// Ensure clearState empties localStorage
resetStorage();
saveState('key1', 'val1');
saveState('key2', 'val2');
clearState();
assert.strictEqual(localStorage.length, 0);

console.log('acceptance OK');
