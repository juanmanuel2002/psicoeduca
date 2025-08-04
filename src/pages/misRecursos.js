import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import '../styles/misRecursos.css';
import { getRecursosUsuario } from '../services/recursosService';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MisRecursos() {
  const { user } = useContext(AuthContext);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getRecursosUsuario(user.uid)
      .then(data => setRecursos(data))
      .catch(() => setError('No se pudieron cargar los recursos.'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="home-container">
      <Header />
      <section className="mis-recursos-section">
        <h2>Mis Recursos</h2>

        {loading ? (
          <div className="recursos-loading">Cargando recursos...</div>
        ) : error ? (
          <div className="recursos-error">{error}</div>
        ) : recursos.length === 0 ? (
          <div className="no-courses-message">
            <SentimentDissatisfiedIcon className="no-courses-icon" />
            <h3 className="no-courses-title">¡Ups! ¡Aún no tienes recursos!</h3>
            <p className="no-courses-text">
              Explora nuestra tienda y adquiere materiales exclusivos para potenciar tu aprendizaje.
            </p>
            <button className="btn primary" onClick={() => navigate('/recursos')}>
              Ver Recursos
            </button>
          </div>
        ) : (
          <div className="mis-recursos-grid">
            {recursos.map(recurso => (
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
