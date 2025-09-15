import admin from 'firebase-admin';
import { google } from 'googleapis';
import config from '../../../config.js';

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

const oAuth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.google.refreshToken });

async function getDriveFileBuffer(fileId) {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

export async function downloadRecurso(req, res) {
  try {
    const { collection, id } = req.params;

    const docRef = admin.firestore().collection(collection).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send('Recurso no encontrado');
    }

    const recurso = docSnap.data();
    const archivoDriveId = recurso.archivoDriveId;

    if (!archivoDriveId) {
      return res.status(400).send('Recurso sin archivo');
    }

    const buffer = await getDriveFileBuffer(archivoDriveId);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${recurso.nombre || 'archivo'}.pdf"`
    );
    res.setHeader('Content-Type', 'application/pdf');

    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
