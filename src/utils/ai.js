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
