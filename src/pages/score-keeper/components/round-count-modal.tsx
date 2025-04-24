import React from "react";

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
          <button className="close-button" onClick={() => closeModal(false)}>
            <span className="close-icon">✖</span>
          </button>
        </div>

        <div className="modal-content">
          <p>
            Select the number of rounds you want <br /> to play
          </p>

          <div className="modal-buttons">
            <div className="round-count-buttons">
              <button onClick={() => onConfirm(1)}>1 </button>
              <button onClick={() => onConfirm(3)}>3 </button>
              <button onClick={() => onConfirm(5)}>5 </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
