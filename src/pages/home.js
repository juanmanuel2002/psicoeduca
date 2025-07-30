import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { getRecursos } from '../services/recursosService';
import { getCursos } from '../services/cursosService';
import { useNavigate } from 'react-router-dom';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import InfoModal from '../components/ui/InfoModal';
import Header from "../components/header";
import Footer from '../components/footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/home.css";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const services = [
  {
    id: 'terapia-individual',
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
    id: 'terapia-adolescentes',
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
    id: 'asesoria-linea',
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

const testimonios = [
  {
    nombre: 'Carla',
    servicio: 'Taller: Me quiero conocer',
    comentario:
      'Sí me gustó, me ayudó, me ayudó a ver que no es tan difícil, solo es prestar atención 5 minutos al día.',
    img: 'Carla.jpg',
  },
  {
    nombre: 'Claudia',
    servicio: 'Servicios Psicológicos',
    comentario:
      'Me gustó especialmente la flexibilidad de las sesiones en línea, que me permitieron acceder a la ayuda que necesitaba desde la comodidad de mi hogar.',
    img: 'Claudia.jpg',
  },
  {
    nombre: 'Fernanda',
    servicio: 'Taller: Explorando mis emociones',
    comentario:
      'Al principio me sentí un poco frustrada por no poder saber o explicar cómo sentía mis emociones... me sigue encantando.',
    img: 'Fernanda.jpg',
  },
  {
    nombre: 'Emma',
    servicio: 'Taller: Estimulación temprana, creatividad e implementación',
    comentario:
      'Me gustó mucho porque te van guiando de manera muy amena sobre cómo ir tratando a las infancias.',
    img: 'Emma.jpg',
  },
  {
    nombre: 'Evelyn',
    servicio: 'Taller: Estimulación temprana, creatividad e implementación',
    comentario:
      'Me voy satisfecha y también con muchas ideas de los tipos de juegos... me doy cuenta de situaciones que incluso vivimos de niños.',
    img: 'Evelyn.jpg',
  },
  {
    nombre: 'Regina',
    servicio: 'Taller: Me quiero conocer',
    comentario:
      'Me permitió comprender mejor mis pensamientos, emociones y comportamientos. Me gustó la combinación perfecta de teoría y práctica.',
    img: 'Regina.jpg',
  },
  {
    nombre: 'Irais',
    servicio: 'Taller: ¿Te dejaré ir?',
    comentario:
      'El taller ofrece herramientas prácticas para manejar emociones y pensar con claridad. Se enfoca en aceptar, abrazar y sentir las emociones.',
    img: 'Irais.jpg',
  },
];

function truncate(text, maxLength = 55) {
  if (!text) return '';
  return text.length > maxLength
    ? text.slice(0, maxLength).trim() + '...'
    : text;
}

export default function Home() {
  const [tab, setTab] = useState('nuevos');
  const [recursos, setRecursos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [tipoCurso, setTipoCurso] = useState('sincronos');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const comunidadRef = useRef();
  const { user } = useContext(AuthContext);
  
  const [imagenActiva, setImagenActiva] = useState(null);
  const cerrarModal = () => setImagenActiva(null);
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  useEffect(() => {
    getRecursos().then(data => setRecursos(data));
  }, []);

  useEffect(() => {
    getCursos().then(data => setCursos(data));
  }, []);
  // Efecto para animar el carrusel infinito
  useEffect(() => {
    let pos = 0;
    const track = comunidadRef.current?.firstChild;
    if (!track) return;
    let frame;
    function animate() {
      pos += 0.5; // velocidad
      if (pos > track.scrollWidth / 2) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Filtrar cursos por estado y tipo
  const cursosNuevos = cursos.filter(c => (c.estado || '').toLowerCase() === 'nuevo');
  const cursosRecomendados = cursos.filter(c => (c.estado || '').toLowerCase() === 'recomendado');

  // Filtro por tipo
  const filtrarPorTipo = (arr) => {
    if (tipoCurso === 'sincronos') return arr.filter(c => (c.tipo || '').toLowerCase() === 'síncrono');
    if (tipoCurso === 'asincronos') return arr.filter(c => (c.tipo || '').toLowerCase() === 'asíncrono');
    return arr
  };

  // Efecto para animar el carrusel infinito
  
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
                <button className="btn primary" onClick={() => {
                  if (user) {
                    navigate('/crear-cita');
                  } else {
                    setShowModal(true);
                    setTimeout(() => {
                      navigate('/login', { state: { redirectTo: '/crear-cita' } });
                    }, 2500);
                  }
                }}>Agendar Consulta</button>
                <button className="btn outline" onClick={()=>(navigate('/recursos'))}>Ver Materiales </button>
            </div>
            {/* Modal en caso de no estar logeado y querer crear una cita */}
            <InfoModal
              open={showModal}
              title="Debes iniciar sesión para poder agendar una cita."
              message="Redirigiendo..."
            />
            </div>
            
            <div className="hero-image">
                <img src="/baner.png" alt="Banner Psicología y Educación" />
                <div className="hero-overlay">4.9/5 ⭐ <br />+200 clientes</div>
            </div>

            {/*
            <div className="hero-image-flip">
              <div className="flip-inner">
                <div className="flip-front">
                  <div className="hero-image">
                    <img src="/baner.png" alt="Banner Psicología y Educación" />
                    <div className="hero-overlay">4.9/5 ⭐ <br />+200 clientes</div>
                  </div>
                </div>
                <div className="flip-back">
                  <div className="hero-image-back">
                    <p className="flip-text">Bienvenido a Psicología y Educación</p>
                  </div>
                </div>
              </div>
            </div>
            */}

        </div>
      </section>

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

      {/* Cursos Destacados */}
      <section data-aos="fade-up" id="cursos" className="featured-courses-section">
        <h2> Cursos Destacados</h2>
        <div style={{display:'flex', justifyContent:'center', gap:25, marginBottom:16}}>
          <button
            className={tab === 'nuevos' ? 'btn primary' : 'btn outline'}
            onClick={() => setTab('nuevos')}
          >Nuevos</button>
          <button
            className={tab === 'recomendados' ? 'btn primary' : 'btn outline'}
            onClick={() => setTab('recomendados')}
          >Recomendados</button>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:32, marginBottom:40, marginTop: 30}}>
          <label style={{display:'flex', alignItems:'center', gap:4}}>
            <input
              type="radio"
              name="tipoCurso"
              value="sincronos"
              checked={tipoCurso === 'sincronos'}
              onChange={() => setTipoCurso('sincronos')}
            />
            Síncronos
          </label>
          <label style={{display:'flex', alignItems:'center', gap:4}}>
            <input
              type="radio"
              name="tipoCurso"
              value="asincronos"
              checked={tipoCurso === 'asincronos'}
              onChange={() => setTipoCurso('asincronos')}
            />
            Asíncronos
          </label>
        </div>
        <div className="featured-courses-grid">
          {(() => {
            const cursosFiltrados = filtrarPorTipo(tab === 'nuevos' ? cursosNuevos : cursosRecomendados);
            
            if (cursosFiltrados.length === 0) {
              return (
                <div className="no-courses-message">
                  <SentimentDissatisfiedIcon style={{ fontSize: 48, color: 'var(--color-accent)' }} />
                  <h3 style={{ fontWeight: '600', fontSize: '1.2rem', margin: 0 }}>¡Ups! No hay cursos disponibles</h3>
                  <p style={{ maxWidth: 400, fontSize: '1rem', margin: 0 }}>
                    Por ahora no contamos con cursos de este tipo. Síguenos en nuestras redes sociales para ser el primero en enterarte cuando lancemos nuevos.
                  </p>
                </div>
              );
            }
            return cursosFiltrados.map((curso, idx) => (
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
            ));
          })()}
        </div>
      </section>

      <section data-aos="fade-up" id="books" className="books-section">
        <h2>Recursos Disponibles</h2>
        <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
          Amplía tus conocimientos con nuestra colección de recursos educativos de alta calidad
        </div>
        <div style={{ display: "flex", justifyContent: "center"}}>
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
          <button className="btn outline" onClick={() => navigate('/recursos')}>
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

      {/* Comunidad/Testimonios - Galería infinita */}
      <section data-aos="fade-up" id="comunidad" className="comunidad-section">
        <h2>Comunidad Psicoeduca</h2>
        <p>Estos son algunos testimonios de personas que han tomado nuestros cursos o servicios.</p>
        
        <div className="comunidad-carousel" ref={comunidadRef}>
          <div className="comunidad-track">
            {[...testimonios, ...testimonios].map((testimonio, idx) => (
              <div key={testimonio.nombre + idx} className="comunidad-item">
                <img
                  src={`/${testimonio.img}`}
                  alt={testimonio.nombre}
                  onClick={() => setImagenActiva(`/${testimonio.img}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="comunidad-nombre">{testimonio.nombre}</div>
                <div className="comunidad-servicio">{testimonio.servicio}</div>
                <div className="comunidad-comentario"> “{truncate(testimonio.comentario, 55)}”</div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Modal */}
      {imagenActiva && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={imagenActiva} alt="Imagen ampliada" />
          </div>
        </div>
      )}

  

      {/* Botón flotante de WhatsApp siempre visible */}
      <WhatsAppFloat />

      <Footer />
    </div>
  );
}
