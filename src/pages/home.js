import React, { useEffect } from 'react';
import "../styles/home.css";
import Header from "../components/header";
import AOS from 'aos';
import 'aos/dist/aos.css';

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

const books = [
  { title: "Mindfulness para Todos", description: "Una guía práctica para la atención plena." },
  { title: "Manual de Ansiedad", description: "Estrategias para superar la ansiedad cotidiana." },
  { title: "Psicología Infantil", description: "Comprendiendo el desarrollo emocional de los niños." },
  { title: "Comunicación Asertiva", description: "Mejora tus relaciones con técnicas efectivas." },
  { title: "Autoestima y Crecimiento", description: "Construye una mejor versión de ti mismo." },
  { title: "Gestión del Estrés", description: "Técnicas para mantener la calma en tiempos difíciles." },
];

export default function Home() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
    }, []);
  return (
    <div className="home-container">
      <Header />

      <section data-aos="fade-up" className="hero">
        <div className="hero-content">
            <div className="hero-text">
            <span className="hero-subtitle">✨ Tu bienestar mental es nuestra prioridad.</span>
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

      <section data-aos="fade-up" id="books" className="books-section">
        <h2>Manuales y Libros</h2>
        <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
          Amplía tus conocimientos con nuestra colección de recursos educativos de alta calidad
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="books-grid">
            {books.map(({ title, description }, idx) => (
                <div key={idx} className="book-card">
                <img src="/baner.png" alt={title} className="book-img" />
                <h3>{title}</h3>
                <p>{description}</p>
                </div>
            ))}
            </div>
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

      <footer id="contact" className="footer">
        <p>© 2025 PsicoAprende. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
