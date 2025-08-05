import React from "react";
import ReactDOM from "react-dom";
import "../../styles/infoModal.css";

export default function InfoModal({ open, title, message, children }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2>{title}</h2>}
        {message && <p className="modal-message">{message}</p>}
        {children}
      </div>
    </div>,
    document.body
  );
}
