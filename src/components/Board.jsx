import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

function Board({ cells, onCellClick, disabled }) {
  return (
    <div className={styles.board} role="grid" aria-label="Tabuleiro do Jogo da Velha">
      {cells.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          onClick={onCellClick}
          disabled={disabled || value !== null}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}

export default Board;
