import React from 'react';
import { useGame } from '../context/GameContext';

const GameOverScreen = ({ onPlayAgain }) => {
  const { currentStoryNode, story, isVictory } = useGame();
  const node = story[currentStoryNode] ?? {};

  let endText = node.text ?? (isVictory ? 'You prevailed.' : 'You failed.');

  return (
  <div className="finisher-screen">
      <div className={`end-header ${isVictory ? 'victory' : 'defeat'}`}>
        <h1 className={`end-title ${isVictory ? 'victory' : 'defeat'}`}>{isVictory ? 'VICTORY' : 'GAME OVER'}</h1>
      </div>
      <div className="end-body">
        <p className="end-text">{endText}</p>
        <div className="end-actions center">
          <button className="btn primary" onClick={onPlayAgain}>
            Dare Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
