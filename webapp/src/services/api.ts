import axios from 'axios';
import {
    GameState, GameMove, DifficultyLevel, NewGameResponse,
    LeaderboardEntry, UserStats, GameResult
} from '../types';

const IS_DEV_MODE = import.meta.env.MODE === "development";

const API_BASE_URL = IS_DEV_MODE ? "http://localhost:8000" : (
    `${window.location.protocol}//${window.location.host}`);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true  // 允许跨域请求携带凭证
});

// 添加响应拦截器用于错误处理
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - please check if the backend server is running on port 8000');
        }
        throw error;
    }
);

export const getGameConfig = async () => {
    const response = await api.get('/game/config');
    return response.data;
};

export const createNewGame = async (difficulty: DifficultyLevel): Promise<NewGameResponse> => {
    try {
        const response = await api.post(`/game/new/${difficulty}`);
        console.log('API Response:', response);
        if (!response.data || !response.data.game_id || !response.data.state) {
            throw new Error('Invalid response format');
        }
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const makeMove = async (gameId: number, move: GameMove): Promise<GameState> => {
    try {
        const response = await api.post(`/game/${gameId}/move`, move);
        console.log('Move Response:', response);
        if (!response.data || !response.data.board) {
            throw new Error('Invalid move response format');
        }
        return response.data;
    } catch (error) {
        console.error('Move API Error:', error);
        throw error;
    }
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