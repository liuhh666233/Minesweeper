import random
from models import GameConfig, GameState, CellState, GameMove
from typing import List, Tuple

class MinesweeperGame:
    """扫雷游戏逻辑处理类
    
    处理游戏的核心逻辑，包括初始化游戏板、放置地雷、处理玩家操作等。
    
    Attributes:
        config (GameConfig): 游戏配置信息
        state (GameState): 当前游戏状态
    """

    def __init__(self, config: GameConfig):
        """初始化游戏实例
        
        Args:
            config: 游戏配置，包含难度、尺寸和地雷数量
        """
        self.config = config
        self.state = self._initialize_game()

    def _initialize_game(self) -> GameState:
        """初始化游戏状态
        
        创建空游戏板，随机放置地雷，计算每个格子周围的地雷数量。
        
        Returns:
            GameState: 初始化后的游戏状态
        """
        # Create empty board
        board = [[CellState() for _ in range(self.config.width)] 
                for _ in range(self.config.height)]
        
        # Place mines randomly
        mine_positions = self._place_mines()
        for row, col in mine_positions:
            board[row][col].is_mine = True

        # Calculate adjacent mines for each cell
        for row in range(self.config.height):
            for col in range(self.config.width):
                if not board[row][col].is_mine:
                    board[row][col].adjacent_mines = self._count_adjacent_mines(board, row, col)

        return GameState(
            board=board,
            mines_remaining=self.config.mines
        )

    def _place_mines(self) -> List[Tuple[int, int]]:
        """随机放置地雷
        
        Returns:
            List[Tuple[int, int]]: 地雷位置列表，每个元素为 (行, 列) 坐标
        """
        positions = []
        while len(positions) < self.config.mines:
            row = random.randint(0, self.config.height - 1)
            col = random.randint(0, self.config.width - 1)
            if (row, col) not in positions:
                positions.append((row, col))
        return positions

    def _count_adjacent_mines(self, board: List[List[CellState]], row: int, col: int) -> int:
        """计算指定位置周围的地雷数量
        
        Args:
            board: 游戏板
            row: 行索引
            col: 列索引
            
        Returns:
            int: 周围地雷数量
        """
        count = 0
        for i in range(max(0, row - 1), min(self.config.height, row + 2)):
            for j in range(max(0, col - 1), min(self.config.width, col + 2)):
                if board[i][j].is_mine:
                    count += 1
        return count

    def make_move(self, move: GameMove) -> GameState:
        """处理玩家的移动操作
        
        Args:
            move: 玩家的移动操作，包含位置和操作类型
            
        Returns:
            GameState: 更新后的游戏状态
        """
        if self.state.game_over:
            return self.state

        row, col = move.row, move.col
        if not (0 <= row < self.config.height and 0 <= col < self.config.width):
            return self.state

        cell = self.state.board[row][col]

        if move.action == "flag":
            if not cell.is_revealed:
                cell.is_flagged = not cell.is_flagged
                self.state.mines_remaining += 1 if not cell.is_flagged else -1
        elif move.action == "reveal":
            if cell.is_flagged:
                return self.state
            
            if cell.is_mine:
                self.state.game_over = True
                self._reveal_all_mines()
            else:
                self._reveal_cell(row, col)
                self._check_win_condition()

        return self.state

    def _reveal_cell(self, row: int, col: int):
        """揭示指定位置的格子
        
        如果是空格子（周围没有地雷），则自动揭示周围的格子。
        
        Args:
            row: 行索引
            col: 列索引
        """
        if not (0 <= row < self.config.height and 0 <= col < self.config.width):
            return
        
        cell = self.state.board[row][col]
        if cell.is_revealed or cell.is_flagged:
            return

        cell.is_revealed = True
        
        # If cell has no adjacent mines, reveal neighbors
        if cell.adjacent_mines == 0:
            for i in range(max(0, row - 1), min(self.config.height, row + 2)):
                for j in range(max(0, col - 1), min(self.config.width, col + 2)):
                    if (i, j) != (row, col):
                        self._reveal_cell(i, j)

    def _reveal_all_mines(self):
        """揭示所有地雷
        
        游戏结束时调用，显示所有地雷的位置
        """
        for row in range(self.config.height):
            for col in range(self.config.width):
                if self.state.board[row][col].is_mine:
                    self.state.board[row][col].is_revealed = True

    def _check_win_condition(self):
        """检查是否获胜
        
        当所有非地雷格子都被揭示时，玩家获胜
        """
        for row in range(self.config.height):
            for col in range(self.config.width):
                cell = self.state.board[row][col]
                if not cell.is_mine and not cell.is_revealed:
                    return
        self.state.won = True
        self.state.game_over = True 