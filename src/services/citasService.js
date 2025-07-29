const API_URL = process.env.REACT_APP_API_URL || "";
const token = localStorage.getItem('token');

export async function crearCita({ fecha, hora, usuarioId, descripcion }) {
  const res = await fetch(`${API_URL}/citas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ fecha, hora, usuarioId, descripcion })
  });
  if (!res.ok) throw new Error('No se pudo agendar la cita');
  return res.json();
}

