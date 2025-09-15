import admin from 'firebase-admin';
import config from '../../../config.js';
import { isSlotAvailable, createCalendarEvent } from '../../utils/googleCalendar.js';

export async function getCitas(req, res) {
  try {
    const citasSnapshot = await admin.firestore().collection('citas').get();
    const citas = citasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCita(req, res) {
  if (!req.user || !req.user.uid) {
    const response = { error: 'No autorizado. Debes iniciar sesión.' }
    res.locals.responseBody = response;
    return res.status(401).json(response);
  }

  const { fecha, hora, usuarioId, descripcion } = req.body;
  const calendarId = config.google.calendarId; 

  // Rango de tiempo del evento
  const start = new Date(`${fecha}T${hora}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora después

  
  const disponible = await isSlotAvailable(calendarId, start.toISOString(), end.toISOString());
  if (!disponible) {
    const response = { error: 'El horario ya está ocupado en el calendario.' }
    res.locals.responseBody = response;
    return res.status(409).json(response);
  }

  await createCalendarEvent(calendarId, {
    summary: 'Cita Psicoeduca',
    descripcion,
    start: { dateTime: start.toISOString(), timeZone: 'America/Mexico_City' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Mexico_City' },
  });

  try {

    const fechaClave = fecha.replace(/-/g, '');
    const counterRef = admin.firestore().collection('counters').doc(fechaClave);

    const consecutivo = await admin.firestore().runTransaction(async (t) => {
      const doc = await t.get(counterRef);
      let count = 1;
      if (doc.exists) {
        count = doc.data().count + 1;
      }
      t.set(counterRef, { count }, { merge: true });
      return count;
    });

    const citaId = `${fechaClave}${String(consecutivo).padStart(3, '0')}`;

    const docRef = await admin.firestore().collection('citas').add({
      fecha,
      hora,
      usuarioId,
      descripcion,
      citaId,
      createdBy: req.user.uid
    });
    const response = { id: docRef.id }
    res.locals.responseBody = response
    res.status(201).json(response);
  } catch (error) {
    const response = { error: error.message }
    res.locals.responseBody = response
    res.status(500).json(response);
  }
}

export async function updateCita(req, res) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
  const { id, ...data } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'El campo id es requerido.' });
  }
  try {
    await admin.firestore().collection('citas').doc(id).update(data);
    res.status(200).json({ message: 'Cita actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCita(req, res) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'El campo id es requerido.' });
  }
  try {
    await admin.firestore().collection('citas').doc(id).delete();
    res.status(200).json({ message: 'Cita eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCitasUsuario(req,res){
  const{ uid } = req.params;
  if (!uid) return res.status(400).json({ error: 'Falta el uid.' });
   try {
    const totalCitas = await admin.firestore().collection('citas').where('createdBy', '==', uid).get();

    if (totalCitas.empty) return res.status(200).json([]);
    const citas = totalCitas.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}