import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

// Centro de cada célula em coordenadas 0..100 (grade 3x3 uniforme).
function cellCenter(index) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return { x: (col + 0.5) * (100 / 3), y: (row + 0.5) * (100 / 3) };
}

function getLineEndpoints(winningLine) {
  if (!Array.isArray(winningLine) || winningLine.length !== 3) return null;
  const start = cellCenter(winningLine[0]);
  const end = cellCenter(winningLine[2]);
  return { start, end };
}

function Board({ cells, onCellClick, disabled, winningLine = null }) {
  const endpoints = getLineEndpoints(winningLine);
  const hasWinner = Boolean(endpoints);

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
        <svg
          className={styles.winOverlay}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="winLineGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" className={styles.winStopA} />
              <stop offset="100%" className={styles.winStopB} />
            </linearGradient>
            <filter id="winLineGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <line
            className={styles.winLine}
            pathLength="100"
            x1={endpoints.start.x}
            y1={endpoints.start.y}
            x2={endpoints.end.x}
            y2={endpoints.end.y}
            stroke="url(#winLineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#winLineGlow)"
          />
        </svg>
      )}
    </div>
  );
}

export default Board;
