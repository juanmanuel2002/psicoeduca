import React from 'react';
import '../styles/aprendiz.css';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export default function Aprendiz() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Header />
      <section className="aprendiz-section" data-aos="fade-up">
        <div className="aprendiz-hero">
          <img src="/baner.png" alt="Aprendiz" className="aprendiz-hero-img" />
          <div className="aprendiz-hero-text">
            <h2>Conviértete en aprendiz</h2>
            <h3>¡4 clases gratis y beneficios exclusivos!</h3>
            <p className="aprendiz-desc">Inscríbete al programa y accede a clases, descuentos y materiales personalizados para tu aprendizaje de inglés.</p>
            <button className="btn primary aprendiz-btn" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfEupmJUzqXON6bQ4Kn8ibqSfs5P4gs6lnVsei8_NmSQr6Nhw/viewform', '_blank')}>
              Conviértete en aprendiz - 4 clases gratis
            </button>
            <span className="aprendiz-restriccion">*Consulta restricciones</span>
          </div>
        </div>
        <div className="aprendiz-beneficios">
          <div className="beneficio-card">
            <SchoolIcon className="beneficio-icon" />
            <div className="beneficio-title">4 clases gratuitas de 1 hora</div>
          </div>
          <div className="beneficio-card">
            <StarIcon className="beneficio-icon" />
            <div className="beneficio-title">Descuento adicional en tu primer mes*</div>
          </div>
          <div className="beneficio-card">
            <CheckCircleIcon className="beneficio-icon" />
            <div className="beneficio-title">Constancia digital al finalizar el nivel</div>
          </div>
          <div className="beneficio-card">
            <SchoolIcon className="beneficio-icon" />
            <div className="beneficio-title">Material de apoyo y clases personalizadas</div>
          </div>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
