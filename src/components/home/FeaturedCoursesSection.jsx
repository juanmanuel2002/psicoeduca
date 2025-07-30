import React from 'react';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useNavigate } from 'react-router-dom';

export default function FeaturedCoursesSection({ tab, setTab, tipoCurso, setTipoCurso, cursosNuevos, cursosRecomendados, filtrarPorTipo }) {
  const navigate = useNavigate();
  return (
    <section data-aos="fade-up" id="cursos" className="featured-courses-section">
      <h2> Cursos Destacados</h2>
      <div style={{display:'flex', justifyContent:'center', gap:25, marginBottom:16}}>
        <button
          className={tab === 'nuevos' ? 'btn primary' : 'btn outline'}
          onClick={() => setTab('nuevos')}
        >Nuevos</button>
        <button
          className={tab === 'recomendados' ? 'btn primary' : 'btn outline'}
          onClick={() => setTab('recomendados')}
        >Recomendados</button>
      </div>
      <div style={{display:'flex', justifyContent:'center', gap:32, marginBottom:40, marginTop: 30}}>
        <label style={{display:'flex', alignItems:'center', gap:4}}>
          <input
            type="radio"
            name="tipoCurso"
            value="sincronos"
            checked={tipoCurso === 'sincronos'}
            onChange={() => setTipoCurso('sincronos')}
          />
          Síncronos
        </label>
        <label style={{display:'flex', alignItems:'center', gap:4}}>
          <input
            type="radio"
            name="tipoCurso"
            value="asincronos"
            checked={tipoCurso === 'asincronos'}
            onChange={() => setTipoCurso('asincronos')}
          />
          Asíncronos
        </label>
      </div>
      <div className="featured-courses-grid">
        {(() => {
          const cursosFiltrados = filtrarPorTipo(tab === 'nuevos' ? cursosNuevos : cursosRecomendados);
          if (cursosFiltrados.length === 0) {
            return (
              <div className="no-courses-message">
                <SentimentDissatisfiedIcon style={{ fontSize: 48, color: 'var(--color-accent)' }} />
                <h3 style={{ fontWeight: '600', fontSize: '1.2rem', margin: 0 }}>¡Ups! No hay cursos disponibles</h3>
                <p style={{ maxWidth: 400, fontSize: '1rem', margin: 0 }}>
                  Por ahora no contamos con cursos de este tipo. Síguenos en nuestras redes sociales para ser el primero en enterarte cuando lancemos nuevos.
                </p>
              </div>
            );
          }
          return cursosFiltrados.map((curso, idx) => (
            <div
              key={curso.id || idx}
              className="featured-course-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/curso/${curso.id}`)}
            >
              <img src={curso.imagenFutura || "/baner.png"} alt={curso.nombre} style={{width: '100%', maxWidth: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12, background:'#f5f5f5'}} />
              <div className="featured-course-title">{curso.nombre}</div>
              <div className="featured-course-desc">{curso.descripcion}</div>
              {typeof curso.costo === 'number' && (
                <div className="book-cost">{curso.costo > 0 ? `$${curso.costo}` : 'Gratis'}</div>
              )}
            </div>
          ));
        })()}
      </div>
    </section>
  );
}
