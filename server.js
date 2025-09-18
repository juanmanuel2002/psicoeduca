import express from 'express';
import cors from 'cors';
import routes from './services/utils/routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas 
app.use('', routes);

app.get('/', (req, res) => {
  res.send('API de Psicoeduca funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
