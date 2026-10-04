import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

const LINE_CLASSES = {
  '0,1,2': 'rowTop',
  '3,4,5': 'rowMiddle',
  '6,7,8': 'rowBottom',
  '0,3,6': 'colLeft',
  '1,4,7': 'colMiddle',
  '2,5,8': 'colRight',
  '0,4,8': 'diagMain',
  '2,4,6': 'diagAnti',
};

function getLineClass(winningLine) {
  if (!Array.isArray(winningLine) || winningLine.length !== 3) return null;
  const key = [...winningLine].sort((a, b) => a - b).join(',');
  return LINE_CLASSES[key] || null;
}

function Board({ cells, onCellClick, disabled, winningLine = null }) {
  const lineClass = getLineClass(winningLine);
  const hasWinner = Boolean(lineClass);

  return (
    <div
      className={`${styles.board} ${hasWinner ? styles.boardWon : ''}`}
      role="grid"
      aria-label="Tabuleiro do Jogo da Velha"
    >
      {cells.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          onClick={onCellClick}
          disabled={disabled || value !== null}
          winning={Array.isArray(winningLine) && winningLine.includes(index)}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
      {hasWinner && (
        <div className={styles.winOverlay} aria-hidden="true">
          <span className={`${styles.winLine} ${styles[lineClass]}`} />
        </div>
      )}
    </div>
  );
}

export default Board;
