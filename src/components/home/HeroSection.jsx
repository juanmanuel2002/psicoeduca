import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/authContext/AuthContext';
import InfoModal from '../ui/InfoModal';
import { useNavigate } from 'react-router-dom';
import './style/heroSection.css';

export default function HeroSection() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <section data-aos="fade-up" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-subtitle">✨ Tu bienestar es nuestra prioridad.</span>
          <h1>Bienestar emocional y aprendizaje a tu alcance</h1>
          <p>
            Servicios psicológicos, manuales, libros educativos y clases de inglés
            diseñadas para tu desarrollo integral.
          </p>
          <div className="hero-buttons">
            <button className="btn primary" onClick={() => {
              if (user) {
                navigate('/crear-cita');
              } else {
                setShowModal(true);
                setTimeout(() => {
                  navigate('/login', { state: { redirectTo: '/crear-cita' } });
                }, 2500);
              }
            }}>Agendar Consulta</button>
            <button className="btn outline" onClick={() => (navigate('/recursos'))}>Ver Materiales </button>
          </div>
          <InfoModal
            open={showModal}
            title="Debes iniciar sesión para poder agendar una cita."
            message="Redirigiendo..."
          />
        </div>
        <div className="hero-image">
          <img src="/baner.png" alt="Banner Psicología y Educación" />
          <div className="hero-overlay">4.9/5 ⭐ <br />+200 clientes</div>
        </div>
      </div>
    </section>
  );
}
