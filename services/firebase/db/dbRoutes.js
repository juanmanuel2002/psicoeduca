import express from 'express';
import { getCursos, getRecursos, createCurso, createRecurso, updateRecursos, updateCursos} from './dbController.js';
import { firebaseAuthMiddleware } from '../middleware/firebaseAuthMiddleware.js';

const router = express.Router();

router.get('/cursos', getCursos);
router.get('/recursos', getRecursos);
router.post('/cursos', firebaseAuthMiddleware, createCurso);
router.put('/cursos', firebaseAuthMiddleware, updateCursos);
router.post('/recursos', firebaseAuthMiddleware, createRecurso);
router.put('/recursos', firebaseAuthMiddleware, updateRecursos);


export default router;
