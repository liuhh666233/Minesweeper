export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';

export interface GameConfig {
    difficulty: DifficultyLevel;
    width: number;
    height: number;
    mines: number;
}

export interface GameConfigurations {
    difficulties: {
        [key in DifficultyLevel]: GameConfig;
    };
}

export interface CellState {
    is_revealed: boolean;
    is_mine: boolean;
    is_flagged: boolean;
    adjacent_mines: number;
}

export interface GameState {
    board: CellState[][];
    mines_remaining: number;
    is_game_over: boolean;
    is_won: boolean;
}

export interface GameMove {
    x: number;
    y: number;
    action: 'reveal' | 'flag';
}

export interface NewGameResponse {
    game_id: number;
    state: GameState;
}

export interface LeaderboardEntry {
    rank: number;
    user_name: string;
    best_time: number;
    played_at: string;
}

export interface DifficultyStats {
    games: number;
    wins: number;
    best_time: number | null;
}

export interface UserStats {
    user_name: string;
    stats: {
        beginner: DifficultyStats;
        intermediate: DifficultyStats;
        expert: DifficultyStats;
    };
}

export interface GameResult {
    user_name: string;
    duration: number;
    moves: number;
} 