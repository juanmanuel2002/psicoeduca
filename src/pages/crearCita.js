import React, { useState, useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { crearCita } from '../services/citasService';

export default function CrearCita() {
  const { user } = useContext(AuthContext);
  const [citaData, setCitaData] = useState({ fecha: '', hora: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await crearCita({
        fecha: citaData.fecha,
        hora: citaData.hora,
        usuarioId: user?.email || user?.id || user?.nombre,
        descripcion: citaData.descripcion,
      });
      setSuccess(true);
      setCitaData({ fecha: '', hora: '', descripcion: '' });
    } catch (err) {
      setError('No se pudo agendar la cita. Intenta de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <Header />
      <section className="crear-cita-section" style={{maxWidth:400, margin:'40px auto', background:'#fff', borderRadius:12, padding:32, boxShadow:'0 2px 16px rgba(0,0,0,0.10)'}}>
        <h2 style={{marginTop:0}}>Agendar Consulta</h2>
        {success && <div style={{color:'green', marginBottom:12}}>¡Cita agendada exitosamente!</div>}
        {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:12}}>
            <label>Fecha:</label>
            <input type="date" required value={citaData.fecha} onChange={e => setCitaData(d => ({...d, fecha: e.target.value}))} style={{width:'100%',padding:6,marginTop:4}} />
          </div>
          <div style={{marginBottom:12}}>
            <label>Hora:</label>
            <input type="time" required value={citaData.hora} onChange={e => setCitaData(d => ({...d, hora: e.target.value}))} style={{width:'100%',padding:6,marginTop:4}} />
          </div>
          <div style={{marginBottom:16}}>
            <label>Descripción:</label>
            <textarea required value={citaData.descripcion} onChange={e => setCitaData(d => ({...d, descripcion: e.target.value}))} style={{width:'100%',padding:6,marginTop:4}} rows={3} />
          </div>
          <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Agendando...' : 'Agendar'}</button>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}
