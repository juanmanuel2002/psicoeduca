import React, { useState, useEffect } from 'react';
import '../styles/englishSection.css';
import { sendEmailSolicitud } from '../services/sendEmailService';
import { useNavigate } from 'react-router-dom';
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
import AOS from 'aos';

const TESTIMONIALS = [
  { text: 'Las clases son súper dinámicas y me ayudaron a perder el miedo a hablar.', author: 'Ana G.', calificacion: 4.5 },
  { text: 'Me encantó el enfoque psicológico, ¡Aprendí mucho más que solo inglés!', author: 'Carlos P.', calificacion: 4 },
  { text: 'Los profesores son muy pacientes y las actividades divertidas.', author: 'María L.', calificacion: 5 },
];

const RESOURCES = [
  { icon: <MenuBookIcon className="resource-icon" />, name: 'Guías PDF' },
  { icon: <SchoolIcon className="resource-icon" />, name: 'Videos interactivos' },
  { icon: <GroupIcon className="resource-icon" />, name: 'Foros de conversación' },
  { icon: <StarIcon className="resource-icon" />, name: 'Tips de aprendizaje' },
];

function StarCircle({ calificacion }) {
  return (
    <div className="star-circle">
      <span className="star-value">{calificacion}</span>
      <span className="star-icon">★</span>
    </div>
  );
}

export default function EnglishSection() {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

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
      <section data-aos="fade-up" className="english-section">

        {/* HERO */}
        <div className="english-hero">
          <div className="english-hero-text">
            <h2>Bienvenido a PSICOIDIOMAS</h2>
            <h3>Clases de Inglés con Psicoeduca</h3>
            <div className="subtitle">Aprende inglés con un enfoque conversacional, divertido y psicológico.</div>
            <div className="english-icons">
              <SchoolIcon className="english-icon" />
              <EmojiPeopleIcon className="english-icon" />
              <GroupIcon className="english-icon" />
            </div>
          </div>
          <img src="/baner.png" alt="Clases de inglés" className="english-hero-img" />
        </div>

        {/* Conócenos */}
        <div className="english-cards">
          <div className="english-card">
            <div className="card-title">¿Quiénes somos?</div>
            <div className="card-desc">
              Somos un equipo de psicólogos y profesores certificados que te ayudarán a aprender inglés de manera integral y divertida.
            </div>
          </div>
          <div className="english-card">
            <div className="card-title">¿Por qué elegirnos?</div>
            <div className="card-desc">
              Nuestro método combina técnicas psicológicas y actividades prácticas para que pierdas el miedo a hablar y disfrutes el proceso.
            </div>
          </div>
        </div>

        {/* Opiniones */}
        <div className="english-testimonials">
          <h3>Opiniones de estudiantes</h3>
          <div className="testimonial-list">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial" key={i}>
                <StarCircle calificacion={t.calificacion || 5} />
                <div>"{t.text}"</div>
                <div className="testimonial-author">- {t.author}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clases */}
        <div className="english-cards">
          <div className="english-card">
            <img src="/baner.png" alt="Clases grupales" className="card-img" />
            <div className="card-title">Clases grupales</div>
            <div className="card-desc">Participa en sesiones grupales para practicar conversación y aprender con otros.</div>
            <button className="btn primary" onClick={() => {navigate('/clases-grupo');}}>
              Más Información
            </button>
          </div>
          <div className="english-card">
            <img src="/baner.png" alt="Clases grupales" className="card-img" />
            <div className="card-title">Clases individuales</div>
            <div className="card-desc">Recibe atención personalizada y avanza a tu propio ritmo.</div>
            <button className="btn primary" onClick={() =>{navigate('/clases-individual');}}>
              Más Información
            </button>
          </div>
        </div>

        {/* Inscríbete */}
        <div className="inscribete-section">
          <h3>¿Necesitas algun otro tipo de sesión?</h3>
          <h4>Llena los siguientes campos y ponto te contactaremos</h4>
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
              {enviando ? 'Enviando...' : <><EmailIcon style={{ verticalAlign: 'middle', marginRight: 6 }} />Unirme a la lista</>}
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
