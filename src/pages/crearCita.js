import React, { useState, useContext, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { crearCita, getCitas } from '../services/citasService';
import { useNavigate, useLocation } from 'react-router-dom';
import InfoModal from '../components/ui/InfoModal';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/crearCita.css'; 

export default function CrearCita() {
  const { user } = useContext(AuthContext);
  const [citaData, setCitaData] = useState({
    nombre: user?.name || '',
    edad: '',
    whatsapp: '',
    correo: user?.email || '',
    ciudad: '',
    ocupacion: '',
    trabajo: '',
    motivo: '',
    tipoPsicoterapia: '',
    fecha: '',
    hora: '',
    descripcion: ''
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [citas, setCitas] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedServicio = location.state; // card seleccionada desde /consulta

  function getAvailableHours(fecha, citas) {
    if (!fecha) return [];
    const [y, m, d] = fecha.split("-").map(Number);
    const date = new Date(y, m - 1, d); 

    const today = new Date();
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    
    const day = date.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
    let hours = [];
    if (day >= 1 && day <= 5) { // Lunes a Viernes (1-5)
      for (let h = 9; h < 21; h++) hours.push(h);
    } else if (day === 6) { // Sábado (6)
      for (let h = 9; h < 15; h++) hours.push(h);
    }

    // Verificar ocupados
    const ocupados = citas
      .filter(c => c.fecha === fecha)
      .map(c => parseInt(c.hora.split(':')[0], 10));

    // Si es hoy, marcar horas pasadas como "pasada"
    const currentHour = today.getHours();
    return hours.map(h => {
      const ocupado = ocupados.includes(h);
      const pasada = isToday && h <= currentHour;
      return {
        hora: h.toString().padStart(2, '0') + ':00',
        ocupado,
        pasada
      };
    });
  }

  useEffect(() => {
  if (!citaData.fecha) return;

  const fetchCitas = async () => {
    try {
      const data = await getCitas();
      setCitas(data);
    } catch (err) {
      if(err?.message === "No autorizado. Debes iniciar sesión.") {
        setError('Debes iniciar sesion para cargar los horarios de las citas')
      } else if(err?.message === "El horario ya está ocupado en el calendario.") {
        setError('El horario ya está ocupado en el calendario. Por favor selecciona otro horario')
      } else {
        setError('Error al cargar citas. Intenta de nuevo.');
      }
      setCitas([]);
    }
  };

  fetchCitas(); 

  // cada 25s refresca
  const interval = setInterval(fetchCitas, 25 * 1000);

  return () => clearInterval(interval); 
}, [citaData.fecha]);

  useEffect(() => {
    if (!citaData.fecha) return setHorasDisponibles([]);
    setHorasDisponibles(getAvailableHours(citaData.fecha, citas));
  }, [citaData.fecha, citas]);

  useEffect(() => {
    if (!citaData.fecha) return;
    const interval = setInterval(() => {
      setHorasDisponibles(getAvailableHours(citaData.fecha, citas));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [citaData.fecha, citas]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  useEffect(() => {
  if (selectedServicio) {
    setCitaData(d => ({ ...d, descripcion: selectedServicio.title }));
  }
}, [selectedServicio]);

  const handleNext = (e) => {
    e && e.preventDefault();
    setStep(s => Math.min(s + 1, 3));
  };
  const handleBack = (e) => {
    e && e.preventDefault();
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await crearCita({
        ...citaData,
        usuarioId: user?.name || user?.email || user?.id,
      });
      setSuccess(true);
      setCitaData({
        nombre: user?.name || '',
        edad: '',
        whatsapp: '',
        correo: user?.email || '',
        ciudad: '',
        ocupacion: '',
        trabajo: '',
        motivo: '',
        tipoPsicoterapia: '',
        fecha: '',
        hora: '',
        descripcion: ''
      });
      setShowModal(true);
      setTimeout(() => {
        navigate('/home');
      }, 2500);
    } catch (err) {
      console.error('Error al crear cita:', err);
      const msg = err?.response?.data?.message || err?.message || 'No se pudo agendar la cita. Intenta de nuevo.';
      setError(msg);
    }
    setLoading(false);
  };

if (!user) {
  return (
    <div className="home-container">
      <Header />
      <section className="crear-cita-section-wrapper">
        <div className="error-message" style={{margin: '40px auto', maxWidth: 600, textAlign: 'center'}}>
          Debes iniciar sesión para poder agendar una cita.
        </div>
      </section>
      <Footer />
    </div>
  );
}


  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="crear-cita-section-wrapper">
        <div className="crear-cita-section">
          <h2>Agendar Consulta</h2>
          
          {success && <div className="success-message">¡Cita agendada exitosamente!</div>}
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={step === 3 ? handleSubmit : handleNext}>
            {step === 1 && (
              <>
                <div className="crear-cita-form-group">
                  <label>Nombre completo:</label>
                  <input type="text" required value={citaData.nombre} onChange={e => setCitaData(d => ({ ...d, nombre: e.target.value }))} disabled={!!citaData.nombre}/>
                </div>
                <div className="crear-cita-form-group">
                  <label>Edad:</label>
                  <input type="number" required min={1} max={120} value={citaData.edad} onChange={e => setCitaData(d => ({ ...d, edad: e.target.value }))} />
                </div>
                <div className="crear-cita-form-group">
                  <label>Número WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={citaData.whatsapp}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) { 
                        setCitaData(d => ({ ...d, whatsapp: value }));
                      }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                  />

                </div>
                <div className="crear-cita-form-group">
                  <label>Correo electrónico:</label>
                  <input type="email" required value={citaData.correo} onChange={e => setCitaData(d => ({ ...d, correo: e.target.value }))} disabled={!!citaData.correo}/>
                </div>
                <div className="crear-cita-form-group">
                  <label>Ciudad:</label>
                  <input type="text" required value={citaData.ciudad} onChange={e => setCitaData(d => ({ ...d, ciudad: e.target.value }))} />
                </div>
                <div className="crear-cita-buttons">
                  <button type="submit" className="btn primary">Siguiente</button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="crear-cita-form-group">
                  <label>¿A qué te dedicas?</label>
                  <input type="text" required value={citaData.ocupacion} onChange={e => setCitaData(d => ({ ...d, ocupacion: e.target.value }))} />
                </div>
                <div className="crear-cita-form-group">
                  <label>¿En qué trabajas?</label>
                  <input type="text" required value={citaData.trabajo} onChange={e => setCitaData(d => ({ ...d, trabajo: e.target.value }))} />
                </div>
                <div className="crear-cita-form-group">
                  <label>Motivo de consulta:</label>
                  <textarea required value={citaData.motivo} onChange={e => setCitaData(d => ({ ...d, motivo: e.target.value }))} rows={2} />
                </div>
                <div className="crear-cita-form-group">
                  <label>Tipo de psicoterapia:</label>
                  <select required value={citaData.tipoPsicoterapia} onChange={e => setCitaData(d => ({ ...d, tipoPsicoterapia: e.target.value }))}>
                    <option value="">Selecciona una opción</option>
                    <option value="TCC">TCC</option>
                    <option value="Sistémico">Sistémico</option>
                    <option value="Existencial">Existencial</option>
                    <option value="Humanista">Humanista</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="crear-cita-buttons" >
                  <button type="button" className="btn outline" onClick={handleBack}>Atrás</button>
                  <button type="submit" className="btn primary">Siguiente</button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="crear-cita-form-group">
                  <label>Fecha:</label>
                  <input 
                    type="date" 
                    required 
                    value={citaData.fecha} 
                    onChange={e => {
                      setCitaData(d => ({ ...d, fecha: e.target.value, hora: '' }));
                    }} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>
                <div className="crear-cita-form-group">
                  <label>Hora:</label>
                  {error !== 'Debes iniciar sesion para cargar los horarios de las citas' &&
                    <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                      {horasDisponibles.length === 0 && <span style={{color:'#888'}}>Lo sentimos, no tenemos horarios este día. Por favor selecciona otro día</span>}
                      {horasDisponibles.map(({hora, ocupado, pasada}) => (
                        <button
                          type="button"
                          key={hora}
                          style={{
                            background: pasada
                              ? '#eee'
                              : ocupado
                              ? '#f8d7da'
                              : '#d4edda',
                            color: pasada
                              ? '#aaa'
                              : ocupado
                              ? '#a94442'
                              : '#155724',
                            border: pasada
                              ? '1px solid #ccc'
                              : ocupado
                              ? '1px solid #a94442'
                              : '1px solid #155724',
                            borderRadius: 6,
                            padding: '6px 12px',
                            cursor: pasada || ocupado ? 'not-allowed' : 'pointer',
                            fontWeight: citaData.hora === hora ? 'bold' : 'normal',
                            opacity: pasada || ocupado ? 0.6 : 1
                          }}
                          disabled={ocupado || pasada}
                          onClick={() => !pasada && !ocupado && setCitaData(d => ({ ...d, hora }))
                          }
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  }
                </div>
                {/*<div className="crear-cita-form-group">
                  <label>Descripción:</label>
                  <textarea 
                    required 
                    value={citaData.descripcion} 
                    onChange={e => setCitaData(d => ({ ...d, descripcion: e.target.value }))} 
                    rows={3} 
                  />
                </div>*/}
                <p className="crear-cita-leyenda" style={{marginTop:16, fontSize:14, color:'#2563EB'}}>
                  Tus datos estarán siempre protegidos. Te asignaremos un terapeuta certificado, acorde a tu disponibilidad y necesidades. Puedes solicitar sus credenciales en cualquier momento para tu total confianza y tranquilidad.
                </p>
                <div className="crear-cita-buttons" >
                  <button type="button" className="btn outline" onClick={handleBack}>Atrás</button>
                  <button type="submit" className="btn primary" disabled={loading || !citaData.hora || !citaData.fecha}>
                    {loading ? 'Agendando...' : 'Agendar'}
                  </button>
                </div>
        
              </>
            )}
          </form>
          <InfoModal open={showModal} title="¡Cita agendada exitosamente!" message="Te esperamos en tu consulta." />
        </div>

        {/* Card del servicio seleccionado */}
        {selectedServicio && (
          <div className="crear-cita-servicio-card">
            <div className="service-icon">{selectedServicio.icon}</div>
            <div className="consulta-servicio-title">{selectedServicio.title}</div>
            <div className="consulta-servicio-desc">{selectedServicio.description}</div>
          </div>
        )}
      </section>

      <section data-aos="fade-up" className="otras-citas-section">
        <div className="otras-citas-header">
          <p>Si no encuentras un horario que se ajuste a tus necesidades, por favor contáctanos a través de nuestras redes sociales o correo electrónico.</p>
          <p>Estamos aquí para ayudarte a encontrar el mejor momento para tu consulta.</p>
        </div>
      </section>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
