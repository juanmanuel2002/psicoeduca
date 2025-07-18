import express from 'express';
import cors from 'cors';
import firebaseAuthRoutes from './services/firebase/auth/login/firebaseAuthRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('', firebaseAuthRoutes);

app.get('/', (req, res) => {
  res.send('API de Psicoeduca funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
