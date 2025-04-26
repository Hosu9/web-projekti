import React from "react";
import { ScoreProvider, useScore } from "../../context/score-context";
import PlayerForm from "./components/player-form";
import Scoreboard from "./components/scoreboard";
import { Layout } from "../../components/layout";

export const ScoreKeeper = () => {
  return (
    <ScoreProvider>
      <Layout>
        <div className="score-keeper-content">
          <h1>Bowling Score Keeper</h1>
          <ScoreKeeperContent />
        </div>
      </Layout>
    </ScoreProvider>
  );
};

// if tracking has not started, show the player form. otherwise, show the scoreboard
const ScoreKeeperContent = () => {
  const { gameStarted } = useScore();

  return (
    <>
      {!gameStarted && <PlayerForm />} <Scoreboard />
    </>
  );
};
