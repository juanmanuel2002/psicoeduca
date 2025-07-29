import React, {useEffect, useState } from "react";
import "../styles/home.css";
import Header from "../components/header";
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { getRecursos } from '../services/recursosService';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function Recursos() {
  const [recursos, setRecursos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
      getRecursos().then(data => setRecursos(data));
    }, []);

    useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  
  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="books-section" style={{marginTop: 48}}>
        <h2>Recursos Disponibles</h2>
        <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
          Explora nuestra colección completa de recursos educativos y libros.
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="books-grid">
            {recursos.map((recurso, idx) => (
              <div
                key={recurso.id || idx}
                className="book-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/recurso/${recurso.id}`)}
              >
                <img src={recurso.imagenFutura || "/baner.png"} alt={recurso.nombre} className="book-img" />
                <h3>{recurso.nombre}</h3>
                <p>{recurso.descripcion}</p>
                {typeof recurso.costo === 'number' &&  (
                  <div className="book-cost">{recurso.costo > 0 ? `$${recurso.costo}` : 'Gratis'}</div>
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
