import React, { useEffect } from 'react';
import '../styles/clasesIndividual.css';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import AOS from 'aos';

export default function ClasesIndividual() {

    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
      }, []);
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
        <button className="clases-btn">Regístrate</button>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
