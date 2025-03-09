import random
from models import GameConfig, GameState, CellState, GameMove
from typing import List, Tuple, Set

class MinesweeperGame:
    """扫雷游戏逻辑处理类
    
    处理游戏的核心逻辑，包括初始化游戏板、放置地雷、处理玩家操作等。
    
    Attributes:
        config (GameConfig): 游戏配置信息
        state (GameState): 当前游戏状态
        first_move (bool): 是否是第一次移动
    """

    def __init__(self, config: GameConfig):
        """初始化游戏实例
        
        Args:
            config: 游戏配置，包含难度、尺寸和地雷数量
        """
        self.config = config
        self.first_move = True
        self.state = self._initialize_game()

    def _initialize_game(self) -> GameState:
        """初始化游戏状态
        
        创建空游戏板，初始状态下不放置地雷，等待第一次点击。
        
        Returns:
            GameState: 初始化后的游戏状态
        """
        # 创建空游戏板
        board = [[CellState() for _ in range(self.config.width)] 
                for _ in range(self.config.height)]
        
        return GameState(
            board=board,
            mines_remaining=self.config.mines
        )

    def _get_safe_cells(self, x: int, y: int) -> Set[Tuple[int, int]]:
        """获取指定位置周围（包括自身）的所有格子坐标
        
        Args:
            x: 中心格子的x坐标
            y: 中心格子的y坐标
            
        Returns:
            Set[Tuple[int, int]]: 需要保持安全的格子坐标集合
        """
        safe_cells = set()
        for i in range(max(0, x - 1), min(self.config.height, x + 2)):
            for j in range(max(0, y - 1), min(self.config.width, y + 2)):
                safe_cells.add((i, j))
        return safe_cells

    def _place_mines(self, first_x: int, first_y: int) -> None:
        """放置地雷，确保第一次点击的位置及其周围没有地雷
        
        Args:
            first_x: 第一次点击的x坐标
            first_y: 第一次点击的y坐标
        """
        # 获取需要保持安全的格子
        safe_cells = self._get_safe_cells(first_x, first_y)
        
        # 创建所有可能的位置列表（排除安全区域）
        all_positions = [(x, y) for x in range(self.config.height) 
                        for y in range(self.config.width)
                        if (x, y) not in safe_cells]
        
        # 随机选择地雷位置
        mine_positions = random.sample(all_positions, min(self.config.mines, len(all_positions)))
        
        # 放置地雷
        for x, y in mine_positions:
            self.state.board[x][y].is_mine = True

        # 计算每个格子周围的地雷数量
        for x in range(self.config.height):
            for y in range(self.config.width):
                if not self.state.board[x][y].is_mine:
                    self.state.board[x][y].adjacent_mines = self._count_adjacent_mines(self.state.board, x, y)

    def make_move(self, move: GameMove) -> GameState:
        """处理玩家的移动操作
        
        Args:
            move: 玩家的移动操作，包含位置和操作类型
            
        Returns:
            GameState: 更新后的游戏状态
        """
        if self.state.is_game_over:
            return self.state

        x, y = move.x, move.y
        if not (0 <= x < self.config.height and 0 <= y < self.config.width):
            return self.state

        # 如果是第一次点击且是揭示操作
        if self.first_move and move.action == "reveal":
            self._place_mines(x, y)
            self.first_move = False

        cell = self.state.board[x][y]

        if move.action == "flag":
            if not cell.is_revealed:
                cell.is_flagged = not cell.is_flagged
                self.state.mines_remaining += 1 if not cell.is_flagged else -1
        elif move.action == "reveal":
            if cell.is_flagged:
                return self.state
            
            if cell.is_mine:
                self.state.is_game_over = True
                self._reveal_all_mines()
            else:
                self._reveal_cell(x, y)
                self._check_win_condition()

        return self.state

    def _count_adjacent_mines(self, board: List[List[CellState]], x: int, y: int) -> int:
        """计算指定位置周围的地雷数量
        
        Args:
            board: 游戏板
            x: x坐标
            y: y坐标
            
        Returns:
            int: 周围地雷数量
        """
        count = 0
        for i in range(max(0, x - 1), min(self.config.height, x + 2)):
            for j in range(max(0, y - 1), min(self.config.width, y + 2)):
                if board[i][j].is_mine:
                    count += 1
        return count

    def _reveal_cell(self, x: int, y: int):
        """揭示指定位置的格子
        
        如果是空格子（周围没有地雷），则自动揭示周围的格子。
        
        Args:
            x: x坐标
            y: y坐标
        """
        if not (0 <= x < self.config.height and 0 <= y < self.config.width):
            return
        
        cell = self.state.board[x][y]
        if cell.is_revealed or cell.is_flagged:
            return

        cell.is_revealed = True
        
        # 如果是空格子，自动揭示周围的格子
        if cell.adjacent_mines == 0:
            for i in range(max(0, x - 1), min(self.config.height, x + 2)):
                for j in range(max(0, y - 1), min(self.config.width, y + 2)):
                    if (i, j) != (x, y):
                        self._reveal_cell(i, j)

    def _reveal_all_mines(self):
        """揭示所有地雷
        
        游戏结束时调用，显示所有地雷的位置
        """
        for x in range(self.config.height):
            for y in range(self.config.width):
                cell = self.state.board[x][y]
                if cell.is_mine:
                    cell.is_revealed = True
                # 标记错误的旗子（标记为地雷但实际不是地雷的位置）
                elif cell.is_flagged:
                    cell.is_revealed = True

    def _check_win_condition(self):
        """检查是否获胜
        
        当所有非地雷格子都被揭示时，玩家获胜
        """
        for x in range(self.config.height):
            for y in range(self.config.width):
                cell = self.state.board[x][y]
                if not cell.is_mine and not cell.is_revealed:
                    return
        self.state.is_won = True
        self.state.is_game_over = True 