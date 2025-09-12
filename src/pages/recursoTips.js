import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/recursoTips.css';
import StarIcon from '@mui/icons-material/Star';

export default function RecursoTips() {
  return (
    <div className="home-container">
      <Header />
      <section className="recurso-section" data-aos="fade-up">
        <div className="recurso-hero">
          <StarIcon className="recurso-icon" />
          <h2>Tips de aprendizaje</h2>
          <p className="recurso-desc">Descubre los mejores tips y estrategias para aprender inglés de manera efectiva y divertida.</p>
        </div>
        <div className="recurso-content">
          <h3>¿Qué incluye?</h3>
          <ul>
            <li>Consejos prácticos</li>
            <li>Recomendaciones de expertos</li>
            <li>Ejercicios para mejorar tu aprendizaje</li>
          </ul>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
