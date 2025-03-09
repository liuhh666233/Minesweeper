import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { DifficultySelector } from './DifficultySelector';
import { Board } from './Board';
import { GameStatus } from './GameStatus';
import { api } from '../services/api';
import { DifficultyLevel, GameState, GameMove } from '../types';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const GameMessage = styled.div<{ won?: boolean }>`
  margin: 20px 0;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: ${props => props.won ? '#4caf50' : '#f44336'};
`;

export const Game: React.FC = () => {
    const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
    const [gameId, setGameId] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [time, setTime] = useState(0);

    const startNewGame = useCallback(async (newDifficulty?: DifficultyLevel) => {
        const selectedDifficulty = newDifficulty || difficulty;
        const response = await api.newGame(selectedDifficulty);
        setGameId(response.game_id);
        setGameState(response.state);
        setTime(0);
    }, [difficulty]);

    const handleMove = async (move: GameMove) => {
        if (!gameId) return;
        const newState = await api.makeMove(gameId, move);
        setGameState(newState);
    };

    const handleRestart = async () => {
        if (!gameId) return;
        const response = await api.restartGame(gameId);
        setGameState(response.state);
        setTime(0);
    };

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState && !gameState.game_over && !gameState.won) {
            timer = setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [gameState]);

    if (!gameState) {
        return <div>Loading...</div>;
    }

    return (
        <GameContainer>
            <DifficultySelector
                selectedDifficulty={difficulty}
                onSelectDifficulty={(newDifficulty) => {
                    setDifficulty(newDifficulty);
                    startNewGame(newDifficulty);
                }}
            />
            <GameStatus
                minesRemaining={gameState.mines_remaining}
                time={time}
                onRestart={handleRestart}
            />
            <Board
                board={gameState.board}
                onMove={handleMove}
                disabled={gameState.game_over || gameState.won}
            />
            {(gameState.game_over || gameState.won) && (
                <GameMessage won={gameState.won}>
                    {gameState.won ? '恭喜你赢了！' : '游戏结束！'}
                </GameMessage>
            )}
        </GameContainer>
    );
}; 