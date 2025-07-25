import React, {useEffect, useState } from "react";
import "../styles/home.css";
import Header from "../components/header";
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { getRecursos } from '../services/recursosService';


export default function Recursos() {
  const [recursos, setRecursos] = useState([]);
  useEffect(() => {
      getRecursos().then(data => setRecursos(data));
    }, []);
  return (
    <div className="home-container">
      <Header />
      <section className="books-section" style={{marginTop: 48}}>
        <h2>Recursos Disponibles</h2>
        <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
          Explora nuestra colección completa de recursos educativos y libros.
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="books-grid">
            {recursos.map((recurso, idx) => (
              <div key={recurso.id || idx} className="book-card">
                <img src={recurso.imagenFutura || "/baner.png"} alt={recurso.nombre} className="book-img" />
                <h3>{recurso.nombre}</h3>
                <p>{recurso.descripcion}</p>
                {typeof recurso.costo === 'number' && recurso.costo > 0 && (
                  <div className="book-cost">${recurso.costo}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
