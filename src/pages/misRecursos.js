import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/misRecursos.css';

export default function MisRecursos() {
  return (
    <div className="home-container">
      <Header />
      <section className="mis-recursos-section">
        <h2>Mis Recursos</h2>
        <p>Aquí verás los recursos que has adquirido o descargado.</p>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
