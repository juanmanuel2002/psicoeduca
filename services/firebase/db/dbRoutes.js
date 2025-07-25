import express from 'express';
import { getCursos, getRecursos, createCurso, createRecurso } from './dbController.js';
import { firebaseAuthMiddleware } from '../middleware/firebaseAuthMiddleware.js';

const router = express.Router();

router.get('/cursos', getCursos);
router.get('/recursos', getRecursos);
router.post('/cursos', firebaseAuthMiddleware, createCurso);
router.post('/recursos', firebaseAuthMiddleware, createRecurso);


export default router;
