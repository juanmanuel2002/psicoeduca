import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/misCitas.css';
import { getCitasUsuario } from '../services/citasService';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MisCitas() {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnteriores, setShowAnteriores] = useState(true);
  const [showProximas, setShowProximas] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getCitasUsuario(user.uid)
      .then(data => setCitas(data))
      .catch(() => setError('No se pudieron cargar las citas.'))
      .finally(() => setLoading(false));
  }, [user]);

  const hoy = new Date();
  const citasProximas = citas.filter(c => {
    const fecha = new Date(c.fecha + 'T' + c.hora);
    return fecha >= hoy;
  }).sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));

  const citasAnteriores = citas.filter(c => {
    const fecha = new Date(c.fecha + 'T' + c.hora);
    return fecha < hoy;
  }).sort((a, b) => new Date(b.fecha + 'T' + b.hora) - new Date(a.fecha + 'T' + a.hora));

  return (
    <div className="home-container">
      <Header />
      <section className="mis-citas-section">
        <div className="mis-citas-header">
          <h2>Mis Citas</h2>
          <button className="btn primary" onClick={() => navigate('/crear-cita')}>
            Agendar nueva cita
          </button>
        </div>
        <p className="mis-citas-subtitle">
          ¿Necesitas apoyo? Agenda tu próxima consulta con nuestros especialistas.
        </p>

        {loading ? (
          <div className="citas-loading">Cargando citas...</div>
        ) : error ? (
          <div className="citas-error">{error}</div>
        ) : (
          <div className="citas-columns">

            {/* Citas anteriores */}
            <div className="citas-column">
              <h3
                className="citas-title"
                onClick={() => setShowAnteriores(!showAnteriores)}
              >
                Citas anteriores {showAnteriores ? '▲' : '▼'}
              </h3>
              {showAnteriores && (
                citasAnteriores.length === 0 ? (
                  <div className="citas-vacio">No tienes citas anteriores.</div>
                ) : (
                  citasAnteriores.map(cita => (
                    <div key={cita.id} className="cita-card anterior">
                      <div className="cita-fecha-hora">
                        <span>{cita.fecha}</span> <span>{cita.hora}</span>
                      </div>
                      <p>{cita.descripcion}</p>
                    </div>
                  ))
                )
              )}
            </div>

            {/* Próximas citas */}
            <div className="citas-column">
              <h3
                className="citas-title"
                onClick={() => setShowProximas(!showProximas)}
              >
                Próximas citas {showProximas ? '▲' : '▼'}
              </h3>
              {showProximas && (
                citasProximas.length === 0 ? (
                  <div className="citas-vacio">No tienes próximas citas agendadas.</div>
                ) : (
                  citasProximas.map(cita => (
                    <div key={cita.id} className="cita-card proxima">
                      <div className="cita-fecha-hora">
                        <span>{cita.fecha}</span> <span>{cita.hora}</span>
                      </div>
                      <p>{cita.descripcion}</p>
                    </div>
                  ))
                )
              )}
            </div>

          </div>
        )}
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
