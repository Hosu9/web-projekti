import React, { useState } from "react";
import { useScore } from "../../../context/score-context.jsx";

const Scoreboard = () => {
  const {
    players,
    scores,
    addFrameScore,
    finalizeGame,
    calculateThreeGameAverage,
  } = useScore();
  const [inputScores, setInputScores] = useState({});

  const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  const handleInputChange = (player, frameIndex, value) => {
    const score = parseInt(value, 10);
    if (isNaN(score) || score < 0 || score > 10) {
      return; // Validate that the score is a number between 0 and 10
    }
    setInputScores({
      ...inputScores,
      [player]: {
        ...inputScores[player],
        [frameIndex]: value,
      },
    });
  };

  const handleSaveScore = (player, frameIndex) => {
    const score = parseInt(inputScores[player]?.[frameIndex] || 0, 10);
    if (!isNaN(score)) {
      addFrameScore(player, frameIndex, score);
      setInputScores((prev) => ({
        ...prev,
        [player]: {
          ...prev[player],
          [frameIndex]: "",
        },
      }));
    }
  };

  const handleStrike = (player, frameIndex) => {
    addFrameScore(player, frameIndex, 10); // Automatically assign 10 points for a strike
  };

  return (
    <div>
      {players.map((player) => (
        <div key={player} className="player-score">
          <h3>{capitalizeName(player)}</h3>
          <div className="scores-row">
            {scores[player].map((_, frameIndex) => (
              <div key={frameIndex} className="frame-input">
                <input
                  type="number"
                  value={inputScores[player]?.[frameIndex] || ""}
                  onChange={(e) =>
                    handleInputChange(player, frameIndex, e.target.value)
                  }
                  placeholder={`Score ${frameIndex + 1}`}
                  min="0"
                  max="10"
                />
                <button onClick={() => handleSaveScore(player, frameIndex)}>
                  Save
                </button>
                <button onClick={() => handleStrike(player, frameIndex)}>
                  Strike
                </button>
              </div>
            ))}
          </div>
          <div>
            Total: {scores[player].reduce((sum, frame) => sum + frame, 0)}
          </div>
          <div>Three-Game Average: {calculateThreeGameAverage(player)}</div>
        </div>
      ))}
      <button onClick={finalizeGame} className="finalize-game-button">
        Finalize Game
      </button>
    </div>
  );
};

export default Scoreboard;
