import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { RoundCountModal } from "./round-count-modal.tsx";

const PreGameView = ({
  players,
  editingPlayerId,
  newPlayerName,
  setNewPlayerName,
  handleEditClick,
  handleSaveClick,
  removePlayer,
  openModal,
  handleCloseModal,
  setRoundAmount,
  handleStartGame,
}) => {
  return (
    <div className="players">
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {editingPlayerId === player.id ? (
              <>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                />
                <button onClick={() => handleSaveClick(player.id)}>Save</button>
              </>
            ) : (
              <>
                {player.name}
                <button
                  onClick={() => handleEditClick(player.id, player.name)}
                  className="edit-button"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => removePlayer(player.id)}
                  className="delete-button"
                >
                  X
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {openModal && (
        <RoundCountModal
          closeModal={handleCloseModal}
          onConfirm={setRoundAmount}
        />
      )}

      <button onClick={handleStartGame} className="start-game-button">
        Start Game
      </button>
    </div>
  );
};

export default PreGameView;
