import React, { useEffect } from 'react';
import '../styles/clasesGrupo.css';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import AOS from 'aos';

export default function ClasesGrupo() {

    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
      }, []);
  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="clases-section">
        <h2>Clases Grupales de Inglés</h2>
        <p className="clases-desc">Aprende inglés en un ambiente colaborativo, divertido y motivador. Nuestra metodología está diseñada para que pierdas el miedo a hablar y avances junto a otros.</p>
        <div className="clases-metodologia">
          <h3>Metodología</h3>
          <ul>
            <li>Sesiones semanales en grupo reducido (6-10 personas).</li>
            <li>Enfoque conversacional y práctico.</li>
            <li>Actividades dinámicas y juegos de roles.</li>
            <li>Material digital y acceso a recursos exclusivos.</li>
          </ul>
        </div>
        <div className="clases-ruta">
          <h3>Ruta de Aprendizaje</h3>
          <ol>
            <li>Diagnóstico de nivel inicial.</li>
            <li>Clases temáticas semanales.</li>
            <li>Evaluaciones periódicas y feedback personalizado.</li>
            <li>Certificado al finalizar el curso.</li>
          </ol>
        </div>
        <div className="clases-seguimiento">
          <h3>Seguimiento</h3>
          <p>Recibe retroalimentación constante y seguimiento de tu progreso por parte de nuestros profesores y psicólogos educativos.</p>
        </div>
        <div className="clases-costo">
          <h3>Costo</h3>
          <p><b>$800 MXN</b> al mes (incluye materiales y acceso a recursos digitales).</p>
        </div>
        <button className="clases-btn">Regístrate</button>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
