import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import story from '../data/story.json';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useLocalStorage('hunterName', null);
  const [currentStoryNode, setCurrentStoryNode] = useLocalStorage('currentNode', 'start');
  const [playerHP, setPlayerHP] = useLocalStorage('playerHP', 100);
  const [inventory, setInventory] = useLocalStorage('inventory', []);
  const [isGameOver, setIsGameOver] = useLocalStorage('isGameOver', false);
  const [isVictory, setIsVictory] = useLocalStorage('isVictory', false);
  const [lastItemGained, setLastItemGained] = useLocalStorage('lastItemGained', null);
  const [toasts, setToasts] = useLocalStorage('toasts', []);

  // 🔹 Reset game state
  const resetGame = () => {
    setPlayerName(null);
    setCurrentStoryNode('start');
    setPlayerHP(100);
    setInventory([]);
    setIsGameOver(false);
    setIsVictory(false);
    setLastItemGained(null);
    setToasts([]);
  };

  // 🔹 Start a new game
  const startGame = (name) => {
    setPlayerName(name);
    setCurrentStoryNode('start');
    setPlayerHP(100);
    setInventory([]);
    setIsGameOver(false);
    setIsVictory(false);
    setLastItemGained(null);
    setToasts([]);
  };

  // 🔹 Play again
  const playAgain = () => {
    setPlayerName(null);
    setCurrentStoryNode('start');
    setPlayerHP(100);
    setInventory([]);
    setIsGameOver(false);
    setIsVictory(false);
    setLastItemGained(null);
    setToasts([]);
  };

  // 🔹 Make a choice and move to next story node
  const makeChoice = (choice) => {
    if (choice.to) {
      setCurrentStoryNode(choice.to);
    }
  };

  // 🔹 Apply scene effects (damage, add item, etc.)
  const applySceneEffects = (node) => {
    if (node?.onArrive?.addItem) {
      if (!inventory.includes(node.onArrive.addItem)) {
        setInventory([...inventory, node.onArrive.addItem]);
        setLastItemGained(node.onArrive.addItem);
      }
    }
    if (node?.onArrive?.takeDamage) {
      const newHP = Math.max(0, playerHP - node.onArrive.takeDamage);
      setPlayerHP(newHP);
      if (newHP <= 0) {
        setCurrentStoryNode("gameOver_hp");
        setIsGameOver(true);
      }
    }
    if (node?.isEnding) {
      if (node.to === "goodEnding") {
        setIsVictory(true);
      } else {
        setIsGameOver(true);
      }
    }
  };

  // 🔹 Add toast
  const addToast = (message) => {
    const id = Date.now();
    setToasts([...toasts, { id, message }]);
  };

  // 🔹 Remove toast
  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const value = {
    playerName,
    setPlayerName,
    currentStoryNode,
    setCurrentStoryNode,
    playerHP,
    setPlayerHP,
    inventory,
    setInventory,
    isGameOver,
    setIsGameOver,
    isVictory,
    setIsVictory,
    lastItemGained,
    setLastItemGained,
    toasts,
    setToasts,
    story,
    startGame,
    playAgain,
    makeChoice,
    applySceneEffects,
    addToast,
    removeToast,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
