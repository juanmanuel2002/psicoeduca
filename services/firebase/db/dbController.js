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