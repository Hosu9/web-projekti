import React from "react";

const Frame = ({
  frameIndex,
  frame,
  totalScore,
  remainingPins,
  isFrameCompleted,
  handleRoll,
}) => {
  return (
    <div className="frame">
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
            onClick={() => handleRoll(frameIndex, rollValue)}
            disabled={isFrameCompleted || rollValue > remainingPins}
          >
            {rollValue}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Frame;
