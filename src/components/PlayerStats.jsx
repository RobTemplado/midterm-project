import heartImg from '../assets/heart.png';

import React from 'react';

const PlayerStats = () => {
  const { playerName, playerHP, inventory } = useGame();
  const hpDisplay = typeof playerHP === 'number' && !isNaN(playerHP) ? playerHP : 0;
  const hpPercent = Math.max(0, Math.min(100, playerHP));
  let hpClass = 'hp-good';
  if (hpPercent <= 50) hpClass = 'hp-warn';
  if (hpPercent <= 20) hpClass = 'hp-bad';

  return (
    <div className="stats-upperleft">
      <div className="stats-name">{playerName || 'Hunter'}</div>
      <div className="stats-hp">
        <img src={heartImg} alt="Heart" className="hp-icon" />
        <div className="hp-bar">
          <div className={`hp-fill ${hpClass}`} style={{ width: `${hpPercent}%` }} />
        </div>
        <span className="hp-value">{hpDisplay}/100</span>
      </div>
      <div className="stats-inventory">
        <span className="inv-title">Inventory:</span>
        <div className="inv-boxes">
          {["Asin", "Bawang", "Agimat"].map((item) => {
            let imgSrc = null;
            if (item === "Asin") imgSrc = asinImg;
            if (item === "Bawang") imgSrc = bawangImg;
            if (item === "Agimat") imgSrc = agimatImg;
            return (
              <div className="inv-slot" key={item}>
                {inventory.includes(item) ? (
                  <img
                    src={imgSrc}
                    alt={item}
                    className="inv-img"
                  />
                ) : (
                  <div className="inv-empty" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
