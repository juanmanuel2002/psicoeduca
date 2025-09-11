import React, { useEffect, useContext, useState} from 'react';
import { AuthContext } from '../contexts/authContext/AuthContext';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import Header from "../components/header";
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import InfoModal from '../components/ui/InfoModal';

import '../styles/consulta.css'

const serviciosConsulta = [
    {
        id: 'individual',
        title: "Terapia individual (adultos online)",
        description: "Atención psicológica personalizada para adultos, 100% online, enfocada en tu bienestar emocional y desarrollo personal.",
        icon: "🧑‍💼",
    },
    {
        id: 'breve',
        title: "Terapia breve",
        description: "Intervenciones psicológicas de corta duración, enfocadas en resolver problemas específicos de manera efectiva.",
        icon: "⏱️",
    }
];

export default function Consulta() {

    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
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
                                    <button
                                        className="btn primary"
                                        onClick={() => {
                                            if (user) {
                                                navigate('/crear-cita');
                                            } else {
                                                setShowModal(true);
                                                setTimeout(() => {
                                                navigate('/login', { state: { redirectTo: '/crear-cita' , servicio} });
                                                }, 2500);
                                            }
                                        }}
                                        >
                                        Agendar Consulta
                                    </button>

                                </div>
                                
                            ))}
                            
                        </div>
                        <InfoModal
                        open={showModal}
                        title={
                          <>
                            Debes iniciar sesión para<br />
                            poder agendar una cita.<br />
                          </>
                        }
                        message="Redirigiendo..."
                      />
            </section>
            
            <WhatsAppFloat />
            <Footer />
        </div>
    );
}
