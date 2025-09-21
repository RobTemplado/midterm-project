import React, { useState, useEffect, useRef } from "react";
import hellcome from "../assets/hellcome.png";

const loreText = ` San Gubat, a town veiled in perpetual twilight, holds a dark secret. For generations, whispers of monstrous figures from Filipino folklore have haunted its people. A winged horror, part woman and part beast, detaches its torso to hunt under the moon, while a different kind of terror, a monstrous, scavenging fiend, snatches men from their beds. The wails of a demonic baby echo from the rice fields, luring the lost to a gruesome end. The town's last hope rests on a stranger, a hunter seeking to face these nightmares. To survive, you must navigate a web of secrets, choosing who to trust and what tools to carry as you journey from a desecrated church to a colossal, ancient Balete tree—the heart of the darkness. Do you have what it takes to survive and save San Gubat?`;

const LoreScreen = ({ onContinue, transitioning }) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [done, setDone] = useState(false);
  const iRef = useRef(0);
  const timeoutRef = useRef();

  useEffect(() => {
    let currentLine = "";
    function type() {
      if (iRef.current < loreText.length) {
        const nextChar = loreText[iRef.current];
        if (typeof nextChar === 'string') {
          if (nextChar === '\n') {
            setDisplayedLines((prev) => [...prev, currentLine]);
            currentLine = "";
          } else {
            currentLine += nextChar;
            setDisplayedLines((prev) => {
              const lines = [...prev];
              if (lines.length === 0) {
                lines.push("");
              }
              lines[lines.length - 1] = currentLine;
              return lines;
            });
          }
        }
        iRef.current += 1;
        timeoutRef.current = setTimeout(type, 50);
      } else {
        setDone(true);
      }
    }
    type();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Skip button handler: instantly finish the lore text
  const handleSkip = () => {
    clearTimeout(timeoutRef.current);
    setDisplayedLines([loreText]);
    setDone(true);
    iRef.current = loreText.length;
    setSkipPressed(true);
  };

  // Track if skip was pressed
  const [skipPressed, setSkipPressed] = useState(false);

  return (
    <div className="lore-bg">
      <div className={`lore-screen${transitioning ? ' fade-out' : ' fade-in'}`}>
        <h2 className="lore-title">A CURSED TOWN</h2>
        <div className="lore-text">
          {displayedLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
        {/* Tiny skip button in top right corner, hidden after pressed */}
        {!skipPressed && !done && (
          <button className="lore-skip" onClick={handleSkip}>Skip</button>
        )}
        {done && (
          <button className="lore-continue" onClick={onContinue}>Continue</button>
        )}
      </div>
    </div>
  );
};

export default LoreScreen;