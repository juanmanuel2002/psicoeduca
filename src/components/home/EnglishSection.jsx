import React from 'react';

export default function EnglishSection() {
  return (
    <section data-aos="fade-up" id="english" className="english-section">
      <h2>Clases de Inglés (Próximamente)</h2>
      <p>
        Apúntate a nuestra lista de espera para recibir noticias sobre nuestras
        clases de inglés con enfoque conversacional y psicológico.
      </p>
      <input type="email" placeholder="Tu correo electrónico" className="email-input" />
      <button className="btn primary">Unirme a la lista</button>
    </section>
  );
}
