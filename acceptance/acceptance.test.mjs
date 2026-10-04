import assert from 'node:assert/strict'
import { checkWinner } from '../src/utils/checkWinner.js'
import { clearState, loadState, saveState } from '../src/utils/storage.js'
import { useTicTacToe } from '../src/hooks/useTicTacToe.js'

// Mock localStorage for Node environment
const mockStorage = new Map()
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, value) => mockStorage.set(key, value),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
}

// Helper to reset mock storage and any module-level state
function resetTestEnvironment() {
  mockStorage.clear()
  // Clear any cached state in storage module if needed
}

// ========== checkWinner tests ==========
function testCheckWinner() {
  // Empty board
  assert.equal(checkWinner(Array(9).fill(null)), null, 'empty board -> null')

  // Row wins
  assert.equal(checkWinner(['X','X','X', null,null,null, null,null,null]), 'X', 'top row X wins')
  assert.equal(checkWinner([null,null,null, 'O','O','O', null,null,null]), 'O', 'middle row O wins')
  assert.equal(checkWinner([null,null,null, null,null,null, 'X','X','X']), 'X', 'bottom row X wins')

  // Column wins
  assert.equal(checkWinner(['X',null,null, 'X',null,null, 'X',null,null]), 'X', 'left column X wins')
  assert.equal(checkWinner([null,'O',null, null,'O',null, null,'O',null]), 'O', 'middle column O wins')
  assert.equal(checkWinner([null,null,'X', null,null,'X', null,null,'X']), 'X', 'right column X wins')

  // Diagonal wins
  assert.equal(checkWinner(['X',null,null, null,'X',null, null,null,'X']), 'X', 'main diagonal X wins')
  assert.equal(checkWinner([null,null,'O', null,'O',null, 'O',null,null]), 'O', 'anti-diagonal O wins')

  // Draw (full board, no winner)
  const drawBoard = ['X','O','X', 'X','O','O', 'O','X','X']
  assert.equal(checkWinner(drawBoard), 'draw', 'full board no winner -> draw')

  // No winner yet (partial board)
  assert.equal(checkWinner(['X','O',null, null,'X',null, null,null,'O']), null, 'partial board -> null')

  // Overwrite not possible (function is pure, just verify it doesn't mutate)
  const board = ['X','X','X', null,null,null, null,null,null]
  const result = checkWinner(board)
  assert.equal(result, 'X')
  assert.deepEqual(board, ['X','X','X', null,null,null, null,null,null], 'checkWinner does not mutate input')
}

// ========== storage tests ==========
function testStorage() {
  resetTestEnvironment()

  const testState = {
    cells: ['X', null, 'O', null, 'X', null, 'O', null, 'X'],
    currentPlayer: 'O',
    gameOver: true,
    winner: 'X',
    scores: { X: 2, O: 1, draws: 0 }
  }

  saveState(testState)
  const loaded = loadState()
  assert.deepEqual(loaded, testState, 'saveState/loadState roundtrip')

  clearState()
  assert.equal(loadState(), null, 'clearState removes state')

  // loadState with no data returns null
  resetTestEnvironment()
  assert.equal(loadState(), null, 'loadState on empty storage returns null')
}

// ========== useTicTacToe tests ==========
function testUseTicTacToe() {
  resetTestEnvironment()

  // Create a fresh instance for each test segment by re-importing? 
  // Since useTicTacToe is a hook that likely uses internal state, we need to test its exported functions.
  // The hook returns an object with state and methods. We'll call it once and test the returned API.
  const game = useTicTacToe()

  // Initial state
  assert.deepEqual(game.cells, Array(9).fill(null), 'initial cells empty')
  assert.equal(game.currentPlayer, 'X', 'initial player X')
  assert.equal(game.gameOver, false, 'initial gameOver false')
  assert.equal(game.winner, null, 'initial winner null')
  assert.deepEqual(game.scores, { X: 0, O: 0, draws: 0 }, 'initial scores zero')

  // makeMove on empty cell
  game.makeMove(0)
  assert.equal(game.cells[0], 'X', 'first move places X')
  assert.equal(game.currentPlayer, 'O', 'turn switches to O')
  assert.equal(game.gameOver, false, 'game not over after one move')

  // makeMove alternates
  game.makeMove(1)
  assert.equal(game.cells[1], 'O', 'second move places O')
  assert.equal(game.currentPlayer, 'X', 'turn switches back to X')

  // Cannot overwrite filled cell
  const cellsBefore = [...game.cells]
  game.makeMove(0) // try to play on index 0 again
  assert.deepEqual(game.cells, cellsBefore, 'cannot overwrite filled cell')
  assert.equal(game.currentPlayer, 'X', 'turn does not change on invalid move')

  // Win detection: X wins top row
  resetTestEnvironment()
  const game2 = useTicTacToe()
  game2.makeMove(0) // X
  game2.makeMove(3) // O
  game2.makeMove(1) // X
  game2.makeMove(4) // O
  game2.makeMove(2) // X wins
  assert.equal(game2.winner, 'X', 'X wins top row')
  assert.equal(game2.gameOver, true, 'gameOver true on win')
  assert.equal(game2.scores.X, 1, 'X score increments')
  assert.equal(game2.scores.O, 0, 'O score unchanged')

  // Further moves blocked after win
  const cellsAfterWin = [...game2.cells]
  game2.makeMove(5)
  assert.deepEqual(game2.cells, cellsAfterWin, 'board frozen after win')

  // O wins diagonal
  resetTestEnvironment()
  const game3 = useTicTacToe()
  game3.makeMove(0) // X
  game3.makeMove(4) // O
  game3.makeMove(1) // X
  game3.makeMove(8) // O
  game3.makeMove(2) // X
  game3.makeMove(3) // O
  game3.makeMove(5) // X
  game3.makeMove(7) // O wins? Wait, O has 4,8,3,7? Not a line. Let's do proper diagonal: O at 2,4,6
  // Let's do a clean test:
  resetTestEnvironment()
  const game4 = useTicTacToe()
  // X: 0,1,3; O: 2,4,6 (anti-diagonal)
  game4.makeMove(0) // X
  game4.makeMove(2) // O
  game4.makeMove(1) // X
  game4.makeMove(4) // O
  game4.makeMove(3) // X
  game4.makeMove(6) // O wins anti-diagonal
  assert.equal(game4.winner, 'O', 'O wins anti-diagonal')
  assert.equal(game4.scores.O, 1, 'O score increments')

  // Draw detection
  resetTestEnvironment()
  const game5 = useTicTacToe()
  // Fill board without winner: X O X / X O O / O X X
  const moves = [0,1,2, 3,4,5, 8,6,7] // indices order
  moves.forEach((idx, i) => {
    game5.makeMove(idx)
  })
  assert.equal(game5.winner, 'draw', 'draw detected')
  assert.equal(game5.gameOver, true, 'gameOver on draw')
  assert.equal(game5.scores.draws, 1, 'draws score increments')

  // resetGame clears board, resets turn, keeps scores
  resetTestEnvironment()
  const game6 = useTicTacToe()
  game6.makeMove(0)
  game6.makeMove(1)
  game6.makeMove(2) // X wins top row
  assert.equal(game6.winner, 'X')
  assert.equal(game6.scores.X, 1)
  game6.resetGame()
  assert.deepEqual(game6.cells, Array(9).fill(null), 'resetGame clears cells')
  assert.equal(game6.currentPlayer, 'X', 'resetGame resets turn to X')
  assert.equal(game6.gameOver, false, 'resetGame clears gameOver')
  assert.equal(game6.winner, null, 'resetGame clears winner')
  assert.equal(game6.scores.X, 1, 'resetGame keeps scores')

  // resetScores clears scores
  game6.resetScores()
  assert.deepEqual(game6.scores, { X: 0, O: 0, draws: 0 }, 'resetScores clears scores')

  // Persistence: state saved to localStorage after each move
  resetTestEnvironment()
  const game7 = useTicTacToe()
  game7.makeMove(4)
  const saved = loadState()
  assert.ok(saved, 'state saved after move')
  assert.equal(saved.cells[4], 'X', 'saved cells reflect move')
  assert.equal(saved.currentPlayer, 'O', 'saved currentPlayer correct')
  assert.equal(saved.scores.X, 0, 'saved scores initial')

  // Restore on new instance (simulate page reload)
  const game8 = useTicTacToe()
  assert.equal(game8.cells[4], 'X', 'restored cells')
  assert.equal(game8.currentPlayer, 'O', 'restored turn')
  assert.equal(game8.scores.X, 0, 'restored scores')
}

// Run all tests
testCheckWinner()
testStorage()
testUseTicTacToe()

console.log('acceptance OK')
