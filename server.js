import express from 'express';
import cors from 'cors';
import firebaseAuthRoutes from './services/firebase/auth/login/firebaseAuthRoutes.js';
import dbRoutes from './services/firebase/db/dbRoutes.js';
import getTokenRoutes from './services/firebase/auth/getTokenRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas 
app.use('', firebaseAuthRoutes);
app.use('', dbRoutes);
app.use('', getTokenRoutes);

app.get('/', (req, res) => {
  res.send('API de Psicoeduca funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
