import React, { useEffect, useState, useRef } from 'react';
import { getRecursos } from '../services/recursosService';
import { getCursos } from '../services/cursosService';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import Header from "../components/header";
import Footer from '../components/footer';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import FeaturedCoursesSection from '../components/home/FeaturedCoursesSection';
import BooksSection from '../components/home/BooksSection';
import EnglishSection from '../components/home/EnglishSection';
import ComunidadSection from '../components/home/ComunidadSection';
import ModalImagen from '../components/home/ModalImagen';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/home.css";

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
  const comunidadRef = useRef();
  
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

  const cursosNuevos = cursos.filter(c => (c.estado || '').toLowerCase() === 'nuevo');
  const cursosRecomendados = cursos.filter(c => (c.estado || '').toLowerCase() === 'recomendado');

  const filtrarPorTipo = (arr) => {
    if (tipoCurso === 'sincronos') return arr.filter(c => (c.tipo || '').toLowerCase() === 'síncrono');
    if (tipoCurso === 'asincronos') return arr.filter(c => (c.tipo || '').toLowerCase() === 'asíncrono');
    return arr
  };

  return (
    <div className="home-container">
      <Header />
      <HeroSection />
      <ServicesSection />
      <FeaturedCoursesSection
        tab={tab}
        setTab={setTab}
        tipoCurso={tipoCurso}
        setTipoCurso={setTipoCurso}
        cursosNuevos={cursosNuevos}
        cursosRecomendados={cursosRecomendados}
        filtrarPorTipo={filtrarPorTipo}
      />
      <BooksSection recursos={recursos} />
      <EnglishSection />
      <ComunidadSection
        testimonios={testimonios}
        comunidadRef={comunidadRef}
        setImagenActiva={setImagenActiva}
        truncate={truncate}
      />
      <ModalImagen imagenActiva={imagenActiva} cerrarModal={cerrarModal} />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
