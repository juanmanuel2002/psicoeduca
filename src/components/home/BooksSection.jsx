import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/booksSection.css'; 

export default function BooksSection({ recursos }) {
  const navigate = useNavigate();
  return (
    <section data-aos="fade-up" id="books" className="books-section">
      <h2>Recursos Psicológicos Disponibles</h2>
      <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
        Amplía tus conocimientos con nuestra colección de recursos educativos de alta calidad
      </div>
      <div style={{ display: "flex", justifyContent: "center"}}>
        <div className="books-grid">
          {recursos.slice(0, 3).map((recurso, idx) => (
            <div
              key={recurso.id || idx}
              className="book-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/recurso/${recurso.id}`)}
            >
              <div key={recurso.id || idx} className="book-card">
                <img src={recurso.imagenFutura || "/baner.png"} alt={recurso.nombre} className="book-img" />
                <h3>{recurso.nombre}</h3>
                <p>{recurso.descripcion}</p>
                {typeof recurso.costo === 'number' && (
                  <div className="book-cost">{recurso.costo > 0 ? `$${recurso.costo}` : 'Gratis'}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button className="btn outline" onClick={() => navigate('/recursos')}>
          Ver Más
        </button>
      </div>
    </section>
  );
}
