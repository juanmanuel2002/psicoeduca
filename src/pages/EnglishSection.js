
import React, { useState } from 'react';
import '../styles/englishSection.css';
import { sendEmailSolicitud } from '../services/sendEmailService';
import InfoModal from '../components/ui/InfoModal';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import SchoolIcon from '@mui/icons-material/School';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';

const TESTIMONIALS = [
  { text: 'Las clases son súper dinámicas y me ayudaron a perder el miedo a hablar.', author: 'Ana G.' },
  { text: 'Me encantó el enfoque psicológico, ¡aprendí mucho más que solo inglés!', author: 'Carlos P.' },
  { text: 'Los profesores son muy pacientes y las actividades divertidas.', author: 'María L.' },
];

const RESOURCES = [
  { icon: <MenuBookIcon className="resource-icon" />, name: 'Guías PDF' },
  { icon: <SchoolIcon className="resource-icon" />, name: 'Videos interactivos' },
  { icon: <GroupIcon className="resource-icon" />, name: 'Foros de conversación' },
  { icon: <StarIcon className="resource-icon" />, name: 'Tips de aprendizaje' },
];

export default function EnglishSection() {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalError, setShowModalError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await sendEmailSolicitud({ correo, nombre });
      setShowModal(true);
      setCorreo('');
      setNombre('');
      setTimeout(() => setShowModal(false), 4000);
    } catch (err) {
      setShowModalError(true);
      setTimeout(() => setShowModalError(false), 2500);
    }
    setEnviando(false);
  };

  return (
    <div className="home-container">
      <Header />
      <section className="english-section">
        <img src="/baner.png" alt="Clases de inglés" className="english-hero-img" />
        <h2>Clases de Inglés Psicoeduca</h2>
        <div className="subtitle">Aprende inglés con un enfoque conversacional, divertido y psicológico.</div>
        <div className="english-icons">
          <SchoolIcon className="english-icon" />
          <EmojiPeopleIcon className="english-icon" />
          <GroupIcon className="english-icon" />
        </div>

        {/* Conócenos */}
        <div className="english-cards">
          <div className="english-card">
            <div className="card-title">¿Quiénes somos?</div>
            <div className="card-desc">Somos un equipo de psicólogos y profesores certificados que te ayudarán a aprender inglés de manera integral y divertida.</div>
          </div>
          <div className="english-card">
            <div className="card-title">¿Por qué elegirnos?</div>
            <div className="card-desc">Nuestro método combina técnicas psicológicas y actividades prácticas para que pierdas el miedo a hablar y disfrutes el proceso.</div>
          </div>
        </div>

        {/* Opiniones */}
        <div className="english-testimonials">
          <h3>Opiniones de estudiantes</h3>
          <div className="testimonial-list">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial" key={i}>
                <StarIcon style={{ color: '#fbbf24', fontSize: 22, marginBottom: 4 }} />
                <div>"{t.text}"</div>
                <div className="testimonial-author">- {t.author}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clases */}
        <div className="english-cards">
          <div className="english-card">
            <div className="card-title">Clases grupales</div>
            <div className="card-desc">Participa en sesiones grupales para practicar conversación y aprender con otros.</div>
          </div>
          <div className="english-card">
            <div className="card-title">Clases individuales</div>
            <div className="card-desc">Recibe atención personalizada y avanza a tu propio ritmo.</div>
          </div>
        </div>

        {/* Inscríbete */}
        <div className="inscribete-section">
          <h3>¡Inscríbete a la lista de espera!</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
            <button type="submit" disabled={enviando}>
              {enviando ? 'Enviando...' : <><EmailIcon style={{verticalAlign:'middle', marginRight:6}}/>Unirme a la lista</>}
            </button>
          </form>
        </div>

        {/* Recursos */}
        <div className="english-resources">
          <h3>Recursos para tu aprendizaje</h3>
          <div className="resources-list">
            {RESOURCES.map((r, i) => (
              <div className="resource" key={i}>
                {r.icon}
                <div>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <InfoModal open={showModal} title="¡Solicitud enviada correctamente!" message="¡Pronto te contactaremos!" />
      <InfoModal open={showModalError} title="¡Error al enviar la solicitud! Verifica la información ingresada e intenta de nuevo. En caso de que se siga presentando el error contactanos por nuestras redes sociales" message="" />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
