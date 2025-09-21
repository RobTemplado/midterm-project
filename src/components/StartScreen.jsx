import React from 'react';

const StartScreen = ({ onContinue }) => {
  const handleContinue = (e) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <div className="start-card">
      <h1 className="game-title">ASWANG HUNTER</h1>
      <form onSubmit={handleContinue} className="start-form">
        <div className="buttons">
          <button type="submit" className="btn primary">Continue</button>
        </div>
      </form>
    </div>
  );
};

export default StartScreen;
