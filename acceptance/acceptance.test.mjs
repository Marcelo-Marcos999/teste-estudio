import assert from 'node:assert/strict'
import { checkWinner } from '../src/utils/checkWinner.js'
import { clearState, loadState, saveState } from '../src/utils/storage.js'

// Helper to create a fresh board
const emptyBoard = () => Array(9).fill(null)

// --- checkWinner tests ---

// Row wins
assert.equal(checkWinner(['X', 'X', 'X', null, null, null, null, null, null]), 'X', 'X wins top row')
assert.equal(checkWinner([null, null, null, 'O', 'O', 'O', null, null, null]), 'O', 'O wins middle row')
assert.equal(checkWinner([null, null, null, null, null, null, 'X', 'X', 'X']), 'X', 'X wins bottom row')

// Column wins
assert.equal(checkWinner(['X', null, null, 'X', null, null, 'X', null, null]), 'X', 'X wins left column')
assert.equal(checkWinner([null, 'O', null, null, 'O', null, null, 'O', null]), 'O', 'O wins middle column')
assert.equal(checkWinner([null, null, 'X', null, null, 'X', null, null, 'X']), 'X', 'X wins right column')

// Diagonal wins
assert.equal(checkWinner(['X', null, null, null, 'X', null, null, null, 'X']), 'X', 'X wins main diagonal')
assert.equal(checkWinner([null, null, 'O', null, 'O', null, 'O', null, null]), 'O', 'O wins anti-diagonal')

// Draw (full board, no winner)
const drawBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
assert.equal(checkWinner(drawBoard), 'draw', 'draw on full board with no winner')

// No winner yet (empty board)
assert.equal(checkWinner(emptyBoard()), null, 'no winner on empty board')

// No winner yet (partial board)
const partialBoard = ['X', 'O', null, 'O', 'X', null, null, null, 'X']
assert.equal(checkWinner(partialBoard), null, 'no winner on partial board')

// --- storage tests ---

// Clear any existing state before tests
localStorage.clear()
clearState()

// Save and load state
const testState = {
  cells: ['X', 'O', 'X', null, 'O', null, null, null, 'X'],
  currentPlayer: 'O',
  gameOver: false,
  winner: null,
  scores: { X: 2, O: 1, draws: 3 }
}

saveState(testState)
const loaded = loadState()

assert.deepEqual(loaded.cells, testState.cells, 'cells persisted correctly')
assert.equal(loaded.currentPlayer, testState.currentPlayer, 'currentPlayer persisted correctly')
assert.equal(loaded.gameOver, testState.gameOver, 'gameOver persisted correctly')
assert.equal(loaded.winner, testState.winner, 'winner persisted correctly')
assert.deepEqual(loaded.scores, testState.scores, 'scores persisted correctly')

// Clear state and verify it's gone
clearState()
const afterClear = loadState()
assert.equal(afterClear, null, 'clearState removes persisted data')

// Load from empty localStorage returns null
localStorage.clear()
assert.equal(loadState(), null, 'loadState returns null when nothing stored')

console.log('acceptance OK')
