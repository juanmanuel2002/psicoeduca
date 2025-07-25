import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { getRecursos } from '../services/recursosService';
import { getCursos } from '../services/cursosService';
import { useNavigate } from 'react-router-dom';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import Header from "../components/header";
import Footer from '../components/footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/home.css";

const services = [
  {
    title: "Terapia Individual",
    description: "Atención personalizada para adultos en búsqueda de bienestar emocional.",
    icon: (
      <svg
        className="service-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2a4 4 0 014-4h1"
        />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
  },
  {
    title: "Terapia para Adolescentes",
    description: "Apoyo profesional para jóvenes en etapas clave de su desarrollo.",
    icon: (
      <svg
        className="service-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 14h.01M16 10h.01M9 16h6"
        />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
  },
  {
    title: "Asesoría en Línea",
    description: "Sesiones virtuales desde la comodidad de tu hogar.",
    icon: (
      <svg
        className="service-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6l4 2"
        />
      </svg>
    ),
  },
];


export default function Home() {
  const [tab, setTab] = useState('nuevos');
  const [recursos, setRecursos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

    useEffect(() => {
    getRecursos().then(data => setRecursos(data));
  }, []);

  useEffect(() => {
    getCursos().then(data => setCursos(data));
  }, []);

    // Filtrar cursos por estado
  const cursosNuevos = cursos.filter(c => (c.estado || '').toLowerCase() === 'nuevo');
  const cursosRecomendados = cursos.filter(c => (c.estado || '').toLowerCase() === 'recomendado');

  
  return (
    <div className="home-container">
      <Header />
      
      <section data-aos="fade-up" className="hero">
        <div className="hero-content">
            <div className="hero-text">
            <span className="hero-subtitle">✨ Tu bienestar es nuestra prioridad.</span>
            <h1>Bienestar emocional y aprendizaje a tu alcance</h1>
            <p>
                Servicios psicológicos, manuales, libros educativos y clases de inglés
                diseñadas para tu desarrollo integral.
            </p>
            <div className="hero-buttons">
                <button className="btn primary">Agendar Consulta</button>
                <button className="btn outline">Ver Materiales </button>
            </div>
            </div>
            <div className="hero-image">
                <img src="/baner.png" alt="Banner Psicología y Educación" />
                <div className="hero-overlay">4.9/5 ⭐ <br />+200 clientes</div>
            </div>
        </div>
       </section>

      <section data-aos="fade-up" id="services" className="services-section">
        <h2>Servicios Psicológicos</h2>
        <div className="services-grid">
          {services.map(({ title, description, icon }, idx) => (
            <div key={idx} className="service-card">
              {icon}
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cursos Destacados */}
      <section data-aos="fade-up" id="cursos" className="featured-courses-section">
        <h2> Cursos Destacados</h2>
        <div style={{display:'flex', justifyContent:'center', gap:16, marginBottom:32}}>
          <button
            className={tab === 'nuevos' ? 'btn primary' : 'btn outline'}
            onClick={() => setTab('nuevos')}
          >Nuevos</button>
          <button
            className={tab === 'recomendados' ? 'btn primary' : 'btn outline'}
            onClick={() => setTab('recomendados')}
          >Recomendados</button>
        </div>
        <div className="featured-courses-grid">
          {(tab === 'nuevos' ? cursosNuevos : cursosRecomendados).map((curso, idx) => (
            <div
              key={curso.id || idx}
              className="featured-course-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/curso/${curso.id}`)}
            >
              <img src={curso.imagenFutura || "/baner.png"} alt={curso.nombre} style={{width: '100%', maxWidth: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12, background:'#f5f5f5'}} />
              <div className="featured-course-title">{curso.nombre}</div>
              <div className="featured-course-desc">{curso.descripcion}</div>
              {typeof curso.costo === 'number' && (
                <div className="book-cost">{curso.costo > 0 ? `$${curso.costo}` : 'Gratis'}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section data-aos="fade-up" id="books" className="books-section">
        <h2>Recursos Disponibles</h2>
        <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
          Amplía tus conocimientos con nuestra colección de recursos educativos de alta calidad
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="books-grid">
            {recursos.slice(0, 3).map((recurso, idx) => (
              <div
                key={recurso.id || idx}
                className="book-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/recurso/${recurso.id}`)}
              >
              <div key={recurso.id || idx} className="book-card">
                <img src={recurso.imagenFutura || "/baner.png"} alt={recurso.nombre} className="book-img" />
                <h3>{recurso.nombre}</h3>
                <p>{recurso.descripcion}</p>
                {typeof recurso.costo === 'number' && (
                  <div className="book-cost">{recurso.costo > 0 ? `$${recurso.costo}` : 'Gratis'}</div>
                )}
              </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button className="btn outline" onClick={() => window.location.href = '/recursos'}>
            Ver Más
          </button>
        </div>
      </section>

      <section data-aos="fade-up" id="english" className="english-section">
        <h2>Clases de Inglés (Próximamente)</h2>
        <p>
          Apúntate a nuestra lista de espera para recibir noticias sobre nuestras
          clases de inglés con enfoque conversacional y psicológico.
        </p>
        <input type="email" placeholder="Tu correo electrónico" className="email-input" />
        <button className="btn primary">Unirme a la lista</button>
      </section>

      {/* Botón flotante de WhatsApp siempre visible */}
      <WhatsAppFloat />

      <Footer />
    </div>
  );
}
