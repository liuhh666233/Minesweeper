import React from 'react';
import styled from 'styled-components';
import { DifficultyLevel } from '../types';

const Container = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button<{ isSelected?: boolean }>`
  padding: 10px 20px;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  background-color: ${props => props.isSelected ? '#4a90e2' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#4a90e2'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a90e2;
    color: white;
  }
`;

interface DifficultySelectorProps {
    selectedDifficulty: DifficultyLevel;
    onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
    beginner: '初级 (9x9)',
    intermediate: '中级 (16x16)',
    expert: '高级 (30x16)'
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    selectedDifficulty,
    onSelectDifficulty
}) => {
    return (
        <Container>
            {Object.entries(DIFFICULTY_LABELS).map(([difficulty, label]) => (
                <Button
                    key={difficulty}
                    isSelected={selectedDifficulty === difficulty}
                    onClick={() => onSelectDifficulty(difficulty as DifficultyLevel)}
                >
                    {label}
                </Button>
            ))}
        </Container>
    );
}; 