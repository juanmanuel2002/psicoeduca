import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/recursoForos.css';
import GroupIcon from '@mui/icons-material/Group';

export default function RecursoForos() {
  return (
    <div className="home-container">
      <Header />
      <section className="recurso-section" data-aos="fade-up">
        <div className="recurso-hero">
          <GroupIcon className="recurso-icon" />
          <h2>Foros de conversación</h2>
          <p className="recurso-desc">Participa en foros de conversación para practicar inglés con otros estudiantes y profesores. ¡Comparte y aprende!</p>
        </div>
        <div className="recurso-content">
          <h3>¿Qué incluye?</h3>
          <ul>
            <li>Foros temáticos</li>
            <li>Moderación de profesores</li>
            <li>Actividades grupales</li>
          </ul>
          <button className="btn primary" onClick={() => window.open('https://discord.com/', '_blank')}>Unirse al foro</button>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
