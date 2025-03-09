import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Board } from './Board';
import { UserNamePrompt } from './UserNamePrompt';
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
    color: ${props => props.theme.colors.text.primary};
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

const UserName = styled.div`
    color: ${props => props.theme.colors.text.primary};
    font-size: 1.1em;
    display: flex;
    align-items: center;
    gap: 8px;

    button {
        font-size: 0.9em;
        padding: 4px 8px;
        color: ${props => props.theme.colors.text.secondary};
        background: none;
        border: 1px solid ${props => props.theme.colors.border};
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background: ${props => props.theme.colors.background.secondary};
        }
    }
`;

interface GameProps {
    initialDifficulty?: DifficultyLevel;
    onGameComplete?: () => void;
}

export const Game: React.FC<GameProps> = ({
    initialDifficulty = 'beginner',
    onGameComplete
}) => {
    const [gameId, setGameId] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
    const [userName, setUserName] = useState<string>('');
    const [showPrompt, setShowPrompt] = useState(true);
    const [time, setTime] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const startNewGame = useCallback(async () => {
        if (!userName) {
            setShowPrompt(true);
            return;
        }
        try {
            const response = await createNewGame(difficulty);
            if (response && response.game_id && response.state) {
                setGameId(response.game_id);
                setGameState(response.state);
                setTime(0);
                setMoves(0);
                setIsTimerRunning(true);
            } else {
                console.error('Invalid game response:', response);
            }
        } catch (error) {
            console.error('Failed to start new game:', error);
        }
    }, [difficulty, userName]);

    useEffect(() => {
        const savedUserName = localStorage.getItem('minesweeper_username');
        if (savedUserName) {
            setUserName(savedUserName);
            setShowPrompt(false);
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTimerRunning && gameState && !gameState.is_game_over) {
            timer = setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, gameState?.is_game_over]);

    const handleCellClick = async (x: number, y: number, action: 'reveal' | 'flag') => {
        if (!gameState || gameState.is_game_over) return;
        if (gameId) {
            try {
                const response = await makeMove(gameId, { x, y, action });
                setGameState(response);
                if (action === 'reveal') {
                    setMoves(m => m + 1);
                }
                if (response.is_game_over) {
                    setIsTimerRunning(false);
                    if (response.is_won) {
                        await completeGame(gameId, {
                            user_name: userName,
                            duration: time,
                            moves: moves + 1
                        });
                        onGameComplete?.();
                    }
                }
            } catch (error) {
                console.error('Failed to make move:', error);
            }
        }
    };

    const handleStartOrRestart = async () => {
        if (gameId) {
            try {
                const response = await restartGame(gameId);
                if (response && response.state) {
                    setGameState(response.state);
                    setTime(0);
                    setMoves(0);
                    setIsTimerRunning(true);
                }
            } catch (error) {
                console.error('Failed to restart game:', error);
            }
        } else {
            console.log('Starting new game...');
            await startNewGame();
        }
    };

    const handleUserNameSubmit = (name: string) => {
        setUserName(name);
        setShowPrompt(false);
        localStorage.setItem('minesweeper_username', name);
    };

    const handleChangeUserName = () => {
        setShowPrompt(true);
    };

    const getEmptyBoard = useCallback(() => {
        const width = difficulty === 'beginner' ? 9 : (difficulty === 'intermediate' ? 16 : 30);
        const height = difficulty === 'beginner' ? 9 : (difficulty === 'intermediate' ? 16 : 16);
        return Array(height).fill(null).map(() =>
            Array(width).fill(null).map(() => ({
                is_revealed: false,
                is_mine: false,
                is_flagged: false,
                adjacent_mines: 0
            }))
        );
    }, [difficulty]);

    const handleDifficultyChange = async (newDifficulty: DifficultyLevel) => {
        setDifficulty(newDifficulty);
        // 直接开始新游戏
        try {
            const response = await createNewGame(newDifficulty);
            if (response && response.game_id && response.state) {
                setGameId(response.game_id);
                setGameState(response.state);
                setTime(0);
                setMoves(0);
                setIsTimerRunning(true);
            } else {
                console.error('Invalid game response:', response);
            }
        } catch (error) {
            console.error('Failed to start new game:', error);
        }
    };

    if (showPrompt) {
        return <UserNamePrompt onSubmit={handleUserNameSubmit} />;
    }

    return (
        <GameContainer>
            <Controls>
                <UserName>
                    {userName}
                    <button onClick={handleChangeUserName}>更改</button>
                </UserName>
                <DifficultySelector
                    currentDifficulty={difficulty}
                    onSelect={handleDifficultyChange}
                />
                <Button onClick={handleStartOrRestart}>
                    {gameId ? '重新开始' : '开始游戏'}
                </Button>
            </Controls>

            <GameInfo>
                <div>剩余地雷: {gameState?.mines_remaining ?? 0}</div>
                <Timer time={time} />
                <div>移动次数: {moves}</div>
            </GameInfo>

            <Board
                state={gameState ?? {
                    board: getEmptyBoard(),
                    mines_remaining: 0,
                    is_game_over: false,
                    is_won: false
                }}
                onCellClick={gameId ? handleCellClick : () => { }}
            />

            {gameState?.is_game_over && (
                <div style={{ color: gameState.is_won ? '#4caf50' : '#f44336', fontSize: '1.2em' }}>
                    {gameState.is_won ? '恭喜获胜！' : '游戏结束！'}
                </div>
            )}
        </GameContainer>
    );
}; 