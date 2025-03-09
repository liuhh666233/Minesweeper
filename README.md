# Minesweeper Game

一个基于 React + FastAPI 的扫雷游戏实现。

## 功能特点

- 三种难度级别（初级、中级、高级）
- 实时游戏状态显示（剩余地雷数、计时器）
- 左键点击揭示格子，右键点击标记地雷
- 自动展开空白区域
- 游戏胜负判定

## 技术栈

### 后端
- Python 3.8+
- FastAPI
- Pydantic
- Uvicorn

### 前端
- React 18
- TypeScript
- Styled Components
- Axios

## 开发环境设置

1. 进入开发环境：
```bash
nix develop
```

2. 安装依赖：
```bash
# 安装后端依赖
# nix develop 已安装依赖

# 安装前端依赖
cd webapp
yarn install
```

## 运行项目

1. 启动后端服务：
```bash
cd src
python main.py
```
后端服务将在 http://localhost:8000 运行

2. 启动前端开发服务器：
```bash
cd webapp
yarn start
```
前端应用将在 http://localhost:3000 运行

## API 文档

启动后端服务后，可以通过以下地址访问 API 文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 游戏规则

1. 左键点击格子来揭示内容
2. 右键点击格子来标记/取消标记地雷
3. 数字表示周围八个格子中的地雷数量
4. 揭示所有非地雷格子即为胜利
5. 点击到地雷则游戏结束

## 项目结构

```
├── src/                    # 后端代码
│   ├── main.py            # FastAPI 应用入口
│   ├── models.py          # 数据模型定义
│   ├── game_logic.py      # 游戏核心逻辑
│   └── requirements.txt   # Python 依赖
│
└── webapp/                 # 前端代码
    ├── src/
    │   ├── components/    # React 组件
    │   ├── services/      # API 服务
    │   ├── types.ts       # TypeScript 类型定义
    │   └── App.tsx        # 主应用组件
    ├── package.json       # 项目配置
    └── tsconfig.json      # TypeScript 配置
```

