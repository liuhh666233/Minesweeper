import React from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
    font-family: monospace;
    font-size: 1.2em;
    color: ${props => props.theme.colors.text.primary};
`;

interface TimerProps {
    time: number;
}

export const Timer: React.FC<TimerProps> = ({ time }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <TimerContainer>
            时间: {minutes}:{seconds.toString().padStart(2, '0')}
        </TimerContainer>
    );
}; 