import React from 'react';
import styled from 'styled-components';
import { Theme } from '../styles/theme';

const ToggleButton = styled.button`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    &:hover {
        transform: scale(1.1);
    }
`;

interface ThemeToggleProps {
    currentTheme: Theme;
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggle }) => {
    return (
        <ToggleButton onClick={onToggle} title={`切换到${currentTheme.name === 'light' ? '深色' : '浅色'}主题`}>
            {currentTheme.name === 'light' ? '🌙' : '☀️'}
        </ToggleButton>
    );
}; 