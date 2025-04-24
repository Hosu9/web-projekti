import React, { useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

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
  };

  const finalizeGame = (callback) => {
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

    // reset the scores and compeleted rounds
    resetScores();
    setCompletedRounds({});
    setRounds((prevRounds) => prevRounds + 1);

    if (callback) {
      setTimeout(callback, 500); // delay to make sure updates are applied
    }
  };

  const declareWinner = () => {
    const averages = players.map((player) => {
      const average = calculateAverage(player.id);
      return { name: player.name, average: parseFloat(average) };
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

  const calculateAverage = (playerId) => {
    const playerScores = gameScores[playerId] || [];
    if (playerScores.length === 0) return 0;

    const lastNGames = playerScores.slice(-totalRounds);
    const total = lastNGames.reduce((sum, score) => sum + score, 0);
    return (total / lastNGames.length).toFixed(2); // Return the average
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
