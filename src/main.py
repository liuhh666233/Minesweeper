from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    GameConfig, GameState, GameMove, DifficultyLevel, 
    DIFFICULTY_SETTINGS, NewGameResponse
)
from game_logic import MinesweeperGame
from typing import Dict, Union

app = FastAPI(
    title="Minesweeper API",
    description="扫雷游戏后端API服务",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active games in memory (in production, you'd want to use a proper database)
games = {}

@app.get("/")
async def root():
    """API根路径
    
    Returns:
        dict: 欢迎消息
    """
    return {"message": "Welcome to Minesweeper API"}

@app.get("/game/config")
async def get_game_config():
    """获取游戏配置信息
    
    Returns:
        dict: 包含所有难度级别的配置信息
    """
    return {
        "difficulties": {
            "beginner": DIFFICULTY_SETTINGS[DifficultyLevel.BEGINNER],
            "intermediate": DIFFICULTY_SETTINGS[DifficultyLevel.INTERMEDIATE],
            "expert": DIFFICULTY_SETTINGS[DifficultyLevel.EXPERT]
        }
    }

@app.post("/game/new/{difficulty}")
async def new_game(difficulty: DifficultyLevel) -> NewGameResponse:
    """创建新游戏
    
    Args:
        difficulty: 游戏难度级别
        
    Returns:
        NewGameResponse: 包含游戏ID和初始状态的响应
    """
    config = DIFFICULTY_SETTINGS[difficulty]
    game = MinesweeperGame(config)
    game_id = len(games)  # Simple incrementing ID (use UUID in production)
    games[game_id] = game
    return NewGameResponse(game_id=game_id, state=game.state)

@app.post("/game/{game_id}/move")
async def make_move(game_id: int, move: GameMove) -> GameState:
    """执行游戏操作
    
    Args:
        game_id: 游戏ID
        move: 移动操作信息
        
    Returns:
        GameState: 更新后的游戏状态
        
    Raises:
        HTTPException: 当游戏ID不存在时抛出404错误
    """
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    new_state = game.make_move(move)
    return new_state

@app.post("/game/{game_id}/restart")
async def restart_game(game_id: int) -> NewGameResponse:
    """重新开始游戏
    
    Args:
        game_id: 游戏ID
        
    Returns:
        NewGameResponse: 包含游戏ID和新的初始状态的响应
        
    Raises:
        HTTPException: 当游戏ID不存在时抛出404错误
    """
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    # Create a new game with the same configuration
    new_game = MinesweeperGame(game.config)
    games[game_id] = new_game
    return NewGameResponse(game_id=game_id, state=new_game.state)

@app.get("/game/{game_id}")
async def get_game_state(game_id: int) -> GameState:
    """获取游戏状态
    
    Args:
        game_id: 游戏ID
        
    Returns:
        GameState: 当前游戏状态
        
    Raises:
        HTTPException: 当游戏ID不存在时抛出404错误
    """
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return games[game_id].state

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 