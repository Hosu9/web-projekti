import React, { useState } from "react";
import { useScore } from "../../../context/score-context.jsx";
import { Button } from "../../../components/button.jsx";
import { Input } from "../../../components/input.jsx";

const PlayerForm = () => {
  const { addPlayer } = useScore();
  const [name, setName] = useState("");

  return (
    <div className="player-form">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player Name"
      />
      <Button
        onClick={() => {
          if (name.trim()) {
            addPlayer(name.trim());
            setName("");
          }
        }}
        value="Add Player"
      />
    </div>
  );
};

export default PlayerForm;
