import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/misCursos.css';

export default function MisCursos() {
  return (
    <div className="home-container">
      <Header />
      <section className="mis-cursos-section">
        <h2>Mis Cursos</h2>
        <p>Aquí verás los cursos que has adquirido o en los que estás inscrito.</p>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
