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
  const [completedRounds, setCompletedRounds] = useState({});

  const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  const handleInputChange = (playerId, frameIndex, rollIndex, value) => {
    const score = parseInt(value, 10);
    if (isNaN(score) || score < 0 || score > 10) {
      return; // Validate that the score is a number between 0 and 10
    }
    setInputScores({
      ...inputScores,
      [playerId]: {
        ...inputScores[playerId],
        [frameIndex]: {
          ...(inputScores[playerId]?.[frameIndex] || {}),
          [rollIndex]: value,
        },
      },
    });
  };

  const handleSaveScore = (playerId, frameIndex) => {
    const frameScores = inputScores[playerId]?.[frameIndex];
    if (frameScores) {
      const roll1 = parseInt(frameScores[0] || 0, 10);
      const roll2 = parseInt(frameScores[1] || 0, 10);

      // adding first roll if it hasnt been added yet
      if (!isNaN(roll1) && scores[playerId][frameIndex]?.length < 1) {
        addFrameScore(playerId, frameIndex, roll1);
      }

      // adding second roll if the first roll is not a strike and it hasnt been added yet
      if (
        !isNaN(roll2) &&
        roll1 !== 10 &&
        scores[playerId][frameIndex]?.length < 2
      ) {
        addFrameScore(playerId, frameIndex, roll2);
      }

      // set the round as completed
      setCompletedRounds((prev) => ({
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [frameIndex]: true,
        },
      }));

      // empty the fields after saving the round
      setInputScores((prev) => ({
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [frameIndex]: {},
        },
      }));
    }
  };

  const handleStrike = (playerId, frameIndex) => {
    addFrameScore(playerId, frameIndex, 10); // Automatically assign 10 points for a strike
    setInputScores((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [frameIndex]: { 0: "10", 1: "" }, // if the first roll is strike then disable the second roll
      },
    }));
  };

  const renderRoundScores = (playerId) => {
    return scores[playerId]
      .map((frame, frameIndex) => {
        if (frame.length > 0) {
          return `R${frameIndex + 1}: ${frame.join(", ")}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(" | ");
  };
  const calculateTotalScore = (frames) => {
    let totalScore = 0;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i] || [];
      const nextFrame = frames[i + 1] || [];
      const frameAfterNext = frames[i + 2] || [];

      // 10th frame special case
      if (i === 9) {
        totalScore += frame.reduce((sum, roll) => sum + (roll || 0), 0);
        break;
      }

      // strike
      if (frame[0] === 10) {
        totalScore += 10;

        if (nextFrame[0] === 10) {
          // if the next throw is also a strike, add 10 + the first roll of the frame after next
          totalScore += 10 + (frameAfterNext[0] || 0);
        } else {
          // if not, add the next two rolls
          totalScore += (nextFrame[0] || 0) + (nextFrame[1] || 0);
        }
      }
      // spare
      else if ((frame[0] || 0) + (frame[1] || 0) === 10) {
        totalScore += 10;

        totalScore += nextFrame[0] || 0;
      } else {
        totalScore += (frame[0] || 0) + (frame[1] || 0);
      }
    }

    return totalScore;
  };
  return (
    <div>
      {players.map((player) => (
        <div key={player.id} className="player-score">
          <h3>{capitalizeName(player.name)}</h3>
          <div className="round-scores">
            <strong>Rounds:</strong> {renderRoundScores(player.id)}
          </div>
          <div className="scores-row">
            {scores[player.id].map((_, frameIndex) => (
              <div key={frameIndex} className="frame-input">
                {/* Add the round number */}
                <div className="round-label">
                  <strong>R{frameIndex + 1}</strong>
                </div>
                <input
                  type="number"
                  value={inputScores[player.id]?.[frameIndex]?.[0] || ""}
                  onChange={(e) =>
                    handleInputChange(player.id, frameIndex, 0, e.target.value)
                  }
                  placeholder={`Roll 1`}
                  min="0"
                  max="10"
                />
                <input
                  type="number"
                  value={inputScores[player.id]?.[frameIndex]?.[1] || ""}
                  onChange={(e) =>
                    handleInputChange(player.id, frameIndex, 1, e.target.value)
                  }
                  placeholder={`Roll 2`}
                  min="0"
                  max="10"
                  disabled={
                    inputScores[player.id]?.[frameIndex]?.[0] === "10" // disable the second input field if the first throw is a strike
                  }
                />
                <button
                  onClick={() => handleSaveScore(player.id, frameIndex)}
                  disabled={completedRounds[player.id]?.[frameIndex]}
                >
                  Save
                </button>
                <button
                  onClick={() => handleStrike(player.id, frameIndex)}
                  disabled={completedRounds[player.id]?.[frameIndex]}
                >
                  Strike
                </button>
              </div>
            ))}
          </div>
          <div>
            <div>Total: {calculateTotalScore(scores[player.id])}</div>
          </div>
          <div>Three-Game Average: {calculateThreeGameAverage(player.id)}</div>
        </div>
      ))}
      <button onClick={finalizeGame} className="finalize-game-button">
        Finalize Game
      </button>
    </div>
  );
};

export default Scoreboard;
