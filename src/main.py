import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from models import (
    GameConfig, GameState, GameMove, DifficultyLevel, 
    DIFFICULTY_SETTINGS, NewGameResponse, LeaderboardEntry,
    UserStats, GameResult
)
from game_logic import MinesweeperGame
from typing import Dict, Union, List
from db import GameDB, init_db

app = FastAPI(
    title="Minesweeper API",
    description="扫雷游戏后端API服务",
    version="1.0.0"
)

# 初始化数据库
init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default port
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173"   # Vite dev server alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active games in memory
games = {}

# ┌─────────────────────────┐
# │ Serving the frontend UI │
# └─────────────────────────┘

DEV_FRONTEND_PATH = Path(
    os.getenv("COCKPIT_FRONTEND", str(Path(__file__).parent.parent / "webapp" / "dist"))
)
app.mount("/assets", StaticFiles(directory=DEV_FRONTEND_PATH / "assets", html=True))


@app.get("/")
async def serve_ui():
    return FileResponse(DEV_FRONTEND_PATH / "index.html")


@app.get("/favicon.svg")
async def serve_icon():
    return FileResponse(DEV_FRONTEND_PATH / "favicon.svg")


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

@app.post("/game/{game_id}/complete")
async def complete_game(game_id: int, result: GameResult) -> Dict:
    """完成游戏，保存结果
    
    Args:
        game_id: 游戏ID
        result: 游戏结果
        
    Returns:
        Dict: 保存结果
        
    Raises:
        HTTPException: 当游戏ID不存在时抛出404错误
    """
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    
    # 保存游戏结果
    game_record_id = GameDB.save_game_result(
        user_name=result.user_name,
        difficulty=game.config.difficulty,
        duration=result.duration,
        result=game.state.is_won,
        moves=result.moves,
        board_width=game.config.width,
        board_height=game.config.height,
        mines_count=game.config.mines
    )
    
    return {"message": "Game result saved", "record_id": game_record_id}

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

@app.get("/leaderboard/{difficulty}")
async def get_leaderboard(difficulty: DifficultyLevel) -> List[LeaderboardEntry]:
    """获取排行榜
    
    Args:
        difficulty: 游戏难度
        
    Returns:
        List[LeaderboardEntry]: 排行榜条目列表
    """
    return GameDB.get_leaderboard(difficulty)

@app.get("/stats/{user_name}")
async def get_user_stats(user_name: str) -> UserStats:
    """获取用户统计信息
    
    Args:
        user_name: 用户名
        
    Returns:
        UserStats: 用户统计信息
    """
    return GameDB.get_user_stats(user_name)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 