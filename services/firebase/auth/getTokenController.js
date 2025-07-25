import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../setup.js';

export async function getFirebaseToken(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos.' });
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
