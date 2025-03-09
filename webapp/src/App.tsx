import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Game } from './components/Game';
import { Leaderboard } from './components/Leaderboard';
import { GlobalStyle, theme as lightTheme } from './styles/theme';
import { ThemeToggle } from './components/ThemeToggle';

const darkTheme = {
  ...lightTheme,
  name: 'dark' as const,
  colors: {
    ...lightTheme.colors,
    primary: '#2196F3',
    primaryDark: '#1976D2',
    background: {
      primary: '#1e1e1e',
      secondary: '#2d2d2d'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0'
    },
    border: '#404040',
    cell: {
      revealed: '#383838',
      unrevealed: '#2d2d2d',
      hover: '#353535'
    },
    info: {
      background: '#2d2d2d'
    }
  }
};

const AppContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const Title = styled.h1`
    text-align: center;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 30px;
`;

const GameLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    align-items: start;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const GameContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
`;

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(lightTheme);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const toggleTheme = () => {
    setCurrentTheme(current => current.name === 'light' ? darkTheme : lightTheme);
  };

  const handleGameComplete = () => {
    setLeaderboardKey(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <ThemeToggle currentTheme={currentTheme} onToggle={toggleTheme} />
      <AppContainer>
        <Title>扫雷游戏</Title>
        <GameLayout>
          <GameContainer>
            <Game onGameComplete={handleGameComplete} />
          </GameContainer>
          <Leaderboard key={leaderboardKey} />
        </GameLayout>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 