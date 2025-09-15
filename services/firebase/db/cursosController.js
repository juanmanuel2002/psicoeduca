import admin from 'firebase-admin';
import config from '../../../config.js';
import { db } from '../setup.js';
import { collection, getDocs } from 'firebase/firestore';

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


export async function getCursos(req, res) {
  try {
    const cursosSnapshot = await getDocs(collection(db, 'cursos'));
    const cursos = cursosSnapshot.docs.map(doc => {
      const { archivoDriveId, ...rest } = doc.data(); 
        return { id: doc.id, ...rest };
    });

    res.status(200).json(cursos);
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

  const cursos = Array.isArray(req.body) ? req.body : [req.body];
  const results = [];

  for (const curso of cursos) {
    const extraFields = Object.keys(curso).filter(
      key => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
      results.push({ error: `Campos no permitidos: ${extraFields.join(', ')}` });
      continue;
    }
    const { costo, descripcion, descripcionLarga, nombre, tipo, imagen, type, archivoDriveId, estado} = curso;
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
      results.push({ error: 'Datos inválidos o incompletos' });
      continue;
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
      results.push({ id: docRef.id });
    } catch (error) {
      results.push({ error: error.message });
    }
  }
  res.locals.responseBody = results;
  res.status(201).json(results);
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