import os
from pathlib import Path
import duckdb
from datetime import datetime
from typing import List, Optional, Dict
from models import DifficultyLevel, GameState

# 获取数据库路径
DB_PATH = os.getenv('MINESWEEPER_DB_PATH', 
                    str(Path.home() / '.minesweeper' / 'minesweeper.db'))
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def get_db():
    """获取数据库连接"""
    return duckdb.connect(database=DB_PATH, read_only=False)

def init_db():
    """初始化数据库"""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS game_records (
                game_id UUID PRIMARY KEY,
                user_id VARCHAR,
                user_name VARCHAR NOT NULL,
                difficulty VARCHAR NOT NULL,
                duration INTEGER NOT NULL,
                result BOOLEAN NOT NULL,
                moves INTEGER NOT NULL,
                board_width INTEGER NOT NULL,
                board_height INTEGER NOT NULL,
                mines_count INTEGER NOT NULL,
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.execute("""
            CREATE TABLE IF NOT EXISTS user_stats (
                user_id VARCHAR PRIMARY KEY,
                user_name VARCHAR NOT NULL,
                beginner_games INTEGER DEFAULT 0,
                beginner_wins INTEGER DEFAULT 0,
                beginner_best_time INTEGER,
                intermediate_games INTEGER DEFAULT 0,
                intermediate_wins INTEGER DEFAULT 0,
                intermediate_best_time INTEGER,
                expert_games INTEGER DEFAULT 0,
                expert_wins INTEGER DEFAULT 0,
                expert_best_time INTEGER,
                last_played_at TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

class GameDB:
    @staticmethod
    def save_game_result(
        user_name: str,
        difficulty: DifficultyLevel,
        duration: int,
        result: bool,
        moves: int,
        board_width: int,
        board_height: int,
        mines_count: int,
        user_id: Optional[str] = None
    ) -> str:
        """保存游戏结果"""
        with get_db() as conn:
            game_id = duckdb.default_connection.execute(
                "SELECT uuid() as uuid"
            ).fetchone()[0]
            
            conn.execute("""
                INSERT INTO game_records (
                    game_id, user_id, user_name, difficulty, duration,
                    result, moves, board_width, board_height, mines_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (game_id, user_id, user_name, difficulty.value, duration,
                 result, moves, board_width, board_height, mines_count))
            
            # 更新用户统计
            GameDB._update_user_stats(
                conn, user_id, user_name, difficulty.value, duration, result
            )
            
            return game_id

    @staticmethod
    def get_leaderboard(difficulty: DifficultyLevel) -> List[Dict]:
        """获取指定难度的排行榜"""
        with get_db() as conn:
            result = conn.execute("""
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY duration ASC) as rank,
                    user_name,
                    duration as best_time,
                    played_at
                FROM game_records
                WHERE difficulty = ?
                    AND result = true
                ORDER BY duration ASC
                LIMIT 10
            """, [difficulty.value]).fetchall()
            
            return [
                {
                    "rank": r[0],
                    "user_name": r[1],
                    "best_time": r[2],
                    "played_at": r[3].isoformat()
                }
                for r in result
            ]

    @staticmethod
    def get_user_stats(user_name: str) -> Dict:
        """获取用户统计信息"""
        with get_db() as conn:
            result = conn.execute("""
                SELECT 
                    user_name,
                    beginner_games, beginner_wins, beginner_best_time,
                    intermediate_games, intermediate_wins, intermediate_best_time,
                    expert_games, expert_wins, expert_best_time
                FROM user_stats
                WHERE user_name = ?
            """, [user_name]).fetchone()
            
            if result is None:
                return {
                    "user_name": user_name,
                    "stats": {
                        "beginner": {"games": 0, "wins": 0, "best_time": None},
                        "intermediate": {"games": 0, "wins": 0, "best_time": None},
                        "expert": {"games": 0, "wins": 0, "best_time": None}
                    }
                }
            
            return {
                "user_name": result[0],
                "stats": {
                    "beginner": {
                        "games": result[1],
                        "wins": result[2],
                        "best_time": result[3]
                    },
                    "intermediate": {
                        "games": result[4],
                        "wins": result[5],
                        "best_time": result[6]
                    },
                    "expert": {
                        "games": result[7],
                        "wins": result[8],
                        "best_time": result[9]
                    }
                }
            }

    @staticmethod
    def _update_user_stats(
        conn,
        user_id: Optional[str],
        user_name: str,
        difficulty: str,
        duration: int,
        result: bool
    ):
        """更新用户统计信息"""
        games_field = f"{difficulty.lower()}_games"
        wins_field = f"{difficulty.lower()}_wins"
        best_time_field = f"{difficulty.lower()}_best_time"
        
        current_stats = conn.execute("""
            SELECT * FROM user_stats WHERE user_name = ?
        """, [user_name]).fetchone()
        
        if current_stats is None:
            # 为新用户生成UUID
            new_user_id = duckdb.default_connection.execute(
                "SELECT uuid() as uuid"
            ).fetchone()[0]
            
            conn.execute(f"""
                INSERT INTO user_stats (
                    user_id, user_name, {games_field}, {wins_field}, 
                    {best_time_field}, last_played_at
                ) VALUES (?, ?, 1, ?, ?, CURRENT_TIMESTAMP)
            """, (new_user_id, user_name, 1 if result else 0, 
                 duration if result else None))
        else:
            conn.execute(f"""
                UPDATE user_stats 
                SET {games_field} = {games_field} + 1,
                    {wins_field} = {wins_field} + ?,
                    {best_time_field} = CASE 
                        WHEN {best_time_field} IS NULL OR 
                             (? < {best_time_field} AND ? IS NOT NULL)
                        THEN ?
                        ELSE {best_time_field}
                    END,
                    last_played_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_name = ?
            """, (1 if result else 0, duration, duration, duration, user_name)) 