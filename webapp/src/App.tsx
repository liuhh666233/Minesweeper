import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Game } from './components/Game';
import { ThemeToggle } from './components/ThemeToggle';
import { lightTheme, darkTheme } from './styles/theme';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: all 0.3s ease;
  }
`;

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 30px;
`;

function App() {
  const [theme, setTheme] = useState(() => {
    // 从本地存储读取主题设置，默认为浅色主题
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? darkTheme : lightTheme;
  });

  // 当主题改变时保存到本地存储
  useEffect(() => {
    localStorage.setItem('theme', theme.name);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme.name === 'light' ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Title>扫雷游戏</Title>
        <Game />
        <ThemeToggle currentTheme={theme} onToggle={toggleTheme} />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App; 