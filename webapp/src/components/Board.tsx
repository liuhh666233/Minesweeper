import React from 'react';
import styled from 'styled-components';
import { GameState } from '../types';
import { Cell } from './Cell';

const BoardContainer = styled.div`
    display: inline-grid;
    gap: 1px;
    padding: 10px;
    background: ${props => props.theme.colors.background.secondary};
    border-radius: 4px;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, ${props => props.theme.name === 'dark' ? '0.4' : '0.2'});
`;

export interface BoardProps {
    state: GameState;
    onCellClick: (x: number, y: number, action: 'reveal' | 'flag') => void;
}

export const Board: React.FC<BoardProps> = ({ state, onCellClick }) => {
    return (
        <BoardContainer
            style={{
                gridTemplateColumns: `repeat(${state.board[0].length}, 30px)`,
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {state.board.map((row, x) =>
                row.map((cell, y) => (
                    <Cell
                        key={`${x}-${y}`}
                        state={cell}
                        onLeftClick={() => onCellClick(x, y, 'reveal')}
                        onRightClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            onCellClick(x, y, 'flag');
                        }}
                    />
                ))
            )}
        </BoardContainer>
    );
}; 