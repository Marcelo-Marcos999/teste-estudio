import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

function Board({ cells, onCellClick, disabled, winningLine = null, isAiThinking = false }) {
  const hasWinningLine = Array.isArray(winningLine) && winningLine.length > 0;

  return (
    <div
      className={`${styles.board} ${hasWinningLine ? styles.boardWon : ''}`}
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
          winning={hasWinningLine && winningLine.includes(index)}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
      {hasWinningLine && (
        <div className={styles.winningOverlay} aria-hidden="true">
          <svg
            className={styles.winningLine}
            viewBox="0 0 300 300"
            preserveAspectRatio="none"
          >
            <line
              className={styles.winningStroke}
              x1={((winningLine[0] % 3) + 0.5) * 100}
              y1={(Math.floor(winningLine[0] / 3) + 0.5) * 100}
              x2={((winningLine[2] % 3) + 0.5) * 100}
              y2={(Math.floor(winningLine[2] / 3) + 0.5) * 100}
            />
          </svg>
        </div>
      )}
      {isAiThinking && (
        <div className={styles.thinkingOverlay} aria-hidden="true">
          <span className={styles.thinkingDot} />
          <span className={styles.thinkingDot} />
          <span className={styles.thinkingDot} />
        </div>
      )}
    </div>
  );
}

export default Board;
