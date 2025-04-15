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
      [newPlayer.id]: Array(10).fill(0),
    }));
  };

  const addFrameScore = (player, frameIndex, score) => {
    setScores((prevScores) => {
      const updatedFrames = [...prevScores[player]];
      updatedFrames[frameIndex] = score;
      return { ...prevScores, [player]: updatedFrames };
    });
  };

  const resetScores = () => {
    setScores((prevScores) => {
      const resetScores = {};
      Object.keys(prevScores).forEach((playerId) => {
        resetScores[playerId] = Array(10).fill(0);
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
