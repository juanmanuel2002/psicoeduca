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


export async function getRecursos(req, res) {
  try {
    const recursosSnapshot = await getDocs(collection(db, 'recursos'));
    const recursos = recursosSnapshot.docs.map(doc => {
      const { archivoDriveId, ...rest } = doc.data(); 
        return { id: doc.id, ...rest };
    });
    
    res.status(200).json(recursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createRecurso(req, res) {
  if (!req.user || !req.user.uid) {
    const response = {error:'No autorizado. Debes iniciar sesión.'};
    res.locals.responseBody = response
    return res.status(401).json(response);
  }
  const recursos = Array.isArray(req.body) ? req.body : [req.body];
  const results = [];

  for (const recurso of recursos) {
    const extraFields = Object.keys(recurso).filter(
      key => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
      results.push({ error: `Campos no permitidos: ${extraFields.join(', ')}` });
      continue;
    }
    const { costo, descripcion, descripcionLarga, nombre, imagen, type, archivoDriveId, estado, categoria, modalidad } = recurso;
    if (
      typeof type !== 'string' || !type.trim() ||
      typeof costo !== 'number' || isNaN(costo) ||
      typeof descripcion !== 'string' || !descripcion.trim() ||
      typeof descripcionLarga !== 'string' || !descripcionLarga.trim() ||
      typeof nombre !== 'string' || !nombre.trim() ||
      typeof imagen !== 'string' || !imagen.trim() ||
      typeof archivoDriveId !== 'string' || !archivoDriveId.trim() ||
      typeof categoria !== 'string' || !categoria.trim() ||
      typeof modalidad !== 'string' || !modalidad.trim() ||
      typeof estado !== 'string' || !estado.trim()
    ) {
      results.push({ error: 'Datos inválidos o incompletos' });
      continue;
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
        estado,
        categoria,
        modalidad,
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