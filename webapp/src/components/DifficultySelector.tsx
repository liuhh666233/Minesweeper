import React from 'react';
import styled from 'styled-components';
import { DifficultyLevel } from '../types';

const Container = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.primary};
    color: ${props => props.active ? '#fff' : props.theme.colors.text.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.theme.colors.primary};
        color: #fff;
    }
`;

export interface DifficultySelectorProps {
    currentDifficulty: DifficultyLevel;
    onSelect: (difficulty: DifficultyLevel) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    currentDifficulty,
    onSelect
}) => {
    return (
        <Container>
            <Button
                active={currentDifficulty === 'beginner'}
                onClick={() => onSelect('beginner')}
            >
                初级
            </Button>
            <Button
                active={currentDifficulty === 'intermediate'}
                onClick={() => onSelect('intermediate')}
            >
                中级
            </Button>
            <Button
                active={currentDifficulty === 'expert'}
                onClick={() => onSelect('expert')}
            >
                高级
            </Button>
        </Container>
    );
}; 