import React, { useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  calculateTotalScore,
  calculateAverage,
} from "../utils/score-utils.jsx";

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameScores, setGameScores] = useState({}); // Store scores for multiple games
  const [completedRounds, setCompletedRounds] = useState({});
  const [round, setRounds] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(3); // default to 3 rounds

  // adding new players to the game with unique id
  const addPlayer = (name) => {
    if (players.length >= 4) {
      alert("You can only add up to 4 players.");
      return;
    }
    const newPlayer = { id: uuidv4(), name };
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setScores((prevScores) => ({
      ...prevScores,
      [newPlayer.id]: Array(10)
        .fill(null)
        .map(() => []), // each frame as an empty array
    }));
  };

  const editPlayerName = (playerId, newName) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, name: newName } : player
      )
    );
  };

  const removePlayer = (playerId) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== playerId)
    );
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      delete updatedScores[playerId];
      return updatedScores;
    });
  };

  const startGame = (rounds) => {
    if (players.length < 2) {
      alert("Please add atleast 2 players to start the game.");
      return;
    }
    setTotalRounds(rounds);
    setGameStarted(true);
  };

  // adding the rolls to the frames
  const addFrameScore = (playerId, frameIndex, score) => {
    setScores((prevScores) => {
      const updatedFrames = [...prevScores[playerId]];
      const frame = updatedFrames[frameIndex] || [];

      // add the rolls to the frame
      updatedFrames[frameIndex] = [...frame, score];

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
    // reset the completed rounds for each player so that the frames can be filled again
    setCompletedRounds((prevCompletedRounds) => {
      const resetCompletedRounds = {};
      Object.keys(prevCompletedRounds).forEach((playerId) => {
        resetCompletedRounds[playerId] = Array(10).fill(false);
      });
      return resetCompletedRounds;
    });
  };

  const finalizeGame = () => {
    setGameScores((prevGameScores) => {
      const updatedGameScores = { ...prevGameScores };
      for (const player of players) {
        const totalScore = calculateTotalScore(scores[player.id]);

        updatedGameScores[player.id] = [
          ...(updatedGameScores[player.id] || []),
          totalScore,
        ];
      }
      return updatedGameScores;
    });

    resetScores();
    setCompletedRounds({});
    setRounds((prevRounds) => prevRounds + 1);
  };

  const declareWinner = () => {
    const averages = players.map((player) => {
      const scores = gameScores[player.id] || [];
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      const average = scores.length > 0 ? totalScore / scores.length : 0;

      return {
        id: player.id,
        name: player.name,
        average: parseFloat(average.toFixed(2)),
      };
    });

    const winner = averages.reduce((max, player) =>
      player.average > max.average ? player : max
    );

    return winner;
  };

  // reset the score keeper game
  const resetGame = () => {
    setPlayers([]);
    setScores({});
    setCompletedRounds({});
    setGameScores({});
    setRounds(1);
    setGameStarted(false);
  };

  return (
    <ScoreContext.Provider
      value={{
        players,
        addPlayer,
        editPlayerName,
        removePlayer,
        scores,
        completedRounds,
        setCompletedRounds,
        addFrameScore,
        resetScores, // Add resetScores to the context
        finalizeGame,
        calculateAverage,
        calculateTotalScore,
        round,
        totalRounds,
        gameStarted,
        setGameStarted,
        startGame,
        declareWinner,
        resetGame,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
