import React, { useState, useEffect } from "react";
import useLocalStorage from '../hooks/useLocalStorage';
import LoreScreen from "./LoreScreen";
import GameOverScreen from "./GameOverScreen";
import { useGame } from "../context/GameContext";
import Toast from "./Toast";
import hellcome from "../assets/hellcome.png";
import heartImg from "../assets/heart.png";

// Import item images
import asinImg from "../assets/asin.png";
import agimatImg from "../assets/agimat.png";
import bawangImg from "../assets/bawang.png";
import boloImg from "../assets/bolo.png";

// Map item names to images
const itemImages = {
  asin: asinImg,
  agimat: agimatImg,
  bawang: bawangImg,
  bolo: boloImg,
};

const AswangHunter = () => {
  const [transitioning, setTransitioning] = useState(false);
  const [step, setStep] = useLocalStorage('hunterStep', 0); // 0=start, 1=name, 2=lore, 3=welcome, 4=game
  const [inputName, setInputName] = useState("");
  const {
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
    story,
    playAgain,
    toasts,
    setToasts,
  } = useGame();

  // Play Again handler
  const handlePlayAgain = () => {
    playAgain();
    setInputName("");
    setStep(0);
  };

  // Toast handler
  const addToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle choice selection
  const handleChoice = (choice) => {
    if (choice.damage) {
      const newHP = Math.max(0, playerHP - choice.damage);
      setPlayerHP(newHP);
      addToast(`You took ${choice.damage} damage!`, "damage");
      if (newHP <= 0) {
        setIsGameOver(true);
        return;
      }
    }
    if (choice.item) {
      setInventory([...inventory, choice.item]);
      setLastItemGained(choice.item);
      addToast(`You got ${choice.item}!`, "success");
    }
    setCurrentStoryNode(choice.to);

    const nextNode = story[choice.to];
    if (nextNode) {
      if (nextNode.isEnding) {
        if (choice.to === "goodEnding") {
          setIsVictory(true);
        } else {
          setIsGameOver(true);
        }
      }
      if (nextNode.onArrive) {
        if (nextNode.onArrive.addItem && !inventory.includes(nextNode.onArrive.addItem)) {
          setInventory([...inventory, nextNode.onArrive.addItem]);
          setLastItemGained(nextNode.onArrive.addItem);
        }
        if (nextNode.onArrive.takeDamage) {
          const newHP = Math.max(0, playerHP - nextNode.onArrive.takeDamage);
          setPlayerHP(newHP);
          addToast(`You took ${nextNode.onArrive.takeDamage} damage!`, "damage");
          if (newHP <= 0) {
            setIsGameOver(true);
          }
        }
      }
    }
  };

  // Welcome screen auto-transition with smooth fade-out
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setTransitioning(true);
        // Wait for fade-out animation, then show main game
        const fadeTimer = setTimeout(() => {
          setStep(4);
          setTransitioning(false);
        }, 1000); // fade-out duration matches CSS
        return () => clearTimeout(fadeTimer);
      }, 1500); // Show welcome for 1.5s
      return () => clearTimeout(timer);
    }
  }, [step]);

  // === UI SCREENS ===

  // Game Over screen
  if (isGameOver) {
    return (
      <div className="overlay-gameover">
        <GameOverScreen onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  // Victory screen
  if (isVictory) {
    return (
      <div className="overlay-gameover">
        <GameOverScreen onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  // Step 0: Start button
  if (step === 0) {
    return (
      <div className="welcome-bg">
        <div className={`welcome-screen${transitioning ? ' fade-out' : ' fade-in'}`}>
          <h1 className="welcome-title">ASWANG HUNTER</h1>
          <div className="name-start-center">
            <button className="welcome-start-btn" onClick={() => {
              setTransitioning(true);
              setTimeout(() => {
                setStep(1);
                setTransitioning(false);
              }, 500);
            }}>Start</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Name input
  if (step === 1) {
    return (
      <div className="name-bg">
        <form onSubmit={e => {
          e.preventDefault();
          if (inputName.trim()) {
            setTransitioning(true);
            setTimeout(() => {
              setPlayerName(inputName);
              setCurrentStoryNode("start");
              setStep(2);
              setTransitioning(false);
            }, 500);
          }
        }} className={`start-form${transitioning ? ' fade-out' : ' fade-in'}`}>
          <input
            type="text"
            placeholder="Enter your name"
            className="name-input"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            required
          />
          <div className="name-start-center">
            <button type="submit" className="lore-continue">Continue</button>
          </div>
        </form>
      </div>
    );
  }

  // Step 2: Lore screen
  if (step === 2) {
    return <LoreScreen onContinue={() => {
      setTransitioning(true);
      setTimeout(() => {
        setStep(3);
        setTransitioning(false);
      }, 500);
    }} transitioning={transitioning} />;
  }

  // Step 3: Welcome-only screen after lore
  if (step === 3) {
    return (
      <div className="welcome-bg-image">
        <h2 className="welcome-message">Welcome, {playerName}!</h2>
      </div>
    );
  }

  const node = story[currentStoryNode];

  // Add fade-in to main game screen after welcome
  const gameContentClass = step === 4 ? (transitioning ? "fade-out" : "fade-in") : "";

  // Always show bolo in the first slot, then inventory items in the next 3 slots
  const inventoryDisplay = ["bolo", ...inventory].slice(0, 4);

  return (
    <div className={`game-content ${gameContentClass}`}>
      {/* Line 338 omitted */}
      <div className="stats-upperleft">
        <div className="stats-name">{playerName}</div>
        <div className="stats-hp">
          <img src={heartImg} alt="HP" className="hp-icon" />
          <div className="hp-bar">
            <div
              className={`hp-fill ${playerHP > 60 ? "hp-good" : playerHP > 30 ? "hp-warn" : "hp-bad"}`}
              style={{ width: `${playerHP}%` }}
            ></div>
          </div>
          <span className="hp-value">{playerHP}</span>
        </div>
        <div className="stats-inventory">
          <span className="inv-title">Inventory:</span>
          <div className="inv-boxes">
            {[0, 1, 2, 3].map((i) => (
              inventoryDisplay[i] ? (
                <div key={i} className="inv-slot">
                  {itemImages[inventoryDisplay[i]?.toLowerCase()] ? (
                    <img
                      className="inv-img"
                      src={itemImages[inventoryDisplay[i]?.toLowerCase()]}
                      alt={inventoryDisplay[i]}
                    />
                  ) : (
                    <span className="inv-img">{inventoryDisplay[i]}</span>
                  )}
                </div>
              ) : (
                <div key={i} className="inv-slot">
                  <div className="inv-empty"></div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Main game layout */}
      <div className="game-main-layout">
        <div className="game-upper">
          <p className="scene-text">{node.text}</p>
        </div>

        <div className="game-lower">
          {(() => {
            const availableChoices = node.choices && node.choices.filter(choice => !choice.requires || inventory.includes(choice.requires));
            if (!availableChoices || availableChoices.length === 0) return null;
            if (availableChoices.length === 1) {
              return (
                <div className="game-choice solo solo-center">
                  <button onClick={() => handleChoice(availableChoices[0])}>
                    {availableChoices[0].text}
                  </button>
                </div>
              );
            }
            return availableChoices.map((choice, index) => (
              <div
                key={index}
                className={`game-choice ${index === 0 ? "left" : "right"}`}
              >
                <button onClick={() => handleChoice(choice)}>
                  {choice.text}
                </button>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default AswangHunter;