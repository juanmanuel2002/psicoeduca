import React, { useEffect, useContext, useState} from 'react';
import '../styles/clasesIndividual.css';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import AOS from 'aos';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import InfoModal from '../components/ui/InfoModal';
import { inscripcionClase } from '../services/sendEmailService';
import CircularProgress from '@mui/material/CircularProgress';

export default function ClasesIndividual() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalInicioSesion, setModalInicioSesion] = useState(false);

  useEffect(() => {
      AOS.init({ duration: 1000, once: false });
    }, []);

  useEffect(() => {
      let timer;
      if (modalOpen) {
        timer = setTimeout(() => {
          setModalOpen(false);
        }, 3000);
      }
      return () => clearTimeout(timer);
    }, [modalOpen]);
  
  const openModal = (msg) => {
    setModalMsg(msg);
    setModalOpen(true);
  };

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      if (params.get('inscribir') === 'individual' && user) {
        handleInscripcion();
      }
      // eslint-disable-next-line
    }, [user]);
  
  const handleInscripcion = async () => {
    setLoading(true);
    try {
      let result = await inscripcionClase({ tipo: 'individual', nombre: user?.name || user?.nombre, correo: user?.email });
      if (result.message === 'Ya estás inscrito a esta clase.'){
        openModal('Ya tienes un registro a esta clase');
      }else{
        openModal('¡Registro exitoso! Pronto nos pondremos en contacto contigo.');
      }
    } catch (e) {
      openModal('Ocurrió un error al registrar. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const handleRegistro = async () => {
    if (!user) {
      setModalInicioSesion(true);
      setTimeout(() => {
        navigate('/login', { state: { redirectTo: '/english/clases-individual?inscribir=individual' } });
      }, 2500);
    } else {
      handleInscripcion();
    }
  };

  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="clases-section">
        <h2>Clases Individuales de Inglés</h2>
        <p className="clases-desc">Aprende inglés a tu propio ritmo con atención personalizada. Nuestra metodología se adapta a tus necesidades y objetivos específicos.</p>
        <div className="clases-metodologia">
          <h3>Metodología</h3>
          <ul>
            <li>Sesiones uno a uno con profesor certificado.</li>
            <li>Plan de estudio personalizado.</li>
            <li>Enfoque conversacional y práctico.</li>
            <li>Material digital y acceso a recursos exclusivos.</li>
          </ul>
        </div>
        <div className="clases-seguimiento">
          <h3>Seguimiento</h3>
          <p>Recibe retroalimentación constante y seguimiento de tu progreso, con ajustes al plan según tus avances.</p>
        </div>
        <div className="clases-costo">
          <h3>Costo</h3>
          <p><b>$350 MXN</b> por clase individual (incluye materiales y acceso a recursos digitales).</p>
        </div>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <CircularProgress />
          </div>
        )}
        <button
          className="clases-btn"
          onClick={handleRegistro}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Regístrate'}
        </button>
      </section>
      <InfoModal open={modalOpen} title="Registro" message={modalMsg} />
      <InfoModal
        open={modalInicioSesion}
        title="Debes iniciar sesión para poder registrarte a esta clase"
        message="Redirigiendo..."
      />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
