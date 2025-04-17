import React, { useState, createContext, useContext } from "react";

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameScores, setGameScores] = useState({}); // Store scores for multiple games

  const addPlayer = (name) => {
    if (players.length < 4 && name.trim() !== "") {
      setPlayers([...players, name]);
      setScores({ ...scores, [name]: Array(10).fill(0) });
      setGameScores({ ...gameScores, [name]: [] });
    }
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
      for (const player in prevScores) {
        resetScores[player] = Array(10).fill(0);
      }
      return resetScores;
    });
  };

  const finalizeGame = () => {
    setGameScores((prevGameScores) => {
      const updatedGameScores = { ...prevGameScores };
      for (const player of players) {
        const totalScore = scores[player].reduce(
          (sum, frame) => sum + frame,
          0
        );
        updatedGameScores[player] = [
          ...(updatedGameScores[player] || []),
          totalScore,
        ];
      }
      return updatedGameScores;
    });

    // Reset scores for the next game
    resetScores();
  };

  const calculateThreeGameAverage = (player) => {
    const games = gameScores[player] || [];
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
