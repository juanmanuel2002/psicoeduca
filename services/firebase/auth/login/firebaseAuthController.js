import { auth } from '../../setup.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCustomToken,
} from 'firebase/auth';
import config from '../../../../config.js';
import admin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(config.google.clientId);

export async function loginWithEmail(req, res) {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const clientesSnap = await admin.firestore().collection('usuarios').where('email', '==', email).get();
    let cliente = null;
    if (!clientesSnap.empty) {
      cliente = clientesSnap.docs[0].data();
      cliente.id = clientesSnap.docs[0].id;
    }
    res.status(200).json({ user, cliente });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function registerWithEmail(req, res) {
  const { email, password, name } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await admin.firestore().collection('usuarios').add({
      email,
      name,
      uid: user.uid,
      createdAt: new Date()
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export async function getLoginWithGoogle(req, res) {
  try{
    const clientId = config.google.clientId;
    const encoded = Buffer.from(clientId).toString('base64');
    res.json({ clientId: encoded });}
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginWithGoogle(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token de Google no proporcionado." });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(payload.email);
    } catch (e) {
      userRecord = await admin.auth().createUser({
        email: payload.email,
        displayName: payload.name,
        photoURL: payload.picture,
        emailVerified: payload.email_verified,
      });
    }

    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    const userCredential = await signInWithCustomToken(auth, customToken);
    payload.stsTokenManager = userCredential.user.stsTokenManager;

    res.status(200).json({ user: payload});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function resetPassword(req, res) {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
