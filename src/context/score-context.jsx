import React, { useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameScores, setGameScores] = useState({}); // Store scores for multiple games

  const addPlayer = (name) => {
    const newPlayer = { id: uuidv4(), name };
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setScores((prevScores) => ({
      ...prevScores,
      [newPlayer.id]: Array(10)
        .fill(null)
        .map(() => []), // each frame as an empty array
    }));
  };

  const addFrameScore = (playerId, frameIndex, score) => {
    setScores((prevScores) => {
      const updatedFrames = [...prevScores[playerId]];

      // make sure tha the frame is an array
      if (!Array.isArray(updatedFrames[frameIndex])) {
        updatedFrames[frameIndex] = [];
      }

      // adding the rolls to the frames
      if (
        updatedFrames[frameIndex].length < 2 ||
        (frameIndex === 9 && updatedFrames[frameIndex].length < 3)
      ) {
        updatedFrames[frameIndex].push(score);
      }

      // spare bonus
      if (
        frameIndex > 0 &&
        updatedFrames[frameIndex - 1].length === 2 &&
        updatedFrames[frameIndex - 1].reduce((sum, roll) => sum + roll, 0) ===
          10
      ) {
        // adding the current roll as a bonus points to the previous frame
        updatedFrames[frameIndex - 1].push(score);
      }

      // strike bonus
      if (
        frameIndex > 1 &&
        updatedFrames[frameIndex - 2][0] === 10 &&
        updatedFrames[frameIndex - 2].length < 3
      ) {
        // adding the current roll as a bonus points to the frame two frames ago
        updatedFrames[frameIndex - 2].push(score);
      }

      return { ...prevScores, [playerId]: updatedFrames };
    });
  };

  const resetScores = () => {
    setScores((prevScores) => {
      const resetScores = {};
      Object.keys(prevScores).forEach((playerId) => {
        resetScores[playerId] = Array(10)
          .fill(null)
          .map(() => []); // reset frames as empty arrays
      });
      return resetScores;
    });
  };
  const finalizeGame = () => {
    setGameScores((prevGameScores) => {
      const updatedGameScores = { ...prevGameScores };
      for (const player of players) {
        const totalScore = scores[player.id].reduce(
          (sum, frame) => sum + frame,
          0
        );
        updatedGameScores[player.id] = [
          ...(updatedGameScores[player.id] || []),
          totalScore,
        ];
      }
      return updatedGameScores;
    });

    // Reset scores for the next game
    resetScores();
  };

  const calculateThreeGameAverage = (playerId) => {
    const games = gameScores[playerId] || [];
    const total = games.reduce((sum, game) => sum + game, 0);
    return games.length > 0 ? (total / games.length).toFixed(2) : 0;
  };

  return (
    <ScoreContext.Provider
      value={{
        players,
        addPlayer,
        scores,
        addFrameScore,
        resetScores, // Add resetScores to the context
        finalizeGame,
        calculateThreeGameAverage,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
