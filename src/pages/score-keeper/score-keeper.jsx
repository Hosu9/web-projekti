import React from "react";
import { ScoreProvider } from "../../context/score-context";
import PlayerForm from "./components/player-form";
import Scoreboard from "./components/scoreboard";
import { Layout } from "../../components/layout";

export const ScoreKeeper = () => {
  return (
    <Layout>
      <ScoreProvider>
        <div className="content">
          <h1>Bowling Score Keeper</h1>
          <PlayerForm />
          <Scoreboard />
        </div>
      </ScoreProvider>
    </Layout>
  );
};
