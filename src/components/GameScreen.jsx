import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import PlayerStats from './PlayerStats';

const GameScreen = () => {
  const { currentStoryNode, makeChoice, inventory, story, playerHP } = useGame();
  const layoutRef = useRef(null);


  const node = story[currentStoryNode] ?? {
    text: "Something's gone wrong — that story node doesn't exist.",
    choices: [],
  };

  const handleChoice = (to) => {
    makeChoice(to);
  };

  const isChoiceAvailable = (choice) => {
    if (!choice) return false;
    if (choice.requires && !inventory.includes(choice.requires)) {
      return false;
    }
    if (choice.hideIf && inventory.includes(choice.hideIf)) {
      return false;
    }
    return true;
  };

  return (
    <div ref={layoutRef} className="game-main-layout">
      <div className="game-upper">
        <PlayerStats />
        <div className="scene flicker">
          <p className="scene-text vhs-text">{node.text}</p>
        </div>
      </div>
      <div className="game-lower">
        {(() => {
          const availableChoices = node.choices ? node.choices.filter(isChoiceAvailable) : [];
          if (availableChoices.length === 1) {
            return (
              <div className="game-choice solo">
                <button
                  className="btn choice vhs-btn"
                  onClick={() => handleChoice(availableChoices[0])}
                >
                  {availableChoices[0].text}
                </button>
              </div>
            );
          } else if (availableChoices.length > 1) {
            return (
              <>
                <div className="game-choice left">
                  {availableChoices[0] && (
                    <button
                      className="btn choice vhs-btn"
                      onClick={() => handleChoice(availableChoices[0])}
                    >
                      {availableChoices[0].text}
                    </button>
                  )}
                </div>
                <div className="game-choice right">
                  {availableChoices[1] && (
                    <button
                      className="btn choice vhs-btn"
                      onClick={() => handleChoice(availableChoices[1])}
                    >
                      {availableChoices[1].text}
                    </button>
                  )}
                </div>
              </>
            );
          } else {
            // No available choices: show nothing
            return null;
          }
        })()}
      </div>
    </div>
  );
};

export default GameScreen;