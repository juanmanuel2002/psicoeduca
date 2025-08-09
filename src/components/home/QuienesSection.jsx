import React from 'react';
import './style/quienesSection.css';
import { FaUsers, FaBullseye, FaEye, FaHeart } from 'react-icons/fa';

const info = [
  {
    title: '¿Quiénes somos?',
    desc: 'Somos un equipo de profesionales dedicados al bienestar emocional y educativo, comprometidos con el desarrollo integral de las personas a través de servicios psicológicos y recursos de calidad.',
    icon: <FaUsers />
  },
  {
    title: 'Misión',
    desc: 'Brindar atención psicológica y educativa accesible, confiable y de alta calidad, promoviendo el crecimiento personal y el aprendizaje en cada etapa de la vida.',
    icon: <FaBullseye />
  },
  {
    title: 'Visión',
    desc: 'Ser un referente en el ámbito de la psicología y la educación, impactando positivamente en la vida de las personas y la comunidad.',
    icon: <FaEye />
  },
  {
    title: 'Valores',
    desc: 'Empatía, ética, profesionalismo, innovación y compromiso social.',
    icon: <FaHeart />
  }
];

export default function QuienesSection() {
  return (
    <section data-aos="fade-up" className="quienes-section">
      <div className="quienes-grid">
        {info.map((item) => (
          <div
            key={item.title}
            className="quienes-card"
            tabIndex={0}
            aria-label={`${item.title}: ${item.desc}`}
          >
            <div className="quienes-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
