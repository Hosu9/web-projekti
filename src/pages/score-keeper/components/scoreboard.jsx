import React, { useState } from "react";
import { useScore } from "../../../context/score-context.jsx";

const Scoreboard = () => {
  const {
    players,
    scores,
    addFrameScore,
    finalizeGame,
    calculateThreeGameAverage,
    calculateTotalScore,
  } = useScore();
  const [completedRounds, setCompletedRounds] = useState({});

  const handleRoll = (playerId, frameIndex, rollValue) => {
    const frame = scores[playerId][frameIndex] || [];

    // total pins in a frame cannot exceed 10
    if (frameIndex !== 9 && frame.length === 1 && frame[0] + rollValue > 10) {
      alert("Total pins in a frame cannot exceed 10.");
      return;
    }

    // add the roll value to the frame
    addFrameScore(playerId, frameIndex, rollValue);

    // complete the round if the frame is completed
    setCompletedRounds((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [frameIndex]:
          frameIndex === 9
            ? frame.length + 1 >= 3 ||
              (frame[0] !== 10 && frame.length + 1 >= 2)
            : frame[0] === 10 || frame.length + 1 === 2,
      },
    }));
  };

  const renderFrame = (playerId, frameIndex) => {
    const frames = scores[playerId] || [];
    const frame = frames[frameIndex] || [];
    const isFrameCompleted =
      completedRounds[playerId]?.[frameIndex] ||
      (frameIndex === 9 && frame.length >= 3) || // 10th frame logic
      (frameIndex !== 9 && (frame[0] === 10 || frame.length >= 2)); // regular frame logic

    const totalScore = calculateTotalScore(frames.slice(0, frameIndex + 1));

    // calculate remaining pins for the current frame
    const remainingPins =
      frameIndex === 9
        ? 10 // no limit on the tenth frame
        : 10 - (frame.reduce((sum, roll) => sum + roll, 0) || 0);

    return (
      <div key={frameIndex} className="frame">
        <div className="frame-header">Frame {frameIndex + 1}</div>
        <div className="frame-scores">
          {frame.map((roll, index) => (
            <span key={index} className="roll">
              {roll}
            </span>
          ))}
        </div>
        <div className="frame-total">Score: {totalScore}</div>
        <div className="roll-buttons">
          {[...Array(11).keys()].slice(1).map((rollValue) => (
            <button
              key={rollValue}
              onClick={() => handleRoll(playerId, frameIndex, rollValue)}
              disabled={isFrameCompleted || rollValue > remainingPins} // disable buttons if a frame is completed or if the roll would exceed 10 pins
            >
              {rollValue}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="scoreboard">
      {players.map((player) => (
        <div key={player.id} className="player-section">
          <h3>{player.name}</h3>
          <div className="frames">
            {scores[player.id].map((_, frameIndex) =>
              renderFrame(player.id, frameIndex)
            )}
          </div>
          <div className="player-total">
            Total: {calculateTotalScore(scores[player.id])}
          </div>
          <div className="player-average">
            Three-Game Average: {calculateThreeGameAverage(player.id)}
          </div>
        </div>
      ))}
      <button onClick={finalizeGame} className="finalize-game-button">
        Finalize Game
      </button>
    </div>
  );
};

export default Scoreboard;
