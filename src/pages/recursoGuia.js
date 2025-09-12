import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/recursoGuia.css';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function RecursoGuia() {
  return (
    <div className="home-container">
      <Header />
      <section className="recurso-section" data-aos="fade-up">
        <div className="recurso-hero">
          <MenuBookIcon className="recurso-icon" />
          <h2>Guías PDF</h2>
          <p className="recurso-desc">Descarga guías en PDF para reforzar tu aprendizaje de inglés. Material actualizado y práctico para cada nivel.</p>
        </div>
        <div className="recurso-content">
          <h3>¿Qué incluye?</h3>
          <ul>
            <li>Guías temáticas por nivel</li>
            <li>Ejercicios prácticos</li>
            <li>Material descargable</li>
          </ul>
          <button className="btn primary" onClick={() => window.open('https://drive.google.com/', '_blank')}>Descargar guías</button>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
