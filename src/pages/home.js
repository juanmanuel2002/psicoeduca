import React, { useEffect, useState, useRef } from 'react';
import { getRecursos } from '../services/recursosService';
import { getCursos } from '../services/cursosService';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import Header from "../components/header";
import Footer from '../components/footer';
import HeroSection from '../components/home/HeroSection';
import QuienesSection from '../components/home/QuienesSection';
import ServicesSection from '../components/home/ServicesSection';
import FeaturedCoursesSection from '../components/home/FeaturedCoursesSection';
import BooksSection from '../components/home/BooksSection';
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
      'Si me gustó, me ayudó, me ayudo a ver que es tan difícil solo es como prestar atención 5 minutos al día para poder conectar con tu cuerpo... las actividades me ayudaron a ver que no es tan difícil... todas las herramientas que necesitas para conocerte están a tu disposición, solo necesitas conectarte unos minutitos y no es tan difícil.',
    img: 'Carla.jpg',
    calificacion: 4.5,
  },
  {
    nombre: 'Claudia',
    servicio: 'Servicios Psicológicos',
    comentario:
      'Me gustó especialmente la flexibilidad de las sesiones en línea, que me permitieron acceder a la ayuda que necesitaba desde la comodidad de mi hogar. Los psicólogos son excelentes, con una gran empatía y comprensión. Y lo mejor de todo es que los precios son muy razonables, sin sacrificar la calidad del servicio.',
    img: 'Claudia.jpg',
    calificacion: 4,
  },
  {
    nombre: 'Fernanda',
    servicio: 'Taller: Explorando mis emociones',
    comentario:
      'Al principio me sentí un poco frustrada por no poder saber exactamente o explicar donde sentía, como sentía mis emociones ... me sigue encantando, me sigue gustando, me sigue llamando muchísimo la atención esto, cada cosa que explica me llama mas la atención para yo seguir buscando por mi cuenta y conocer mas del tema, yo me sentí muy a gusto.',
    img: 'Fernanda.jpg',
    calificacion: 4.5
  },
  {
    nombre: 'Emma',
    servicio: 'Taller: Estimulación temprana, creatividad e implementación',
    comentario:
      'A mi me gusto mucho porque te van guiando de manera muy amena sobre como ir tratando a las infancias... me gusto mucho principalmente los juegos, porque son juegos que no creí que fueran tan útiles para los niños, es decir no quebrarte tanto la cabeza, pueden ayudar mucho...',
    img: 'Emma.jpg',
    calificacion: 5
  },
  {
    nombre: 'Regina',
    servicio: 'Taller: Me quiero conocer',
    comentario:
      'Me permitió comprender mejor mis pensamientos, emociones y comportamientos, lo que más me gustó del taller fue la combinación perfecta de teoría y práctica, lo mejor de todo es que el costo es muy accesible. No te dejaras intimidar por el precio, ya que es una inversion en tu bienestar y crecimiento personal que vale mucho más.',
    img: 'Regina.jpg',
    calificacion: 4
  },
  {
    nombre: 'Irais',
    servicio: 'Taller: ¿Te dejaré ir?',
    comentario:
      'El taller ofrece herramientas prácticas para aprender a manejar las emociones y pensar con claridad en moments de tensión, se enfoca en la importancia de aceptar, abrazar y sentir las emociones, en lugar de reprimirlas, es un espacio seguro para explorar el proceso del duelo y entender que es un proceso; los materiales el taller, como videos y mensajes, son útiles para ilustrar y reforzar los conceptos aprendidos, el taller cumplió con su objetivo y me brindo un aprendizaje valioso para seguir adelante.',
    img: 'Irais.jpg',
    calificacion: 5,
  },
];

function truncate(text, maxLength = 65) {
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
  <QuienesSection />
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
