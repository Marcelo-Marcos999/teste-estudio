import assert from 'node:assert/strict'
import { checkWinner } from '../src/utils/checkWinner.js'
import { clearState, loadState, saveState } from '../src/utils/storage.js'

// Mock localStorage for Node.js environment
const mockStorage = {}
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => { mockStorage[key] = value },
  removeItem: (key) => { delete mockStorage[key] },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]) }
}

function resetMockStorage() {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k])
}

// Test checkWinner function
console.log('Testing checkWinner...')

// Test horizontal wins
assert.equal(checkWinner(['X', 'X', 'X', null, null, null, null, null, null]), 'X', 'Top row X wins')
assert.equal(checkWinner([null, null, null, 'O', 'O', 'O', null, null, null]), 'O', 'Middle row O wins')
assert.equal(checkWinner([null, null, null, null, null, null, 'X', 'X', 'X']), 'X', 'Bottom row X wins')

// Test vertical wins
assert.equal(checkWinner(['X', null, null, 'X', null, null, 'X', null, null]), 'X', 'Left column X wins')
assert.equal(checkWinner([null, 'O', null, null, 'O', null, null, 'O', null]), 'O', 'Middle column O wins')
assert.equal(checkWinner([null, null, 'X', null, null, 'X', null, null, 'X']), 'X', 'Right column X wins')

// Test diagonal wins
assert.equal(checkWinner(['X', null, null, null, 'X', null, null, null, 'X']), 'X', 'Main diagonal X wins')
assert.equal(checkWinner([null, null, 'O', null, 'O', null, 'O', null, null]), 'O', 'Anti-diagonal O wins')

// Test draw
assert.equal(checkWinner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), 'draw', 'Draw game')

// Test no winner yet
assert.equal(checkWinner(['X', 'O', null, null, 'X', null, null, null, null]), null, 'Game in progress')
assert.equal(checkWinner([null, null, null, null, null, null, null, null, null]), null, 'Empty board')

// Test invalid board states (should not crash)
assert.equal(checkWinner(['X', 'X', 'X', 'O', 'O', 'O', null, null, null]), 'X', 'First win takes precedence')

console.log('checkWinner tests passed')

// Test storage functions
console.log('Testing storage functions...')

resetMockStorage()

const testState = {
  cells: ['X', 'O', 'X', null, 'O', null, null, null, 'X'],
  currentPlayer: 'O',
  gameOver: false,
  winner: null,
  scores: { X: 2, O: 1, draws: 0 }
}

// Test saveState and loadState
saveState(testState)
const loadedState = loadState()

assert.deepEqual(loadedState, testState, 'saveState and loadState round-trip')

// Test loadState with no saved data
resetMockStorage()
const defaultState = loadState()
assert.deepEqual(defaultState, {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  winner: null,
  scores: { X: 0, O: 0, draws: 0 }
}, 'loadState returns default state when empty')

// Test clearState
saveState(testState)
clearState()
const afterClear = loadState()
assert.deepEqual(afterClear, {
  cells: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  winner: null,
  scores: { X: 0, O: 0, draws: 0 }
}, 'clearState resets to default state')

// Test saveState with partial data (should merge with defaults)
resetMockStorage()
localStorage.setItem('tictactoe-state', JSON.stringify({ cells: ['X', null, null, null, null, null, null, null, null] }))
const partialLoad = loadState()
assert.equal(partialLoad.cells[0], 'X', 'Partial state preserves saved cells')
assert.equal(partialLoad.currentPlayer, 'X', 'Partial state uses default currentPlayer')
assert.deepEqual(partialLoad.scores, { X: 0, O: 0, draws: 0 }, 'Partial state uses default scores')

console.log('Storage tests passed')

console.log('acceptance OK')
