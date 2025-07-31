import React from 'react';
import './style/modalImagen.css';

export default function ModalImagen({ imagenActiva, cerrarModal }) {
  if (!imagenActiva) return null;
  return (
    <div className="modal-overlay" onClick={cerrarModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img src={imagenActiva} alt="Imagen ampliada" />
      </div>
    </div>
  );
}
