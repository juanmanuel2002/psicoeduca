import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/perfil.css';

export default function Perfil() {
  return (
    <div className="home-container">
      <Header />
      <section className="perfil-section">
        <h2>Mi Perfil</h2>
        <p>Aquí podrás ver y editar tu información personal.</p>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
