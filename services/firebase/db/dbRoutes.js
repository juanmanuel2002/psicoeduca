import { sendPurchaseEmail } from '../../utils/sendEmail.js';
import { getCitas, createCita, updateCita, deleteCita } from './dbController.js';
import express from 'express';
import { getCursos, getRecursos, createCurso, createRecurso, updateRecursos, updateCursos, asignarRecursosCursos} from './dbController.js';
import { firebaseAuthMiddleware } from '../middleware/firebaseAuthMiddleware.js';
import { logAfterResponse } from '../../utils/logService.js'

const router = express.Router();

router.get('/cursos', getCursos);
router.get('/recursos', getRecursos);
router.post('/cursos', logAfterResponse('createCurso'), firebaseAuthMiddleware, createCurso );
router.put('/cursos', logAfterResponse('actualizarCurso'), firebaseAuthMiddleware, updateCursos);
router.post('/recursos', logAfterResponse('createRecurso'), firebaseAuthMiddleware, createRecurso);
router.put('/recursos', logAfterResponse('actualizarRecurso'), firebaseAuthMiddleware, updateRecursos);
router.post('/asignar-recursos-cursos', logAfterResponse('asignarRecursosCursos'), firebaseAuthMiddleware, asignarRecursosCursos);

router.get('/citas', firebaseAuthMiddleware, getCitas);
router.post('/citas', logAfterResponse('createCita'), firebaseAuthMiddleware, createCita);
router.put('/citas', firebaseAuthMiddleware, updateCita);
router.delete('/citas', firebaseAuthMiddleware, deleteCita);

router.post('/send-email', sendPurchaseEmail);

export default router;
