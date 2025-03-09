import axios from 'axios';
import { DifficultyLevel, GameState, GameMove, NewGameResponse, GameConfigurations } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
    async getGameConfig(): Promise<GameConfigurations> {
        const response = await axios.get<GameConfigurations>(`${API_BASE_URL}/game/config`);
        return response.data;
    },

    async newGame(difficulty: DifficultyLevel): Promise<NewGameResponse> {
        const response = await axios.post<NewGameResponse>(`${API_BASE_URL}/game/new/${difficulty}`);
        return response.data;
    },

    async makeMove(gameId: number, move: GameMove): Promise<GameState> {
        const response = await axios.post<GameState>(`${API_BASE_URL}/game/${gameId}/move`, move);
        return response.data;
    },

    async restartGame(gameId: number): Promise<NewGameResponse> {
        const response = await axios.post<NewGameResponse>(`${API_BASE_URL}/game/${gameId}/restart`);
        return response.data;
    },

    async getGameState(gameId: number): Promise<GameState> {
        const response = await axios.get<GameState>(`${API_BASE_URL}/game/${gameId}`);
        return response.data;
    }
}; 