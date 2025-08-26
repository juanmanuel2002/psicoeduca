import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/servicesSection.css';

const services = [
  {
    id: '/consulta',
    title: "Consulta psicológica",
    description: "Sesiones de consulta para orientación, diagnóstico y acompañamiento psicológico en diferentes áreas de tu vida.",
    icon: (
      <span role="img" aria-label="consulta" className="service-icon">💬</span>
    ),
  },

  {
    id: '/cursos',
    title: "Cursos y Talleres",
    description: "Capacítate y aprende sobre psicología aplicada a la vida diaria, con cursos prácticos y accesibles para todos.",
    icon: (
      <span role="img" aria-label="cursos" className="service-icon">📚</span>
    ),
  }, 
  {
    id: '/english',
    title: "Inglés desde la psicología",
    description: "Aprende inglés con un enfoque psicológico, potenciando tus habilidades cognitivas y emocionales para el aprendizaje de idiomas.",
    icon: (
      <span role="img" aria-label="ingles" className="service-icon">🇺🇸</span>
    ),
  },
  {
    id: '/recursos',
    title: "Recursos gratuitos",
    description: "Accede a materiales, guías y herramientas gratuitas para tu bienestar y desarrollo personal.",
    icon: (
      <span role="img" aria-label="recursos" className="service-icon">🆓</span>
    ),
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();
  return (
    <section data-aos="fade-up" className="services-section">
      <h2 >Conoce nuestros servicios </h2>
      <div className="services-grid">
        {services.map(({ title, description, icon, id }, idx) => (
          <div key={idx} className="service-card" onClick={() => navigate(`${id}`)}>
            {icon}
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
