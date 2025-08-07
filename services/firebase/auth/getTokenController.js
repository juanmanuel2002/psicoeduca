import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../setup.js';
import config from '../../../config.js';
import axios from 'axios';

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

export async function getRefreshToken(req, res){
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken requerido' });
  }
  try {
    const key = config.firebase.apiKey
   
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${key}`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { id_token, expires_in } = response.data;

    return res.status(200).json({
      accessToken: id_token,
      expirationTime: Date.now() + parseInt(expires_in, 10) * 1000, 
    });

  } catch (error) {
    console.error('Error al refrescar token:', error?.response?.data || error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};