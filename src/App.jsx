import React from 'react';
import { GameProvider } from './context/GameContext';
import AswangHunter from './components/AswangHunter';

function App() {
  return (
    <GameProvider>
      <AswangHunter />
    </GameProvider>
  );
}

export default App;
