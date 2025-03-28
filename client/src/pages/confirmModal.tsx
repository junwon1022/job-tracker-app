import React from "react";
import "../styles/modal.css";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-button confirm">OK</button>
          <button onClick={onCancel} className="modal-button cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
