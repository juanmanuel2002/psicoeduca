import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/misCitas.css';

export default function MisCitas() {
  return (
    <div className="home-container">
      <Header />
      <section className="mis-citas-section">
        <h2>Mis Citas</h2>
        <p>Aquí verás el historial y próximas citas agendadas.</p>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
