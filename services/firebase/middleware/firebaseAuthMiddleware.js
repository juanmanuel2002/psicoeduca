import config from '../../../config.js';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(config.firebaseAdmin.service))
    });
}

export async function firebaseAuthMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    req.user = null;
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
}