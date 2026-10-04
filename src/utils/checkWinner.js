export function checkWinner(cells) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const value = cells[a];
    if ((value === 'X' || value === 'O') && value === cells[b] && value === cells[c]) {
      return value;
    }
  }

  return null;
}
