import admin from 'firebase-admin';
import config from '../../../config.js';
import { db } from '../setup.js';
import { collection, getDocs} from 'firebase/firestore';
import { isSlotAvailable, createCalendarEvent} from '../../utils/googleCalendar.js';

const allowedFields = [
  'costo',
  'descripcion',
  'descripcionLarga',
  'nombre',
  'tipo',
  'imagen',
  'type',
  'archivoDriveId',
  'estado'
];


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
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
  const { fecha, hora, usuarioId, descripcion } = req.body;
  const calendarId = config.google.calendarId; 

  // Rango de tiempo del evento
  const start = new Date(`${fecha}T${hora}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora después

  
  const disponible = await isSlotAvailable(calendarId, start.toISOString(), end.toISOString());
  if (!disponible) {
    return res.status(409).json({ error: 'El horario ya está ocupado en el calendario.' });
  }

  await createCalendarEvent(calendarId, {
    summary: 'Cita Psicoeduca',
    descripcion,
    start: { dateTime: start.toISOString(), timeZone: 'America/Mexico_City' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Mexico_City' },
  });

  try {
    const docRef = await admin.firestore().collection('citas').add({
      fecha,
      hora,
      usuarioId,
      descripcion,
      createdBy: req.user.uid
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export async function getCursos(req, res) {
  try {
    const cursosSnapshot = await getDocs(collection(db, 'cursos'));
    const cursos = cursosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRecursos(req, res) {
  try {
    const recursosSnapshot = await getDocs(collection(db, 'recursos'));
    const recursos = recursosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(recursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCurso(req, res) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }

  const extraFields = Object.keys(req.body).filter(
    key => !allowedFields.includes(key)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      error: `Campos no permitidos: ${extraFields.join(', ')}`
    });
  }

  const { costo, descripcion, descripcionLarga, nombre, tipo, imagen, type, archivoDriveId, estado} = req.body;

  if (
    typeof type !== 'boolean' ||
    typeof costo !== 'number' || isNaN(costo) ||
    typeof descripcion !== 'string' || !descripcion.trim() ||
    typeof descripcionLarga !== 'string' || !descripcionLarga.trim() ||
    typeof nombre !== 'string' || !nombre.trim() ||
    typeof tipo !== 'string' || !tipo.trim() ||
    typeof imagen !== 'string' || !imagen.trim() ||
    typeof archivoDriveId !== 'string' || !archivoDriveId.trim() ||
    typeof estado !== 'string' || !estado.trim()
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' });
  }

  try {
    const docRef = await admin.firestore().collection('cursos').add({
      costo,
      descripcion,
      descripcionLarga,
      nombre,
      tipo,
      imagen,
      type,
      archivoDriveId,
      estado,
      createdBy: req.user.uid
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createRecurso(req, res) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
   const extraFields = Object.keys(req.body).filter(
    key => !allowedFields.includes(key)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      error: `Campos no permitidos: ${extraFields.join(', ')}`
    });
  }
  const { costo, descripcion, descripcionLarga, nombre, imagen, type, archivoDriveId } = req.body;

   if (
    typeof type !== 'boolean' ||
    typeof costo !== 'number' || isNaN(costo) ||
    typeof descripcion !== 'string' || !descripcion.trim() ||
    typeof descripcionLarga !== 'string' || !descripcionLarga.trim() ||
    typeof nombre !== 'string' || !nombre.trim() ||
    typeof imagen !== 'string' || !imagen.trim() ||
    typeof archivoDriveId !== 'string' || !archivoDriveId.trim()
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' });
  }

  try {
    const docRef = await admin.firestore().collection('recursos').add({
      costo,
      descripcion,
      descripcionLarga,
      nombre,
      imagen,
      type,
      archivoDriveId,
      createdBy: req.user.uid
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateRecursos(req, res) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
  const recursos = req.body;
  if (!Array.isArray(recursos)) {
    return res.status(400).json({ error: 'El cuerpo debe ser un array de recursos.' });
  }
  try {
    const batch = admin.firestore().batch();
    recursos.forEach(recurso => {
      if (!recurso.id) return;
      const docRef = admin.firestore().collection('recursos').doc(recurso.id);
      const { id, ...data } = recurso;
      batch.update(docRef, data);
    });
    await batch.commit();
    res.status(200).json({ message: 'Recursos actualizados correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCursos(req, res) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
  const cursos = req.body;
  if (!Array.isArray(cursos)) {
    return res.status(400).json({ error: 'El cuerpo debe ser un array de cursos.' });
  }
  try {
    const batch = admin.firestore().batch();
    cursos.forEach(curso => {
      if (!curso.id) return;
      const docRef = admin.firestore().collection('cursos').doc(curso.id);
      const { id, ...data } = curso;
      batch.update(docRef, data);
    });
    await batch.commit();
    res.status(200).json({ message: 'Cursos actualizados correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function asignarRecursosCursos(req, res) {
  const { items, email } = req.body;
  if (!email || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Email e items son requeridos.' });
  }
  try {
    const usuariosSnap = await admin.firestore().collection('usuarios').where('email', '==', email).get();
    if (usuariosSnap.empty) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    const usuarioRef = usuariosSnap.docs[0].ref;
    
    const recursosIds = items.filter(i => i.type === 'recurso').map(i => i.id);
    const cursosIds = items.filter(i => i.type === 'curso').map(i => i.id);
    
    await usuarioRef.set({
      recursos: admin.firestore.FieldValue.arrayUnion(...recursosIds),
      cursos: admin.firestore.FieldValue.arrayUnion(...cursosIds)
    }, { merge: true });
    res.status(200).json({ message: 'Recursos y cursos asignados correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}