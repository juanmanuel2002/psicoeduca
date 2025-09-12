import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/recursoVideos.css';
import SchoolIcon from '@mui/icons-material/School';

export default function RecursoVideos() {
  return (
    <div className="home-container">
      <Header />
      <section className="recurso-section" data-aos="fade-up">
        <div className="recurso-hero">
          <SchoolIcon className="recurso-icon" />
          <h2>Videos interactivos</h2>
          <p className="recurso-desc">Accede a videos interactivos para practicar tu inglés de forma divertida y efectiva. ¡Aprende a tu ritmo!</p>
        </div>
        <div className="recurso-content">
          <h3>¿Qué incluye?</h3>
          <ul>
            <li>Videos por temas y niveles</li>
            <li>Ejercicios interactivos</li>
            <li>Acceso desde cualquier dispositivo</li>
          </ul>
          <button className="btn primary" onClick={() => window.open('https://youtube.com/', '_blank')}>Ver videos</button>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
