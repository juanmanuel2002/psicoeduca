import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import '../styles/misCursos.css';
import { getCursosUsuario } from '../services/cursosService';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MisCursos() {
  const { user } = useContext(AuthContext);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getCursosUsuario(user.uid)
      .then(data => setCursos(data))
      .catch(() => setError('No se pudieron cargar los cursos.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleVerCursos = () => {
    navigate('/cursos');
    setTimeout(() => {
      const section = document.getElementById('cursos');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };


  return (
    <div className="home-container">
      <Header />
      <section className="mis-cursos-section">
        <h2>Mis Cursos</h2>
        {loading ? (
          <div className="cursos-loading">Cargando cursos...</div>
        ) : error ? (
          <div className="cursos-error">{error}</div>
        ) : cursos.length === 0 ? (
          <div className="no-courses-message">
            <SentimentDissatisfiedIcon className="no-courses-icon" />
            <h3 className="no-courses-title">¡Ups! ¡Aún no tienes cursos!</h3>
            <p className="no-courses-text">
              Explora nuestra tienda y adquiere materiales exclusivos para potenciar tu aprendizaje.
            </p>
            <button className="btn primary" onClick={handleVerCursos}>
              Ver cursos
            </button>
          </div>
        ) : (
          <div className="mis-cursos-grid">
            {cursos.map(recurso => (
              <div key={recurso.id} className="mis-recurso-card">
                <img
                  src={recurso.imagenFutura || '/baner.png'}
                  alt={recurso.nombre}
                  className="mis-recurso-img"
                />
                <div className="mis-recurso-info">
                  <h3 className="mis-recurso-title">{recurso.nombre}</h3>
                  <div className="mis-recurso-short">{recurso.descripcion}</div>
                  <div className="mis-recurso-long">{recurso.descripcionLarga}</div>
                  {recurso.archivoDriveId && (
                    <a
                      href={`https://drive.google.com/uc?export=download&id=${recurso.archivoDriveId}`}
                      className="btn outline mis-recurso-download"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
