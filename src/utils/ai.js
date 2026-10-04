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

function minimax(board, depth, isMaximizing, alpha, beta, aiPlayer, depthLimit = Infinity) {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const score = evaluate(board, aiPlayer);
  if (score !== 0) {
    return score - depth;
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0;
  }

  if (depth >= depthLimit) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const childScore = minimax(board, depth + 1, false, alpha, beta, aiPlayer, depthLimit);
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
      const childScore = minimax(board, depth + 1, true, alpha, beta, aiPlayer, depthLimit);
      board[move] = null;
      bestScore = Math.min(bestScore, childScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  }
}

function randomMove(board) {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

function heuristicMove(board, aiPlayer) {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;

  // 1) Vencer se possível
  for (const move of moves) {
    const copy = [...board];
    copy[move] = aiPlayer;
    if (checkWinner(copy) === aiPlayer) return move;
  }

  // 2) Bloquear vitória do oponente
  for (const move of moves) {
    const copy = [...board];
    copy[move] = opponent;
    if (checkWinner(copy) === opponent) return move;
  }

  // 3) Centro
  if (board[4] === null) return 4;

  // 4) Cantos
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5) Laterais
  const sides = [1, 3, 5, 7].filter((i) => board[i] === null);
  if (sides.length > 0) {
    return sides[Math.floor(Math.random() * sides.length)];
  }

  return moves[0];
}

function minimaxMove(board, aiPlayer, depthLimit = Infinity) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, -Infinity, Infinity, aiPlayer, depthLimit);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function getBestMove(board, aiPlayer) {
  return minimaxMove(board, aiPlayer);
}

export function escolherJogada(tabuleiro, dificuldade = 'medium') {
  const board = Array.isArray(tabuleiro) ? [...tabuleiro] : Array(9).fill(null);
  const aiPlayer = 'O';

  switch (dificuldade) {
    case 'easy':
      // ~80% aleatório, 20% minimax completo
      if (Math.random() < 0.8) return randomMove(board);
      return minimaxMove(board, aiPlayer);
    case 'medium':
      return heuristicMove(board, aiPlayer);
    case 'hard':
      // minimax com profundidade limitada + pequena chance de erro
      if (Math.random() < 0.1) return randomMove(board);
      return minimaxMove(board, aiPlayer, 4);
    case 'impossible':
    default:
      return minimaxMove(board, aiPlayer);
  }
}

export { randomMove, heuristicMove, minimaxMove };
