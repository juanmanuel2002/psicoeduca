import React, { useState } from 'react';
import './style/comunidadSection.css';

function StarCircle({ calificacion }) {
  return (
    <div className="star-circle">
      <span className="star-value">{calificacion}</span>
      <span className="star-icon">★</span>
    </div>
  );
}

export default function ComunidadSection({ testimonios }) {
  const [expanded, setExpanded] = useState({});
  const handleExpand = idx => setExpanded(e => ({ ...e, [idx]: !e[idx] }));

  return (
    <section data-aos="fade-up" id="comunidad" className="comunidad-section">
      <h2>Comunidad Psicoeduca</h2>
      <p>Estos son algunos testimonios de personas que han tomado nuestros cursos o servicios.</p>
      <div className="comunidad-grid">
        {testimonios.map((testimonio, idx) => (
          <div key={testimonio.nombre + idx} className="comunidad-card">
            <StarCircle calificacion={testimonio.calificacion || 5} />

            <div className="comunidad-nombre">{testimonio.nombre}</div>
            <div className="comunidad-servicio">{testimonio.servicio}</div>
            <div className="comunidad-comentario">
              “{expanded[idx]
                ? testimonio.comentario
                : testimonio.comentario.length > 65
                  ? testimonio.comentario.slice(0, 65).trim() + '...'
                  : testimonio.comentario}”
              {testimonio.comentario.length > 65 && (
                <span
                  className="comunidad-expand"
                  onClick={() => handleExpand(idx)}
                  title={expanded[idx] ? 'Ver menos' : 'Ver más'}
                >
                  {expanded[idx] ? ' Ver menos' : ' Ver más'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
