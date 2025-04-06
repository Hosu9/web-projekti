import React from "react";
import { ScoreProvider } from "../../context/score-context";
import PlayerForm from "./components/player-form";
import Scoreboard from "./components/scoreboard";

export const ScoreKeeper = () => {
  return (
    <ScoreProvider>
      <div className="container">
        <h1>Bowling Score Keeper</h1>
        <PlayerForm />
        <Scoreboard />
      </div>
    </ScoreProvider>
  );
};
