import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Board } from './Board';
import { DifficultySelector } from './DifficultySelector';
import { Timer } from './Timer';
import { DifficultyLevel, GameState } from '../types';
import { createNewGame, makeMove, restartGame, completeGame } from '../services/api';

const GameContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
`;

const Controls = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const GameInfo = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
    font-size: 1.2em;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background: ${props => props.theme.colors.primary};
    color: white;
    cursor: pointer;
    font-size: 1em;

    &:hover {
        background: ${props => props.theme.colors.primaryDark};
    }
`;

const UserNameInput = styled.input`
    padding: 8px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    font-size: 1em;
`;

interface GameProps {
    initialDifficulty?: DifficultyLevel;
}

export const Game: React.FC<GameProps> = ({
    initialDifficulty = 'beginner'
}) => {
    const [gameId, setGameId] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
    const [userName, setUserName] = useState<string>('');
    const [time, setTime] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const startNewGame = useCallback(async (diff: DifficultyLevel) => {
        try {
            const response = await createNewGame(diff);
            setGameId(response.game_id);
            setGameState(response.state);
            setTime(0);
            setMoves(0);
            setIsTimerRunning(true);
        } catch (error) {
            console.error('Failed to start new game:', error);
        }
    }, []);

    useEffect(() => {
        startNewGame(difficulty);
    }, [difficulty, startNewGame]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTimerRunning && !gameState?.is_game_over) {
            timer = setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, gameState?.is_game_over]);

    const handleCellClick = async (x: number, y: number, action: 'reveal' | 'flag') => {
        if (!gameId || gameState?.is_game_over) return;

        try {
            const newState = await makeMove(gameId, { x, y, action });
            setGameState(newState);
            setMoves(m => m + 1);

            // 如果游戏结束，保存结果
            if (newState.is_game_over && userName) {
                await completeGame(gameId, {
                    user_name: userName,
                    duration: time,
                    moves: moves + 1
                });
                setIsTimerRunning(false);
            }
        } catch (error) {
            console.error('Failed to make move:', error);
        }
    };

    const handleRestart = async () => {
        if (!gameId) return;

        try {
            const response = await restartGame(gameId);
            setGameState(response.state);
            setTime(0);
            setMoves(0);
            setIsTimerRunning(true);
        } catch (error) {
            console.error('Failed to restart game:', error);
        }
    };

    if (!gameState) {
        return <div>加载中...</div>;
    }

    return (
        <GameContainer>
            <Controls>
                <DifficultySelector
                    currentDifficulty={difficulty}
                    onSelect={setDifficulty}
                />
                <UserNameInput
                    placeholder="输入你的名字"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <Button onClick={handleRestart}>
                    重新开始
                </Button>
            </Controls>

            <GameInfo>
                <div>剩余地雷: {gameState.mines_remaining}</div>
                <Timer time={time} />
                <div>移动次数: {moves}</div>
            </GameInfo>

            <Board
                state={gameState}
                onCellClick={handleCellClick}
            />

            {gameState.is_game_over && (
                <div>
                    {gameState.is_won ? '恭喜获胜！' : '游戏结束！'}
                </div>
            )}
        </GameContainer>
    );
}; 