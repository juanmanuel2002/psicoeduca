import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/servicesSection.css';

const services = [
  {
    id: 'terapia-individual',
    title: "Terapia Individual",
    description: "Atención personalizada para adultos en búsqueda de bienestar emocional.",
    icon: (
      <svg className="service-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h1" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
  },
  {
    id: 'terapia-adolescentes',
    title: "Terapia para Adolescentes",
    description: "Apoyo profesional para jóvenes en etapas clave de su desarrollo.",
    icon: (
      <svg className="service-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M9 16h6" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
  },
  {
    id: 'asesoria-linea',
    title: "Asesoría en Línea",
    description: "Sesiones virtuales desde la comodidad de tu hogar.",
    icon: (
      <svg className="service-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();
  return (
    <section data-aos="fade-up" id="services" className="services-section">
      <h2>Servicios Psicológicos</h2>
      <div className="services-grid">
        {services.map(({ title, description, icon, id }, idx) => (
          <div key={idx} className="service-card" onClick={() => navigate(`/servicio/${id}`)}>
            {icon}
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
