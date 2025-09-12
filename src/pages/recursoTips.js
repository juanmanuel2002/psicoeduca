import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/recursoTips.css';
import StarIcon from '@mui/icons-material/Star';
import BookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function RecursoTips() {
  return (
    <div className="home-container">
      <Header />
      <section className="recurso-section" data-aos="fade-up">
        {/* Hero */}
        <div className="recurso-hero">
          <StarIcon className="recurso-icon" />
          <h2>Tips de aprendizaje</h2>
          <p className="recurso-desc">
            Aprende inglés de manera más sencilla y divertida con estas recomendaciones.  
            La clave está en la constancia y en aplicar pequeños hábitos cada día.
          </p>
        </div>

        {/* Tarjetas principales */}
        <div className="tips-grid">
          <div className="tip-card">
            <BookIcon className="tip-icon" />
            <h4>Lee en inglés</h4>
            <p>Empieza con artículos cortos, cuentos o cómics. Refuerza vocabulario y gramática.</p>
          </div>

          <div className="tip-card">
            <HeadphonesIcon className="tip-icon" />
            <h4>Escucha todos los días</h4>
            <p>Podcast, música o películas en inglés. Entrena tu oído y mejora tu pronunciación.</p>
          </div>

          <div className="tip-card">
            <AccessTimeIcon className="tip-icon" />
            <h4>Constancia breve</h4>
            <p>Con solo 15 minutos diarios comenzaras a ver resultados muy pronto.</p>
          </div>

          <div className="tip-card">
            <EditNoteIcon className="tip-icon" />
            <h4>Escribe en inglés</h4>
            <p>Lleva un mini diario o escribe tus planes del día en inglés.</p>
          </div>
        </div>

        {/* Tips rápidos */}
        <div className="quick-tips">
          <h3>Tips rápidos</h3>
          <ul>
            <li><CheckCircleIcon className="quick-icon" /> Cambia el idioma de tu celular a inglés.</li>
            <li><CheckCircleIcon className="quick-icon" /> Aprende 5 palabras nuevas al día.</li>
            <li><CheckCircleIcon className="quick-icon" /> Piensa en inglés al describir tu rutina.</li>
            <li><CheckCircleIcon className="quick-icon" /> Escucha canciones y traduce su letra.</li>
            <li><CheckCircleIcon className="quick-icon" /> Mira películas con subtítulos en inglés.</li>
            <li><CheckCircleIcon className="quick-icon" /> Practica con un compañero de estudio.</li>
          </ul>
        </div>

        {/* Motivación */}
        <div className="motivacion-box">
          <p>
            💡 <strong>Recuerda:</strong> No necesitas perfección, necesitas práctica constante.  
            Cada día que dedicas unos minutos, estás más cerca de tu meta.
          </p>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
