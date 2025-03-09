import React from 'react';
import styled from 'styled-components';
import { Cell } from './Cell';
import { CellState, GameMove } from '../types';

const BoardContainer = styled.div`
  display: inline-block;
  padding: 10px;
  background-color: #f0f0f0;
  border: 2px solid #999;
  border-radius: 5px;
`;

const Row = styled.div`
  display: flex;
`;

interface BoardProps {
    board: CellState[][];
    onMove: (move: GameMove) => void;
    disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({ board, onMove, disabled = false }) => {
    const handleCellClick = (row: number, col: number, action: 'reveal' | 'flag') => {
        if (disabled) return;
        onMove({ row, col, action });
    };

    return (
        <BoardContainer>
            {board.map((row, rowIndex) => (
                <Row key={rowIndex}>
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            state={cell}
                            onLeftClick={() => handleCellClick(rowIndex, colIndex, 'reveal')}
                            onRightClick={() => handleCellClick(rowIndex, colIndex, 'flag')}
                        />
                    ))}
                </Row>
            ))}
        </BoardContainer>
    );
}; 