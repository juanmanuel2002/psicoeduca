import React from 'react';

export default function ComunidadSection({ testimonios, comunidadRef, setImagenActiva, truncate }) {
  return (
    <section data-aos="fade-up" id="comunidad" className="comunidad-section">
      <h2>Comunidad Psicoeduca</h2>
      <p>Estos son algunos testimonios de personas que han tomado nuestros cursos o servicios.</p>
      <div className="comunidad-carousel" ref={comunidadRef}>
        <div className="comunidad-track">
          {[...testimonios, ...testimonios].map((testimonio, idx) => (
            <div key={testimonio.nombre + idx} className="comunidad-item">
              <img
                src={`/${testimonio.img}`}
                alt={testimonio.nombre}
                onClick={() => setImagenActiva(`/${testimonio.img}`)}
                style={{ cursor: 'pointer' }}
              />
              <div className="comunidad-nombre">{testimonio.nombre}</div>
              <div className="comunidad-servicio">{testimonio.servicio}</div>
              <div className="comunidad-comentario"> “{truncate(testimonio.comentario, 55)}”</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
