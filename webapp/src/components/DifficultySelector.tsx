import React from 'react';
import styled from 'styled-components';
import { DifficultyLevel } from '../types';

const Container = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button<{ isSelected?: boolean }>`
  padding: 10px 20px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  background-color: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.button.background};
  color: ${props => props.isSelected ? props.theme.colors.button.background : props.theme.colors.primary};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.button.background};
  }
`;

const DifficultyInfo = styled.div`
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.info.background};
  border-radius: 5px;
  font-size: 14px;
  color: ${props => props.theme.colors.info.text};
  text-align: center;
  
  strong {
    color: ${props => props.theme.colors.info.highlight};
  }
`;

interface DifficultySelectorProps {
    selectedDifficulty: DifficultyLevel;
    onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const DIFFICULTY_INFO = {
    beginner: {
        label: '初级',
        size: '9 × 9',
        mines: 10,
        description: '适合初学者，较少地雷，容易上手'
    },
    intermediate: {
        label: '中级',
        size: '16 × 16',
        mines: 40,
        description: '难度适中，需要一定策略'
    },
    expert: {
        label: '高级',
        size: '30 × 16',
        mines: 99,
        description: '挑战性强，需要细心和技巧'
    }
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    selectedDifficulty,
    onSelectDifficulty
}) => {
    const currentInfo = DIFFICULTY_INFO[selectedDifficulty];

    return (
        <Container>
            <ButtonGroup>
                {Object.entries(DIFFICULTY_INFO).map(([difficulty, info]) => (
                    <Button
                        key={difficulty}
                        isSelected={selectedDifficulty === difficulty}
                        onClick={() => onSelectDifficulty(difficulty as DifficultyLevel)}
                    >
                        {info.label}
                    </Button>
                ))}
            </ButtonGroup>
            <DifficultyInfo>
                <div>
                    棋盘大小: <strong>{currentInfo.size}</strong> |
                    地雷数量: <strong>{currentInfo.mines}</strong>
                </div>
                <div>{currentInfo.description}</div>
            </DifficultyInfo>
        </Container>
    );
}; 