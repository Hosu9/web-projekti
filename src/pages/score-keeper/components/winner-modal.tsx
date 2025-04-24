import React from "react";
import { Button } from "../../../components/button";

interface Props {
  closeModal: (value: boolean) => void;
  winner: { name: string; average: number };
}

export const WinnerModal = ({ closeModal, winner }: Props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container winner-modal">
        <div className="modal-header">
          <h2>Congrats {winner.name}!</h2>
          <Button
            onClick={() => closeModal(false)}
            value="✖"
            className="close-button"
          />
        </div>

        <div className="modal-content winner-content">
          <p className="winner-text">
            Player {winner.name} won the match <br /> with an average score of{" "}
            {winner.average}!
          </p>
        </div>

        <div className="return-button">
          <Button onClick={() => closeModal(false)} value="Return" />
        </div>
      </div>
    </div>
  );
};
