import React from "react";
import { ScoreProvider } from "./context/Scorecontext.js";
import PlayerForm from "./components/PlayerForm.js";
import Scoreboard from "./components/Scoreboard";
import BowlingRules from "./components/BowlingRules.js";

const App = () => {
  return (
    <ScoreProvider>
      <div className="container">
        <BowlingRules/>
        <h1>Bowling Score Keeper</h1>
        <PlayerForm />
        <Scoreboard />
      </div>
    </ScoreProvider>
  );
};

export default App;
