import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/servicesSection.css';

const services = [
  {
    id: '/servicio/terapia-individual',
    title: "Terapia individual (adultos online)",
    description: "Atención psicológica personalizada para adultos, 100% online, enfocada en tu bienestar emocional y desarrollo personal.",
    icon: (
      <span role="img" aria-label="terapia" className="service-icon">🧑‍💼</span>
    ),
  },
  {
    id: '/cursos',
    title: "Cursos psicológicos",
    description: "Capacítate y aprende sobre psicología aplicada a la vida diaria, con cursos prácticos y accesibles para todos.",
    icon: (
      <span role="img" aria-label="cursos" className="service-icon">📚</span>
    ),
  },
  {
    id: 'seminarios-gratuitos',
    title: "Seminarios gratuitos",
    description: "Participa en seminarios y charlas sin costo, impartidos por profesionales, para tu crecimiento personal y emocional.",
    icon: (
      <span role="img" aria-label="seminarios" className="service-icon">🎤</span>
    ),
  },
  {
    id: 'consulta-psicologica',
    title: "Consulta psicológica",
    description: "Sesiones de consulta para orientación, diagnóstico y acompañamiento psicológico en diferentes áreas de tu vida.",
    icon: (
      <span role="img" aria-label="consulta" className="service-icon">💬</span>
    ),
  },
  {
    id: 'terapia-breve',
    title: "Terapia breve",
    description: "Intervenciones psicológicas de corta duración, enfocadas en resolver problemas específicos de manera efectiva.",
    icon: (
      <span role="img" aria-label="terapia breve" className="service-icon">⏱️</span>
    ),
  },
  {
    id: 'ingles-psicologia',
    title: "Inglés desde la psicología",
    description: "Aprende inglés con un enfoque psicológico, potenciando tus habilidades cognitivas y emocionales para el aprendizaje de idiomas.",
    icon: (
      <span role="img" aria-label="ingles" className="service-icon">🇬🇧</span>
    ),
  },
  {
    id: 'recursos-gratuitos',
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
