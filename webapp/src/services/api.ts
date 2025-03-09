import axios from 'axios';
import {
    GameState, GameMove, DifficultyLevel, NewGameResponse,
    LeaderboardEntry, UserStats, GameResult
} from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getGameConfig = async () => {
    const response = await api.get('/game/config');
    return response.data;
};

export const createNewGame = async (difficulty: DifficultyLevel): Promise<NewGameResponse> => {
    const response = await api.post(`/game/new/${difficulty}`);
    return response.data;
};

export const makeMove = async (gameId: number, move: GameMove): Promise<GameState> => {
    const response = await api.post(`/game/${gameId}/move`, move);
    return response.data;
};

export const restartGame = async (gameId: number): Promise<NewGameResponse> => {
    const response = await api.post(`/game/${gameId}/restart`);
    return response.data;
};

export const getGameState = async (gameId: number): Promise<GameState> => {
    const response = await api.get(`/game/${gameId}`);
    return response.data;
};

// 新增的API方法
export const completeGame = async (gameId: number, result: GameResult): Promise<void> => {
    await api.post(`/game/${gameId}/complete`, result);
};

export const getLeaderboard = async (difficulty: DifficultyLevel): Promise<LeaderboardEntry[]> => {
    const response = await api.get(`/leaderboard/${difficulty}`);
    return response.data;
};

export const getUserStats = async (userName: string): Promise<UserStats> => {
    const response = await api.get(`/stats/${userName}`);
    return response.data;
}; 