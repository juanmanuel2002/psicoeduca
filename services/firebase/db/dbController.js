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
    const docRef = await admin.firestore().collection('citas').add({
      fecha,
      hora,
      usuarioId,
      descripcion,
      createdBy: req.user.uid
    });
    const response = { id: docRef.id }
    res.locals.responseBody = response
    res.status(201).json();
  } catch (error) {
    const response = { error: error.message }
    res.locals.responseBody = response
    res.status(500).json();
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
    const response = {error:'No autorizado. Debes iniciar sesión.'};
    res.locals.responseBody = response
    return res.status(401).json(response);
  }

  const extraFields = Object.keys(req.body).filter(
    key => !allowedFields.includes(key)
  );

  if (extraFields.length > 0) {
    const response = { error: `Campos no permitidos: ${extraFields.join(', ')}` };
    res.locals.responseBody = response;
    return res.status(400).json(response);
  }

  const { costo, descripcion, descripcionLarga, nombre, tipo, imagen, type, archivoDriveId, estado} = req.body;

  if (
    typeof type !== 'string' || !type.trim() ||
    typeof costo !== 'number' || isNaN(costo) ||
    typeof descripcion !== 'string' || !descripcion.trim() ||
    typeof descripcionLarga !== 'string' || !descripcionLarga.trim() ||
    typeof nombre !== 'string' || !nombre.trim() ||
    typeof tipo !== 'string' || !tipo.trim() ||
    typeof imagen !== 'string' || !imagen.trim() ||
    typeof archivoDriveId !== 'string' || !archivoDriveId.trim() ||
    typeof estado !== 'string' || !estado.trim()
  ) {
    const response = { error: 'Datos inválidos o incompletos' };
    res.locals.responseBody = response;
    return res.status(400).json(response);
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
    const response = { id: docRef.id };
    res.locals.responseBody = response;
    res.status(201).json(response);
  } catch (error) {
    const response = { error: error.message };
    res.locals.responseBody = response;
    res.status(500).json(response);
  }
}

export async function createRecurso(req, res) {
  if (!req.user || !req.user.uid) {
    const response = {error:'No autorizado. Debes iniciar sesión.'};
    res.locals.responseBody = response
    return res.status(401).json(response);
  }
   const extraFields = Object.keys(req.body).filter(
    key => !allowedFields.includes(key)
  );

  if (extraFields.length > 0) {
    const response = { error: `Campos no permitidos: ${extraFields.join(', ')}` };
    res.locals.responseBody = response;
    return res.status(400).json(response);
  }
  const { costo, descripcion, descripcionLarga, nombre, imagen, type, archivoDriveId } = req.body;

   if (
    typeof type !== 'string' || !type.trim() ||
    typeof costo !== 'number' || isNaN(costo) ||
    typeof descripcion !== 'string' || !descripcion.trim() ||
    typeof descripcionLarga !== 'string' || !descripcionLarga.trim() ||
    typeof nombre !== 'string' || !nombre.trim() ||
    typeof imagen !== 'string' || !imagen.trim() ||
    typeof archivoDriveId !== 'string' || !archivoDriveId.trim()
  ) {
    const response = { error: 'Datos inválidos o incompletos' };
    res.locals.responseBody = response;
    return res.status(400).json(response);
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
    const response = { id: docRef.id };
    res.locals.responseBody = response;
    res.status(201).json(response);
  } catch (error) {
    const response = { error: error.message };
    res.locals.responseBody = response;
    res.status(500).json(response);
  }
}

export async function updateRecursos(req, res) {
  if (!req.user || !req.user.uid) {
    const response = { error: 'No autorizado. Debes iniciar sesión.' }
    res.locals.responseBody = response;
    return res.status(401).json(response);
  }

  const recursos = req.body;
  if (!Array.isArray(recursos)) {
    const response = { error: 'El cuerpo debe ser un array de recursos.' }
    res.locals.responseBody = response;
    return res.status(400).json(response);
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
    const response = { message: 'Recursos actualizados correctamente.' }
    res.locals.responseBody = response;
    res.status(200).json(response);

  } catch (error) {
    const response = { error: error.message }
    res.locals.responseBody = response;
    res.status(500).json(response);
  }
}

export async function updateCursos(req, res) {
  if (!req.user || !req.user.uid) {
    const response = { error: 'No autorizado. Debes iniciar sesión.' }
    res.locals.responseBody = response;
    return res.status(401).json(response);
  }

  const cursos = req.body;
  if (!Array.isArray(cursos)) {
    const response = { error: 'El cuerpo debe ser un array de cursos.' }
    res.locals.responseBody = response;
    return res.status(400).json(response);
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
  
    const response = { message: 'Cursos actualizados correctamente.' }
    res.locals.responseBody = response;
    res.status(200).json(response);

  } catch (error) {
    const response = { error: error.message }
    res.locals.responseBody = response;
    res.status(500).json(response);
  }
}

export async function asignarRecursosCursos(req, res) {
  const { items, email } = req.body;
  if (!email || !Array.isArray(items)) {
    const response = { error: 'Email e items son requeridos.' }
    res.locals.responseBody = response;
    return res.status(400).json(response);
  }
  try {
    const usuariosSnap = await admin.firestore().collection('usuarios').where('email', '==', email).get();
    if (usuariosSnap.empty) {
      const response = { error: 'Usuario no encontrado.' }
      res.locals.responseBody = response;
      return res.status(404).json(response);
    }
    const usuarioRef = usuariosSnap.docs[0].ref;
    
    const recursosIds = items.filter(i => i.type === 'recurso').map(i => i.id);
    const cursosIds = items.filter(i => i.type === 'curso').map(i => i.id);
    
    await usuarioRef.set({
      recursos: admin.firestore.FieldValue.arrayUnion(...recursosIds),
      cursos: admin.firestore.FieldValue.arrayUnion(...cursosIds)
    }, { merge: true });

    const response = { message: 'Recursos y cursos asignados correctamente.' }
    res.locals.responseBody = response;
    res.status(200).json(response);
  } catch (error) {
    const response = { error: error.message };
    res.locals.responseBody = response;
    res.status(500).json(response);
  }
}

export async function getCursosUsuario(req, res) {
  const { uid } = req.params;
  if (!uid) return res.status(400).json({ error: 'Falta el uid.' });
  try {
    const usuariosSnap = await admin.firestore().collection('usuarios').where('uid', '==', uid).get();
    if (usuariosSnap.empty) return res.status(404).json({ error: 'Usuario no encontrado.' });
    const usuario = usuariosSnap.docs[0].data();
    const cursosIds = usuario.cursos || [];
    if (!cursosIds.length) return res.status(200).json([]);
    const cursosSnap = await admin.firestore().collection('cursos').where(admin.firestore.FieldPath.documentId(), 'in', cursosIds).get();
    const cursos = cursosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRecursosUsuario(req, res) {
  const { uid } = req.params;
  if (!uid) return res.status(400).json({ error: 'Falta el uid.' });
  try {
    const usuariosSnap = await admin.firestore().collection('usuarios').where('uid', '==', uid).get();
    if (usuariosSnap.empty) return res.status(404).json({ error: 'Usuario no encontrado.' });
    const usuario = usuariosSnap.docs[0].data();
    const recursosIds = usuario.recursos || [];
    if (!recursosIds.length) return res.status(200).json([]);
    const recursosSnap = await admin.firestore().collection('recursos').where(admin.firestore.FieldPath.documentId(), 'in', recursosIds).get();
    const recursos = recursosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(recursos);
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