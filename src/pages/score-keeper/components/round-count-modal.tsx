import React from "react";
import { Button } from "../../../components/button";

interface Props {
  closeModal: (value: boolean) => void;
  onConfirm: (rounds: number) => void;
}

export const RoundCountModal = ({ closeModal, onConfirm }: Props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Select the number of rounds</h2>
          <Button
            onClick={() => closeModal(false)}
            value="✖"
            className="close-button"
          />
        </div>

        <div className="modal-content">
          <p>
            Select the number of rounds you want <br /> to play
          </p>

          <div className="modal-buttons">
            <div className="round-count-buttons">
              <Button onClick={() => onConfirm(3)} value="3" />
              <Button onClick={() => onConfirm(5)} value="5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
