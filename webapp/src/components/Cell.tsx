import React from 'react';
import styled from 'styled-components';
import { CellState } from '../types';

const CellButton = styled.button<{ revealed: boolean }>`
  width: 30px;
  height: 30px;
  border: 1px solid #999;
  background-color: ${props => props.revealed ? '#e0e0e0' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-size: 14px;

  &:hover {
    background-color: ${props => props.revealed ? '#e0e0e0' : '#f0f0f0'};
  }
`;

const NUMBER_COLORS: { [key: number]: string } = {
    1: '#0000FF',  // 蓝色
    2: '#008000',  // 绿色
    3: '#FF0000',  // 红色
    4: '#000080',  // 深蓝色
    5: '#800000',  // 深红色
    6: '#008080',  // 青色
    7: '#000000',  // 黑色
    8: '#808080'   // 灰色
};

interface CellProps {
    state: CellState;
    onLeftClick: () => void;
    onRightClick: (e: React.MouseEvent) => void;
}

export const Cell: React.FC<CellProps> = ({ state, onLeftClick, onRightClick }) => {
    const getCellContent = () => {
        if (state.is_flagged) {
            return '🚩';
        }
        if (!state.is_revealed) {
            return '';
        }
        if (state.is_mine) {
            return '💣';
        }
        if (state.adjacent_mines > 0) {
            return state.adjacent_mines;
        }
        return '';
    };

    const content = getCellContent();
    const color = typeof content === 'number' ? NUMBER_COLORS[content] : 'inherit';

    return (
        <CellButton
            revealed={state.is_revealed}
            onClick={onLeftClick}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(e);
            }}
            style={{ color }}
        >
            {content}
        </CellButton>
    );
}; 