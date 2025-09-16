import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import '../styles/misCursos.css';
import { getCursosUsuario } from '../services/cursosService';
import { download } from '../services/sendEmailService';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../components/ui/InfoModal';
import CircularProgress from '@mui/material/CircularProgress';

export default function MisCursos() {
  const { user } = useContext(AuthContext);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msjError, setMsjError] = useState(false);
  const [descarga, setDescarga] = useState(false);
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

  const descargarPDF = async (cursos) => {
    if (!cursos?.id) return;
    try {
      setDescarga(true);
      const blob = await download("cursos", cursos.id);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${cursos.nombre || "archivo"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDescarga(false)
    } catch (error) {
      setDescarga(false)
      setMsjError(true); 
      setTimeout(() => {
        setMsjError(false);
      }, 4000);
    }
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
                  {recurso.id && (
                    <button className="btn outline mis-recurso-download"
                       onClick={() => {
                        descargarPDF(recurso);
                      }}>
                        Descargar
                    </button> )
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {descarga && (
        <div className="overlay-loading">
          <div className="overlay-content">
            <CircularProgress />
            <p>Descargando...</p>
          </div>
        </div>
      )}

      <InfoModal
        open={msjError}
        title="Hubo un error al descargar el archivo"
        message="Favor de intentarlo mas tarde, en caso de seguir presentando fallas, porfavor contactanos para que podamos ayduarte"
      />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
