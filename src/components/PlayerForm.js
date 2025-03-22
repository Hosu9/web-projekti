import React, { useState } from "react";
import { useScore } from "../context/Scorecontext.js";
import { Button, Input } from "../ui/button"; // Ensure this path matches the new file location

const PlayerForm = () => {
  const { addPlayer, resetScores } = useScore();
  const [name, setName] = useState("");

  return (
    <div>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player Name" />
      <Button onClick={() => { addPlayer(name); setName(""); }}>Add Player</Button>
      <Button onClick={() => resetScores()}>Reset Scores</Button>
    </div>
  );
};

export default PlayerForm;
