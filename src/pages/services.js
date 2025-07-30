import React, {useEffect, useState}from 'react';
import AOS from 'aos';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import 'aos/dist/aos.css';
import '../styles/services.css';


const servicios = [
  {
    id: 'terapia-individual',
    title: 'Terapia Individual',
    description: 'Atención personalizada para adultos en búsqueda de bienestar emocional. Trabajamos juntos para superar retos personales y mejorar tu calidad de vida.',
    image: '/baner.png',
  },
  {
    id: 'terapia-adolescentes',
    title: 'Terapia para Adolescentes',
    description: 'Apoyo profesional para jóvenes en etapas clave de su desarrollo. Espacio seguro para expresar emociones y aprender herramientas para la vida.',
    image: '/baner.png',
  },
  {
    id: 'asesoria-linea',
    title: 'Asesoría en Línea',
    description: 'Sesiones virtuales desde la comodidad de tu hogar. Atención flexible y profesional para quienes prefieren la modalidad online.',
    image: '/baner.png',
  },
];

export default function Services() {
  const navigate = useNavigate();
  const { id } = useParams();
  const servicio = servicios.find(s => s.id === id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  useEffect(() => {
    if (servicio) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [servicio]);
  
  if (loading) return <div className="home-container"><Header /><div style={{textAlign:'center', display: 'center',marginTop:64}}><CircularProgress /><p>Cargando...</p></div></div>;
    

  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="service-detail-section">
        <div className="service-detail-card">
          <img src={servicio.image} alt={servicio.title} className="service-detail-img" />
          <h2>{servicio.title}</h2>
          <p>{servicio.description}</p>
          <button className="btn primary" onClick={() => navigate('/crear-cita')}>Agendar Cita</button>
          
        </div>
      </section>
      <section data-aos="fade-up" className='service-contact-info'>
          <div className="service-info">
            <p>
              En caso de necesitar más información, no dudes en contactarnos por nuestras redes sociales o por correo.
            </p>
          </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
