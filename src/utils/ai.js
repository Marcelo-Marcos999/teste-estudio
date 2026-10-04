import { checkWinner } from './checkWinner.js';

function getAvailableMoves(board) {
  const moves = [];
  board.forEach((cell, idx) => {
    if (cell === null) moves.push(idx);
  });
  return moves;
}

function evaluate(board, aiPlayer) {
  const winner = checkWinner(board);
  if (winner === aiPlayer) {
    return 10;
  } else if (winner === (aiPlayer === 'X' ? 'O' : 'X')) {
    return -10;
  } else if (winner === 'draw') {
    return 0;
  }
  return 0;
}

function minimax(board, depth, isMaximizing, alpha, beta, aiPlayer) {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const score = evaluate(board, aiPlayer);
  if (score !== 0) {
    return score - depth;
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const childScore = minimax(board, depth + 1, false, alpha, beta, aiPlayer);
      board[move] = null;
      bestScore = Math.max(bestScore, childScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      board[move] = opponent;
      const childScore = minimax(board, depth + 1, true, alpha, beta, aiPlayer);
      board[move] = null;
      bestScore = Math.min(bestScore, childScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  }
}

export function getBestMove(board, aiPlayer) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, -Infinity, Infinity, aiPlayer);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

const DIFFICULTY_ALIASES = {
  facil: 'easy',
  'fácil': 'easy',
  easy: 'easy',
  medio: 'medium',
  'médio': 'medium',
  medium: 'medium',
  dificil: 'hard',
  'difícil': 'hard',
  hard: 'hard',
  impossivel: 'impossible',
  'impossível': 'impossible',
  impossible: 'impossible',
};

const DEFAULT_DIFFICULTY = 'medium';

function getOpponent(player) {
  return player === 'X' ? 'O' : 'X';
}

function normalizeDifficulty(dificuldade) {
  if (typeof dificuldade !== 'string') return DEFAULT_DIFFICULTY;
  const key = dificuldade.trim().toLowerCase();
  return DIFFICULTY_ALIASES[key] || DEFAULT_DIFFICULTY;
}

function pickRandom(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}

function findImmediateMove(board, availableMoves, player) {
  for (const move of availableMoves) {
    const next = [...board];
    next[move] = player;
    if (checkWinner(next) === player) {
      return move;
    }
  }
  return null;
}

function heuristicMove(board, availableMoves, aiPlayer) {
  const winMove = findImmediateMove(board, availableMoves, aiPlayer);
  if (winMove !== null) return winMove;

  const blockMove = findImmediateMove(board, availableMoves, getOpponent(aiPlayer));
  if (blockMove !== null) return blockMove;

  if (availableMoves.includes(4)) return 4;

  const corners = [0, 2, 6, 8].filter((corner) => availableMoves.includes(corner));
  if (corners.length > 0) return pickRandom(corners);

  return pickRandom(availableMoves);
}

function minimaxLimited(board, depth, isMaximizing, alpha, beta, aiPlayer, maxDepth) {
  const winner = checkWinner(board);
  if (winner === aiPlayer) return 10 - depth;
  if (winner === getOpponent(aiPlayer)) return depth - 10;

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0 || depth >= maxDepth) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const childScore = minimaxLimited(board, depth + 1, false, alpha, beta, aiPlayer, maxDepth);
      board[move] = null;
      bestScore = Math.max(bestScore, childScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const move of availableMoves) {
    board[move] = getOpponent(aiPlayer);
    const childScore = minimaxLimited(board, depth + 1, true, alpha, beta, aiPlayer, maxDepth);
    board[move] = null;
    bestScore = Math.min(bestScore, childScore);
    beta = Math.min(beta, bestScore);
    if (beta <= alpha) break;
  }
  return bestScore;
}

function getDepthLimitedMove(board, aiPlayer, maxDepth) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimaxLimited(board, 0, false, -Infinity, Infinity, aiPlayer, maxDepth);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function escolherJogada(tabuleiro, dificuldade) {
  const board = Array.isArray(tabuleiro) ? [...tabuleiro] : Array(9).fill(null);
  const aiPlayer = 'O';
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return null;

  const level = normalizeDifficulty(dificuldade);

  if (level === 'easy') {
    if (Math.random() < 0.8) {
      return pickRandom(availableMoves);
    }
    return getBestMove(board, aiPlayer);
  }

  if (level === 'medium') {
    return heuristicMove(board, availableMoves, aiPlayer);
  }

  if (level === 'hard') {
    if (Math.random() < 0.1) {
      return pickRandom(availableMoves);
    }
    const move = getDepthLimitedMove(board, aiPlayer, 4);
    return move !== null ? move : getBestMove(board, aiPlayer);
  }

  return getBestMove(board, aiPlayer);
}

export default escolherJogada;
