import React, { useEffect} from 'react';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import Header from "../components/header";
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

import '../styles/consulta.css'

const serviciosConsulta = [
    {
        id: '/servicio/terapia-individual',
        title: (
        <>
            Terapia individual <br />
            <span className="subtitulo">(adultos online)</span>
        </>
        ),
        description: "Atención psicológica personalizada para adultos, 100% online, enfocada en tu bienestar emocional y desarrollo personal.",
        icon: (
            <span role="img" aria-label="terapia" className="service-icon">🧑‍💼</span>
        ),
    },
    {
        id: 'terapia-breve',
        title: "Terapia breve",
        description: "Intervenciones psicológicas de corta duración, enfocadas en resolver problemas específicos de manera efectiva.",
        icon: (
            <span role="img" aria-label="terapia breve" className="service-icon">⏱️</span>
        ),
    }
];

export default function Consulta() {


    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
    }, []);



    return (
        <div className="home-container">
            <Header />
            <section data-aos="fade-up" className="consulta-section">
                <h2>Consulta Psicológica</h2>
                <p>Agenda tu consulta psicológica con nuestros especialistas.</p>
                        <div className="consulta-servicios-grid">
                            {serviciosConsulta.map(servicio => (
                                <div key={servicio.id} className="consulta-servicio-card">
                                    <div className="service-icon">{servicio.icon}</div>
                                    <div className="consulta-servicio-title">{servicio.title}</div>
                                    <div className="consulta-servicio-desc">{servicio.description}</div>
                                    <button className = 'btn primary' onClick={()=> {navigate('/crear-cita')}}>Agendar Consulta</button>
                                </div>
                                
                            ))}
                            
                        </div>
            </section>
            <WhatsAppFloat />
            <Footer />
        </div>
    );
}
