import React, { useState, useEffect } from "react";
import { useScore } from "../../../context/score-context.jsx";
import { WinnerModal } from "./winner-modal";
import { Button } from "../../../components/button.jsx";
import Frame from "./Frame.jsx";
import PreGameView from "./pre-game-view.jsx";

const Scoreboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const { resetScores } = useScore();

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
    gameScores,
  } = useScore();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleCloseWinnerModal = () => {
    setWinnerModalOpen(false);
    resetGame();
  };

  const handleFinalizeGame = () => finalizeGame();

  useEffect(() => {
    if (round > totalRounds) {
      const winner = declareWinner();
      setWinnerData(winner);
      setWinnerModalOpen(true);
    }
  }, [gameScores, round, totalRounds, declareWinner]);

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

  // frame logic
  const handleRoll = (playerId, frameIndex, rollValue) => {
    const frame = scores[playerId][frameIndex] || [];

    if (frameIndex !== 9 && frame.length === 1 && frame[0] + rollValue > 10) {
      alert("Total pins in a frame cannot exceed 10.");
      return;
    }

    addFrameScore(playerId, frameIndex, rollValue);

    setCompletedRounds((prev) => {
      const updated = {
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [frameIndex]:
            frameIndex === 9
              ? frame.length + 1 >= 3 || // if 3 rolls are made in the 10th frame
                (frame[0] !== 10 && frame.length + 1 >= 2) // if 2 rolls are made and not a strike
              : rollValue === 10 || frame.length + 1 === 2,
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
    const remainingPins =
      frameIndex === 9
        ? 10 // no limit on the tenth frame
        : 10 - (frame.reduce((sum, roll) => sum + roll, 0) || 0);

    return (
      <Frame
        key={frameIndex}
        frameIndex={frameIndex}
        frame={frame}
        totalScore={totalScore}
        remainingPins={remainingPins}
        isFrameCompleted={isFrameCompleted}
        handleRoll={(frameIndex, rollValue) =>
          handleRoll(playerId, frameIndex, rollValue)
        }
      />
    );
  };

  if (!gameStarted) {
    return (
      <PreGameView
        players={players}
        editingPlayerId={editingPlayerId}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        removePlayer={removePlayer}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        setRoundAmount={setRoundAmount}
        handleStartGame={handleStartGame}
      />
    );
  }

  // actual game view
  return (
    <div className="scoreboard">
      <Button
        onClick={() => resetScores()}
        value="Reset Scores"
        className="reset-button"
      />

      {players.map((player) => (
        <div key={player.id} className="player-section">
          <div className="player-header-container">
            <div className="player-card-header">
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
              Game Average: {calculateAverage(player.id, gameScores)}
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
