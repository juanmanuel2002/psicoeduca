const API_URL = process.env.REACT_APP_API_URL || "";


export async function crearCita({ fecha, hora, usuarioId, descripcion }) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/citas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ fecha, hora, usuarioId, descripcion })
  });

   if (!res.ok){
    let errorMessage
    try {
      const errorData = await res.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch (err) {
      console.error('Error al parsear el mensaje de error:', err);
    }
    throw new Error(errorMessage || 'Error al crear la cita');
  } 

  return res.json();
}

export async function getCitas() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/citas`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok){
    let errorMessage
    try {
      const errorData = await res.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch (err) {
      console.error('Error al parsear el mensaje de error:', err);
    }
    throw new Error(errorMessage || 'Error al obtener citas');
  } 

  return res.json();
}
