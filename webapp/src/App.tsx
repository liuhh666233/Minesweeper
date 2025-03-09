import React from 'react';
import styled from 'styled-components';
import { Game } from './components/Game';

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

function App() {
  return (
    <AppContainer>
      <Title>扫雷游戏</Title>
      <Game />
    </AppContainer>
  );
}

export default App; 