const API_URL = process.env.REACT_APP_API_URL || "";

// Servicio para enviar email de solicitud
export async function sendEmailSolicitud({ correo, nombre }) {
  const body = {
    correo,
    nombre,
    tipo: 'solicitud'
  };
  const res = await fetch(`${API_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Error al enviar solicitud');
  return await res.json();
}

export async function sendEmailCompra({ correo, nombre, cart }) {
  const body = {
    correo,
    nombre,
    items:[cart],
    tipo: 'compra'
  };
  const res = await fetch(`${API_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Error al enviar solicitud');
  return await res.json();
}