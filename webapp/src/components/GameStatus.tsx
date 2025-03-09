import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
  width: 300px;
  margin: 20px auto;
`;

const MineCount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff4444;
`;

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4444ff;
`;

const RestartButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

interface GameStatusProps {
    minesRemaining: number;
    time: number;
    onRestart: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({
    minesRemaining,
    time,
    onRestart
}) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <StatusContainer>
            <MineCount>💣 {minesRemaining}</MineCount>
            <RestartButton onClick={onRestart}>重新开始</RestartButton>
            <Timer>⏱️ {formatTime(time)}</Timer>
        </StatusContainer>
    );
}; 