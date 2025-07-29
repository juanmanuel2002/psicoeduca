import React, { useState, useContext, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { crearCita, getCitas } from '../services/citasService';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../components/ui/InfoModal';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/crearCita.css'; 

export default function CrearCita() {

function getAvailableHours(fecha, citas) {
  if (!fecha) return [];
  const date = new Date(fecha);
  const day = date.getDay(); // 0=Lun, 1=Mar, ..., 5=Sab
  let hours = [];
  if (day >= 0 && day <= 4) { // Lunes a Viernes
    for (let h = 9; h < 21; h++) hours.push(h);
  } else if (day === 5) { // Sábado
    for (let h = 9; h < 15; h++) hours.push(h);
  } 

  // Verificar ocupados
  const ocupados = citas
    .filter(c => c.fecha === fecha)
    .map(c => parseInt(c.hora.split(':')[0], 10));
  return hours.map(h => ({
    hora: h.toString().padStart(2, '0') + ':00',
    ocupado: ocupados.includes(h)
  }));
}

const { user } = useContext(AuthContext);
const [citaData, setCitaData] = useState({ fecha: '', hora: '', descripcion: '' });
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState('');
const [citas, setCitas] = useState([]);
const [horasDisponibles, setHorasDisponibles] = useState([]);
const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();

useEffect(() => {
  if (!citaData.fecha) return;
  getCitas()
    .then(data => {
      setCitas(data);
    })
    .catch(err => {
      if(err?.message === "No autorizado. Debes iniciar sesión.") {
        setError('Debes iniciar sesion para cargar los horarios de las citas')
      }else if(err?.message === "El horario ya está ocupado en el calendario."){
        setError('El horario ya está ocupado en el calendario. Por favor selecciona otro horario')
      }else{
        setError('Error al cargar citas. Intenta de nuevo.');
      }
      setCitas([]);
    });
}, [citaData.fecha]);

  useEffect(() => {
    if (!citaData.fecha) return setHorasDisponibles([]);
    setHorasDisponibles(getAvailableHours(citaData.fecha, citas));
  }, [citaData.fecha, citas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await crearCita({
        fecha: citaData.fecha,
        hora: citaData.hora,
        usuarioId: user?.name || user?.email || user?.id ,
        descripcion: citaData.descripcion,
      });
      setSuccess(true);
      setCitaData({ fecha: '', hora: '', descripcion: '' });
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

  return (
    <div className="home-container">
      <Header />
      <section className="crear-cita-section">
        <h2>Agendar Consulta</h2>
        {success && <div className="success-message">¡Cita agendada exitosamente!</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="crear-cita-form-group">
            <label>Fecha:</label>
            <input type="date" required value={citaData.fecha} onChange={e => {
              setCitaData(d => ({ ...d, fecha: e.target.value, hora: '' }));
            }} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="crear-cita-form-group">
            <label>Hora:</label>
            {error !== 'Debes iniciar sesion para cargar los horarios de las citas' &&
              <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                {horasDisponibles.length === 0 && <span style={{color:'#888'}}>Lo sentimos, no tenemos horarios este día. Por favor selecciona otro día</span>}
                {horasDisponibles.map(({hora, ocupado}) => (
                  <button
                    type="button"
                    key={hora}
                    style={{
                      background: ocupado ? '#f8d7da' : '#d4edda',
                      color: ocupado ? '#a94442' : '#155724',
                      border: ocupado ? '1px solid #a94442' : '1px solid #155724',
                      borderRadius:6,
                      padding:'6px 12px',
                      cursor: ocupado ? 'not-allowed' : 'pointer',
                      fontWeight: citaData.hora === hora ? 'bold' : 'normal',
                      opacity: ocupado ? 0.6 : 1
                    }}
                    disabled={ocupado}
                    onClick={() => setCitaData(d => ({...d, hora}))}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            }
          </div>
          <div className="crear-cita-form-group">
            <label>Descripción:</label>
            <textarea required value={citaData.descripcion} onChange={e => setCitaData(d => ({ ...d, descripcion: e.target.value }))} rows={3} />
          </div>
          <div className="crear-cita-buttons">
            <button type="submit" className="btn primary" disabled={loading || !citaData.hora}>
              {loading ? 'Agendando...' : 'Agendar'}
            </button>
          </div>
        </form>
        <InfoModal open={showModal} title="¡Cita agendada exitosamente!" message="Te esperamos en tu consulta." />
      </section>
      <section className = "otras-citas-section">
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
