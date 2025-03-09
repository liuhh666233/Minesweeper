import React from 'react';
import styled, { useTheme } from 'styled-components';
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
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  
  // 3D 效果 - 根据主题调整阴影
  box-shadow: ${props => {
        const isDark = props.theme.name === 'dark';
        const shadowOpacity = isDark ? '0.3' : '0.15';
        const lightOpacity = isDark ? '0.1' : '0.15';
        return props.revealed
            ? `inset 0 1px 2px rgba(0, 0, 0, ${shadowOpacity})`
            : `inset -1px -1px 2px rgba(0, 0, 0, ${shadowOpacity}), inset 1px 1px 2px rgba(255, 255, 255, ${lightOpacity})`;
    }};
  
  // 使用 transform 硬件加速
  transform: translateZ(0);
  backface-visibility: hidden;
  
  // 只对背景色应用过渡
  transition: background-color 0.05s ease;
  
  &:hover {
    background-color: ${props => props.revealed
        ? props.theme.colors.cell.revealed
        : props.theme.colors.cell.hover};
  }

  &:active {
    box-shadow: ${props => {
        const isDark = props.theme.name === 'dark';
        const shadowOpacity = isDark ? '0.3' : '0.2';
        return props.revealed
            ? `inset 0 1px 2px rgba(0, 0, 0, ${shadowOpacity})`
            : `inset 0 1px 2px rgba(0, 0, 0, ${shadowOpacity})`;
    }};
  }

  // 网格边框效果
  border-right: 1px solid ${props => props.theme.colors.border};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

type NumberColors = {
    [K in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8]: string;
};

const getNumberColors = (isDark: boolean): NumberColors => ({
    1: isDark ? '#64B5F6' : '#2196F3', // 蓝色
    2: isDark ? '#81C784' : '#4CAF50', // 绿色
    3: isDark ? '#E57373' : '#F44336', // 红色
    4: isDark ? '#7986CB' : '#3F51B5', // 深蓝色
    5: isDark ? '#FF8A80' : '#8B0000', // 深红色
    6: isDark ? '#4DD0E1' : '#008B8B', // 青色
    7: isDark ? '#E0E0E0' : '#000000', // 黑/白
    8: isDark ? '#B0B0B0' : '#808080'  // 灰色
});

interface CellProps {
    state: CellState;
    onLeftClick: () => void;
    onRightClick: (e: React.MouseEvent) => void;
}

const Cell = React.memo<CellProps>(({ state, onLeftClick, onRightClick }) => {
    const theme = useTheme();

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
    const isDark = theme.name === 'dark';
    const numberColors = getNumberColors(isDark);
    const color = typeof content === 'number' && content >= 1 && content <= 8
        ? numberColors[content as keyof NumberColors]
        : 'inherit';

    return (
        <CellButton
            revealed={state.is_revealed}
            onClick={onLeftClick}
            onContextMenu={onRightClick}
            style={{ color }}
        >
            {content}
        </CellButton>
    );
});

Cell.displayName = 'Cell';

export { Cell }; 