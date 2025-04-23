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
  };

  const calculateTotalScore = (frames) => {
    let totalScore = 0;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i] || [];
      const nextFrame = frames[i + 1] || [];
      const frameAfterNext = frames[i + 2] || [];

      // handling the tenth frame
      if (i === 9) {
        totalScore += frame[0] || 0; // first roll
        totalScore += frame[1] || 0; // second roll

        // third roll is only added if the first roll is a strike or the first and second roll are a spare
        if (frame[0] === 10 || frame[0] + frame[1] === 10) {
          totalScore += frame[2] || 0; // Third roll
        }

        // if frame 9 is a strike, add the second roll of frame 10 to it
        if (frames[8]?.[0] === 10 && frame.length >= 2) {
          totalScore += frame[1] || 0;
        }
        break;
      }

      // strike logic
      if (frame[0] === 10) {
        totalScore += 10;

        // add the next two rolls
        if (nextFrame[0] === 10) {
          totalScore += 10 + (frameAfterNext[0] || 0);
        } else {
          totalScore += (nextFrame[0] || 0) + (nextFrame[1] || 0);
        }
      }
      // spare logic
      else if (frame[0] + (frame[1] || 0) === 10) {
        totalScore += 10;

        // add the first roll of the next frame
        totalScore += nextFrame[0] || 0;
      }
      // open frame logic
      else {
        totalScore += (frame[0] || 0) + (frame[1] || 0);
      }
    }

    return totalScore;
  };

  const calculateThreeGameAverage = (playerId) => {
    const playerScores = gameScores[playerId] || [];
    if (playerScores.length === 0) return 0;

    const lastThreeGames = playerScores.slice(-3); // Get the last three games
    const total = lastThreeGames.reduce((sum, score) => sum + score, 0);
    return (total / lastThreeGames.length).toFixed(2); // Return the average
  };

  const finalizeGame = () => {
    setGameScores((prevGameScores) => {
      const updatedGameScores = { ...prevGameScores };
      for (const player of players) {
        // calculate the total score for the player
        const totalScore = calculateTotalScore(scores[player.id]);

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
        calculateTotalScore,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
