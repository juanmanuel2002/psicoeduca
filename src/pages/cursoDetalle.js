import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { getCursos } from '../services/cursosService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/cursoDetalle.css";
import CircularProgress from '@mui/material/CircularProgress';

export default function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCursos().then(data => {
      const found = data.find(r => r.id === id);
      setCurso(found);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
      AOS.init({ duration: 1000, once: false });
    }, []);

  if (loading) return <div className="home-container"><Header /><div style={{textAlign:'center', display: 'center',marginTop:64}}><CircularProgress /><p>Cargando...</p></div></div>;
  
  if (!curso) return <div className="home-container"><Header /><div style={{textAlign:'center',marginTop:64}}>Curso no encontrado</div></div>;

  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="curso-detalle-section">
        <div className="curso-detalle-card">
          <img src={curso.imagenFutura || "/baner.png"} alt={curso.nombre} />
          <h2>{curso.nombre}</h2>
          <p>{curso.descripcionLarga}</p>
          {typeof curso.costo === 'number' && (
            <div className="book-cost">
              {curso.costo > 0 ? `$${curso.costo}` : 'Gratis'}
            </div>
          )}
          <button className="btn primary">Adquirir</button>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
