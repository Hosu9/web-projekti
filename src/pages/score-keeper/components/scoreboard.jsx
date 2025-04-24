import React, { useState } from "react";
import { useScore } from "../../../context/score-context.jsx";
import { FaPencilAlt } from "react-icons/fa";
import { RoundCountModal } from "./round-count-modal.tsx";
import { WinnerModal } from "./winner-modal";

const Scoreboard = () => {
  // modal state handling
  const [openModal, setOpenModal] = React.useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winnerData, setWinnerData] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseWinnerModal = () => {
    setWinnerModalOpen(false);
    resetGame();
  };

  const {
    players,
    editPlayerName,
    removePlayer,
    scores,
    addFrameScore,
    finalizeGame,
    calculateAverage,
    calculateTotalScore,
    completedRounds,
    setCompletedRounds,
    round,
    gameStarted,
    startGame,
    totalRounds,
    declareWinner,
    resetGame,
  } = useScore();

  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleFinalizeGame = () => {
    finalizeGame(() => {
      if (round === totalRounds) {
        const winner = declareWinner();
        const average = calculateAverage(winner.id);
        setWinnerData({ ...winner, average });
        setWinnerModalOpen(true);
      }
    });
  };

  const handleEditClick = (playerId, currentName) => {
    setEditingPlayerId(playerId); // edit player name
    setNewPlayerName(currentName); // fill the field with the current name
  };

  const handleSaveClick = (playerId) => {
    if (newPlayerName.trim()) {
      editPlayerName(playerId, newPlayerName.trim()); // save the new name
      setEditingPlayerId(null);
    }
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      handleOpenModal();
    } else {
      alert("Please add at least 2 players to start the game.");
    }
  };

  const setRoundAmount = (round) => {
    startGame(round);
    setOpenModal(false);
  };

  if (!gameStarted) {
    return (
      <div className="players">
        <h2>Players</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {editingPlayerId === player.id ? (
                <>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                  />
                  <button onClick={() => handleSaveClick(player.id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  {player.name}
                  <button
                    onClick={() => handleEditClick(player.id, player.name)}
                    className="edit-button"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="delete-button"
                  >
                    X
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* open the round count modal when openModal is set to true */}
        {openModal && (
          <RoundCountModal
            closeModal={handleCloseModal}
            onConfirm={setRoundAmount}
          />
        )}

        <button onClick={handleStartGame} className="start-game-button">
          Start Game
        </button>
      </div>
    );
  }

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
    setCompletedRounds((prev) => {
      const updated = {
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [frameIndex]:
            frameIndex === 9
              ? frame.length + 1 >= 3 || // if 3 rolls are made in the 10th frame
                (frame[0] !== 10 && frame.length + 1 >= 2) // if 2 rolls are made and not a strike
              : rollValue === 10 || // if strike is made
                frame.length + 1 === 2, // if 2 rolls are made in a frame
        },
      };
      return updated;
    });
  };

  const areAllFramesCompleted =
    players.length > 0 &&
    players.every((player) =>
      scores[player.id].every(
        (_, frameIndex) => completedRounds[player.id]?.[frameIndex]
      )
    );

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
          <div className="player-header-container">
            <div class="player-card-header">
              <h3>Player {player.name}</h3>
              <h3>Round {round}</h3>
            </div>
          </div>

          <div className="frames">
            {scores[player.id].map((_, frameIndex) =>
              renderFrame(player.id, frameIndex)
            )}
          </div>

          <div className="player-score-container player-header-container">
            <div className="player-total">
              Total: {calculateTotalScore(scores[player.id])}
            </div>
            <div className="player-average">
              Game Average: {calculateAverage(player.id)}
            </div>
          </div>
        </div>
      ))}
      {areAllFramesCompleted && (
        <button onClick={handleFinalizeGame} className="finalize-game-button">
          Finalize Game
        </button>
      )}

      {winnerModalOpen && (
        <WinnerModal closeModal={handleCloseWinnerModal} winner={winnerData} />
      )}
    </div>
  );
};
export default Scoreboard;
