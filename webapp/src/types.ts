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
    game_over: boolean;
    won: boolean;
    mines_remaining: number;
}

export interface GameMove {
    row: number;
    col: number;
    action: 'reveal' | 'flag';
}

export interface NewGameResponse {
    game_id: number;
    state: GameState;
} 