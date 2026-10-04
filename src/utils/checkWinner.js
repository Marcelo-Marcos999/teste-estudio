export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function isValidSymbol(value) {
  return value === 'X' || value === 'O';
}

export function getWinningLine(cells) {
  if (!Array.isArray(cells)) {
    return null;
  }

  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const value = cells[a];
    if (isValidSymbol(value) && value === cells[b] && value === cells[c]) {
      return line;
    }
  }

  return null;
}

export function checkWinner(cells) {
  const line = getWinningLine(cells);
  return line ? cells[line[0]] : null;
}

export function isDraw(cells) {
  if (!Array.isArray(cells)) {
    return false;
  }

  const allFilled = cells.every((value) => isValidSymbol(value));
  return allFilled && checkWinner(cells) === null;
}

export function getWinnerInfo(cells) {
  const line = getWinningLine(cells);
  if (!line) {
    return { winner: null, line: null };
  }
  return { winner: cells[line[0]], line };
}

export default checkWinner;
