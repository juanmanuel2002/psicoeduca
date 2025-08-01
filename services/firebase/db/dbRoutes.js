import { sendPurchaseEmail } from '../../utils/sendEmail.js';
import { getCitas, createCita, updateCita, deleteCita } from './dbController.js';
import express from 'express';
import { getCursos, getRecursos, createCurso, createRecurso, updateRecursos, updateCursos, asignarRecursosCursos} from './dbController.js';
import { firebaseAuthMiddleware } from '../middleware/firebaseAuthMiddleware.js';

const router = express.Router();

router.get('/cursos', getCursos);
router.get('/recursos', getRecursos);
router.post('/cursos', firebaseAuthMiddleware, createCurso);
router.put('/cursos', firebaseAuthMiddleware, updateCursos);
router.post('/recursos', firebaseAuthMiddleware, createRecurso);
router.put('/recursos', firebaseAuthMiddleware, updateRecursos);
router.post('/asignar-recursos-cursos',firebaseAuthMiddleware, asignarRecursosCursos);

router.get('/citas', firebaseAuthMiddleware, getCitas);
router.post('/citas', firebaseAuthMiddleware, createCita);
router.put('/citas', firebaseAuthMiddleware, updateCita);
router.delete('/citas', firebaseAuthMiddleware, deleteCita);

router.post('/send-email', sendPurchaseEmail);

export default router;
