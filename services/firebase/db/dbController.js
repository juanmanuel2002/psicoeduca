
import admin from 'firebase-admin';
import { db } from '../setup.js';
import { collection, getDocs} from 'firebase/firestore';

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
  const { costo, descripcion, nombre, tipo, imagen } = req.body;
  try {
    const docRef = await admin.firestore().collection('cursos').add({
      costo,
      descripcion,
      nombre,
      tipo,
      imagen,
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
  const { costo, descripcion, nombre, imagen } = req.body;
  try {
    const docRef = await admin.firestore().collection('recursos').add({
      costo,
      descripcion,
      nombre,
      imagen,
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
  const recursos = req.body;
  if (!Array.isArray(recursos)) {
    return res.status(400).json({ error: 'El cuerpo debe ser un array de recursos.' });
  }
  try {
    const batch = admin.firestore().batch();
    recursos.forEach(recurso => {
      if (!recurso.id) return;
      const docRef = admin.firestore().collection('cursos').doc(recurso.id);
      const { id, ...data } = recurso;
      batch.update(docRef, data);
    });
    await batch.commit();
    res.status(200).json({ message: 'Cursos actualizados correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}