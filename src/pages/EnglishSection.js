import React, { useState } from 'react';
import '../styles/englishSection.css';
import { sendEmailSolicitud } from '../services/sendEmailService';
import InfoModal from '../components/ui/InfoModal';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';

export default function EnglishSection() {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalError, setShowModalError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await sendEmailSolicitud({ correo, nombre });
      setShowModal(true);
      setCorreo('');
      setNombre('');
      setTimeout(() => {
        setShowModal(false);
      }, 4000);
    } catch (err) {
      setShowModalError(true);
      setTimeout(() => {
        setShowModalError(false);
      }, 2500);
    }
    setEnviando(false);
  };

  return (
    <div className = "home-container">
      <Header />
      <section data-aos="fade-up" id="english" className="english-section">
        <h2>Clases de Inglés (Próximamente)</h2>
        <p>
          Apúntate a nuestra lista de espera para recibir noticias sobre nuestras
          clases de inglés con enfoque conversacional y psicológico.
        </p>
        <form onSubmit={handleSubmit} className="email-form">
          <input
            type="text"
            placeholder="Tu nombre"
            className="email-input"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="email-input"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
          />
          <button className="btn primary" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Unirme a la lista'}
          </button>
        </form>
      </section>
      <InfoModal open={showModal} title="¡Solicitud enviada correctamente!" message="Esta al tanto de tu correo, ¡Pronto te contactaremos!" />
      <InfoModal open={showModalError} title="¡Error al enviar la solicitud! Intenta de nuevo" message="" />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
