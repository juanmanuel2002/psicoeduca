import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/perfil.css';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { getCitasUsuario } from '../services/citasService';
import { getCursosUsuario } from '../services/cursosService';
import { getRecursosUsuario } from '../services/recursosService';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiBookOpen, FiDownloadCloud, FiCalendar } from 'react-icons/fi';

export default function Perfil() {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    getCitasUsuario(user.uid).then(setCitas).catch(() => setCitas([]));
    getCursosUsuario(user.uid).then(setCursos).catch(() => setCursos([]));
    getRecursosUsuario(user.uid).then(setRecursos).catch(() => setRecursos([]));
  }, [user]);

  const hoy = new Date();
  const proximaCita = citas
    .filter(c => new Date(c.fecha + 'T' + c.hora) >= hoy)
    .sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora))[0];

  return (
    <div className="home-container">
      <Header />
      <div className="perfil-title-container">
        <h2>Mi Perfil</h2>
      </div>
      <section className="perfil-section">
        <div className="perfil-layout perfil-layout-responsive">
          {/* Panel lateral: información personal */}
          <div className="perfil-info-card">
            <div className="perfil-avatar">
              {user?.nombre ? user.nombre[0].toUpperCase() : <FiUser size={32} />}
            </div>
            <h3>Información Personal</h3>
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
          {/* Panel dashboard */}
          <div className="perfil-dashboard">
            <h3>Resumen</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card dashboard-clickable" onClick={() => navigate('/mis-citas')} tabIndex={0} title="Ver citas">
                <h4><FiCalendar /> Próxima cita</h4>
                {proximaCita ? (
                  <>
                    <p>{proximaCita.fecha} - {proximaCita.hora}</p>
                    <p>{proximaCita.descripcion}</p>
                  </>
                ) : (
                  <p>No hay citas próximas.</p>
                )}
              </div>
              <div className="dashboard-card dashboard-clickable" onClick={() => navigate('/mis-cursos')} tabIndex={0} title="Ver cursos">
                <h4><FiBookOpen /> Cursos inscritos</h4>
                <p>{cursos.length}</p>
              </div>
              <div className="dashboard-card dashboard-clickable" onClick={() => navigate('/mis-recursos')} tabIndex={0} title="Ver recursos">
                <h4><FiDownloadCloud /> Recursos descargados</h4>
                <p>{recursos.length}</p>
              </div>
              <div className="dashboard-card dashboard-clickable" onClick={() => navigate('/mis-citas')}>
                <h4><FiCalendar /> Citas anteriores</h4>
                <p>{citas.filter(c => new Date(c.fecha + 'T' + c.hora) < hoy).length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
