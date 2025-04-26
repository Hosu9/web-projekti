export const calculateTotalScore = (frames) => {
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

export const calculateAverage = (playerScores, totalRounds) => {
  if (!Array.isArray(playerScores) || playerScores.length === 0) return 0;

  const lastNGames = playerScores.slice(-totalRounds);
  const total = lastNGames.reduce((sum, score) => sum + score, 0);
  return (total / lastNGames.length).toFixed(2); // Return the average
};
