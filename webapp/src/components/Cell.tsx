import React from 'react';
import styled from 'styled-components';
import { CellState } from '../types';

const CellButton = styled.button<{ revealed: boolean }>`
  width: 30px;
  height: 30px;
  border: none;
  background-color: ${props => props.revealed
        ? props.theme.colors.cell.revealed
        : props.theme.colors.cell.unrevealed};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  position: relative;
  transition: all 0.1s ease;
  
  // 3D 效果
  box-shadow: ${props => props.revealed
        ? 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
        : `
      inset -2px -2px 3px rgba(0, 0, 0, 0.2),
      inset 2px 2px 3px rgba(255, 255, 255, 0.2)
    `};
  
  &:hover {
    background-color: ${props => props.revealed
        ? props.theme.colors.cell.revealed
        : props.theme.colors.cell.hover};
  }

  &:active {
    transform: ${props => props.revealed ? 'none' : 'scale(0.95)'};
  }

  // 网格边框效果
  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 1px;
    height: 1px;
    background-color: ${props => props.theme.colors.border};
    box-shadow: 
      -1px 0 0 ${props => props.theme.colors.border},
      0 -1px 0 ${props => props.theme.colors.border};
  }
`;

const NUMBER_COLORS: { [key: number]: string } = {
    1: '#2196F3', // 蓝色
    2: '#4CAF50', // 绿色
    3: '#F44336', // 红色
    4: '#3F51B5', // 深蓝色
    5: '#8B0000', // 深红色
    6: '#008B8B', // 青色
    7: '#000000', // 黑色
    8: '#808080'  // 灰色
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