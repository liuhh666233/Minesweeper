from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class DifficultyLevel(str, Enum):
    """游戏难度级别枚举
    
    Attributes:
        BEGINNER: 初级难度 (9x9 网格，10个地雷)
        INTERMEDIATE: 中级难度 (16x16 网格，40个地雷)
        EXPERT: 高级难度 (30x16 网格，99个地雷)
    """
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERT = "expert"

class GameConfig(BaseModel):
    """游戏配置模型
    
    Attributes:
        difficulty: 游戏难度级别
        width: 游戏板宽度
        height: 游戏板高度
        mines: 地雷数量
    """
    difficulty: DifficultyLevel
    width: int
    height: int
    mines: int

class CellState(BaseModel):
    """单元格状态模型
    
    Attributes:
        is_revealed: 是否已经揭示
        is_mine: 是否是地雷
        is_flagged: 是否被标记为地雷
        adjacent_mines: 相邻地雷数量
    """
    is_revealed: bool = False
    is_mine: bool = False
    is_flagged: bool = False
    adjacent_mines: int = 0

class GameState(BaseModel):
    """游戏状态模型
    
    Attributes:
        board: 二维数组表示的游戏板
        game_over: 游戏是否结束
        won: 是否获胜
        mines_remaining: 剩余地雷数量
    """
    board: List[List[CellState]]
    game_over: bool = False
    won: bool = False
    mines_remaining: int

class GameMove(BaseModel):
    """游戏移动操作模型
    
    Attributes:
        row: 操作的行索引
        col: 操作的列索引
        action: 操作类型 ("reveal" 揭示或 "flag" 标记)
    """
    row: int
    col: int
    action: str  # "reveal" or "flag"

class NewGameResponse(BaseModel):
    """新游戏响应模型
    
    Attributes:
        game_id: 游戏ID
        state: 初始游戏状态
    """
    game_id: int
    state: GameState

# 不同难度级别的游戏配置
DIFFICULTY_SETTINGS = {
    DifficultyLevel.BEGINNER: GameConfig(
        difficulty=DifficultyLevel.BEGINNER,
        width=9,
        height=9,
        mines=10
    ),
    DifficultyLevel.INTERMEDIATE: GameConfig(
        difficulty=DifficultyLevel.INTERMEDIATE,
        width=16,
        height=16,
        mines=40
    ),
    DifficultyLevel.EXPERT: GameConfig(
        difficulty=DifficultyLevel.EXPERT,
        width=30,
        height=16,
        mines=99
    )
} 