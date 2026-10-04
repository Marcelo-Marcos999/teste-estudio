import assert from 'node:assert/strict'
import { checkWinner } from '../src/utils/checkWinner.js'
import { clearState, loadState, saveState } from '../src/utils/storage.js'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

// checkWinner implementations may return a symbol string, a "draw"
// marker, an object ({ winner, line }) or null. Normalise into just the
// winning player (or null when there is no winner).
function winnerOf(result) {
  if (result === null || result === undefined) return null
  if (typeof result === 'string') return result === 'draw' ? null : result
  if (typeof result === 'object') {
    const w = result.winner ?? result.player ?? result.symbol ?? null
    if (w === null || w === undefined) return null
    return w === 'draw' ? null : w
  }
  return null
}

// A board is an array of 9 cells using 'X' | 'O' | null.
const board = (...cells) => cells

/* ------------------------------------------------------------------ */
/* checkWinner — rows                                                  */
/* ------------------------------------------------------------------ */

// Top row, X wins.
assert.equal(
  winnerOf(checkWinner(board('X', 'X', 'X', 'O', 'O', null, null, null, null))),
  'X'
)

// Middle row, O wins.
assert.equal(
  winnerOf(checkWinner(board('X', null, 'X', 'O', 'O', 'O', null, null, null))),
  'O'
)

// Bottom row, X wins.
assert.equal(
  winnerOf(checkWinner(board('O', 'O', null, null, null, null, 'X', 'X', 'X'))),
  'X'
)

/* ------------------------------------------------------------------ */
/* checkWinner — columns                                               */
/* ------------------------------------------------------------------ */

// First column, X wins.
assert.equal(
  winnerOf(checkWinner(board('X', 'O', null, 'X', 'O', null, 'X', null, null))),
  'X'
)

// Second column, O wins.
assert.equal(
  winnerOf(checkWinner(board('X', 'O', null, null, 'O', 'X', null, 'O', 'X'))),
  'O'
)

// Third column, X wins.
assert.equal(
  winnerOf(checkWinner(board('O', null, 'X', 'O', null, 'X', null, null, 'X'))),
  'X'
)

/* ------------------------------------------------------------------ */
/* checkWinner — diagonals                                             */
/* ------------------------------------------------------------------ */

// Main diagonal, X wins.
assert.equal(
  winnerOf(checkWinner(board('X', 'O', 'O', null, 'X', null, null, null, 'X'))),
  'X'
)

// Anti diagonal, O wins.
assert.equal(
  winnerOf(checkWinner(board('X', 'X', 'O', null, 'O', null, 'O', null, 'X'))),
  'O'
)

/* ------------------------------------------------------------------ */
/* checkWinner — no winner                                             */
/* ------------------------------------------------------------------ */

// Empty board -> nobody won.
assert.equal(winnerOf(checkWinner(board(null, null, null, null, null, null, null, null, null))), null)

// Partial board with no line -> nobody won yet.
assert.equal(winnerOf(checkWinner(board('X', 'O', null, null, null, null, null, null, null))), null)

// Full board with no line -> draw, still "no winner".
assert.equal(
  winnerOf(checkWinner(board('X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null))),
  null
)
assert.equal(
  winnerOf(checkWinner(board('O', 'X', 'O', 'X', 'O', 'X', 'X', 'O', 'X'))),
  null
)

// If the implementation exposes the winning line, it must contain the
// three winning cells and reference the winner's symbol.
{
  const res = checkWinner(board('X', 'X', 'X', 'O', 'O', null, null, null, null))
  const line = res && typeof res === 'object' ? (res.line ?? res.combo ?? res.cells ?? null) : null
  if (Array.isArray(line)) {
    assert.equal(line.length, 3)
    assert.deepEqual([...line].sort((a, b) => a - b), [0, 1, 2])
  }
}

/* ------------------------------------------------------------------ */
/* storage — defaults                                                  */
/* ------------------------------------------------------------------ */

localStorage.clear()
clearState()

{
  const state = loadState()
  assert.equal(typeof state, 'object')
  assert.ok(state !== null)
  // Default theme is "light" when nothing has been saved.
  assert.equal(state.theme, 'light')
  // Mode/difficulty must exist and be one of the allowed values.
  assert.ok(['pvp', 'cpu'].includes(state.mode), `unexpected default mode: ${state.mode}`)
  assert.ok(
    ['easy', 'medium', 'hard'].includes(state.difficulty),
    `unexpected default difficulty: ${state.difficulty}`
  )
}

/* ------------------------------------------------------------------ */
/* storage — round trip                                                */
/* ------------------------------------------------------------------ */

localStorage.clear()
clearState()
saveState({ theme: 'dark' })
assert.equal(loadState().theme, 'dark')
assert.equal(localStorage.getItem('ttt:theme'), 'dark')

saveState({ theme: 'light' })
assert.equal(loadState().theme, 'light')

localStorage.clear()
clearState()
saveState({ mode: 'cpu' })
assert.equal(loadState().mode, 'cpu')
assert.equal(localStorage.getItem('ttt:mode'), 'cpu')

saveState({ mode: 'pvp' })
assert.equal(loadState().mode, 'pvp')

localStorage.clear()
clearState()
saveState({ difficulty: 'hard' })
assert.equal(loadState().difficulty, 'hard')
assert.equal(localStorage.getItem('ttt:difficulty'), 'hard')

saveState({ difficulty: 'easy' })
assert.equal(loadState().difficulty, 'easy')

// A partial save must not clobber the other persisted values.
localStorage.clear()
clearState()
saveState({ theme: 'dark' })
saveState({ mode: 'cpu' })
saveState({ difficulty: 'medium' })
{
  const state = loadState()
  assert.equal(state.theme, 'dark')
  assert.equal(state.mode, 'cpu')
  assert.equal(state.difficulty, 'medium')
}

/* ------------------------------------------------------------------ */
/* storage — clearState                                                */
/* ------------------------------------------------------------------ */

localStorage.clear()
clearState()
saveState({ theme: 'dark', mode: 'cpu', difficulty: 'hard' })
clearState()
{
  const state = loadState()
  assert.equal(state.theme, 'light')
  assert.ok(['pvp', 'cpu'].includes(state.mode))
  assert.ok(['easy', 'medium', 'hard'].includes(state.difficulty))
}

/* ------------------------------------------------------------------ */
/* storage — tolerance to corrupt / missing localStorage               */
/* ------------------------------------------------------------------ */

// Invalid JSON must not throw and must fall back to the default theme.
localStorage.clear()
localStorage.setItem('ttt:theme', '{not-json')
{
  let state
  assert.doesNotThrow(() => {
    state = loadState()
  })
  assert.equal(state.theme, 'light')
}

// Same for mode / difficulty.
localStorage.clear()
localStorage.setItem('ttt:mode', '!!!')
localStorage.setItem('ttt:difficulty', '###')
{
  let state
  assert.doesNotThrow(() => {
    state = loadState()
  })
  assert.ok(['pvp', 'cpu'].includes(state.mode), `unexpected mode: ${state.mode}`)
  assert.ok(
    ['easy', 'medium', 'hard'].includes(state.difficulty),
    `unexpected difficulty: ${state.difficulty}`
  )
}

// Storage access that throws must be swallowed by both helpers.
{
  const originalGetItem = localStorage.getItem
  const originalSetItem = localStorage.setItem
  let patched = false
  try {
    localStorage.getItem = () => {
      throw new Error('localStorage unavailable')
    }
    localStorage.setItem = () => {
      throw new Error('localStorage unavailable')
    }
    patched = true
  } catch {
    patched = false
  }

  if (patched) {
    let readState
    assert.doesNotThrow(() => {
      readState = loadState()
    })
    assert.equal(readState.theme, 'light')

    assert.doesNotThrow(() => saveState({ theme: 'dark' }))

    assert.doesNotThrow(() => clearState())

    localStorage.getItem = originalGetItem
    localStorage.setItem = originalSetItem
  }
}

// Reading a value the storage layer does not know is still safe.
localStorage.clear()
localStorage.setItem('ttt:theme', 'dark')
localStorage.setItem('ttt:extra', 'whatever')
assert.doesNotThrow(() => loadState())
assert.equal(loadState().theme, 'dark')

localStorage.clear()
clearState()

console.log('acceptance OK')
