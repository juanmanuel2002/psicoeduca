import { sendPurchaseEmail, sendInscripcionClase } from '../../utils/sendEmail.js';
import { getCitas, createCita, updateCita, deleteCita } from './dbController.js';
import express from 'express';
import { getCursos, getRecursos, createCurso, createRecurso, updateRecursos, updateCursos, asignarRecursosCursos, getCursosUsuario, getRecursosUsuario, getCitasUsuario} from './dbController.js';
import { firebaseAuthMiddleware, firebaseAdminMiddleware } from '../middleware/firebaseAuthMiddleware.js';
import { logAfterResponse } from '../../utils/logService.js'

const router = express.Router();

router.get('/cursos', getCursos);
router.get('/recursos', getRecursos);
router.post('/cursos', logAfterResponse('createCurso'), firebaseAdminMiddleware, createCurso );
router.put('/cursos', logAfterResponse('actualizarCurso'), firebaseAdminMiddleware, updateCursos);
router.post('/recursos', logAfterResponse('createRecurso'), firebaseAdminMiddleware, createRecurso);
router.put('/recursos', logAfterResponse('actualizarRecurso'), firebaseAdminMiddleware, updateRecursos);
router.post('/asignar-recursos-cursos', logAfterResponse('asignarRecursosCursos'), firebaseAuthMiddleware, asignarRecursosCursos);

router.get('/citas', firebaseAuthMiddleware, getCitas);
router.post('/citas', logAfterResponse('createCita'), firebaseAuthMiddleware, createCita);
router.put('/citas', firebaseAdminMiddleware, updateCita);
router.delete('/citas', firebaseAdminMiddleware, deleteCita);

router.get('/usuario/:uid/cursos', firebaseAuthMiddleware, getCursosUsuario);
router.get('/usuario/:uid/recursos', firebaseAuthMiddleware, getRecursosUsuario);
router.get('/usuario/:uid/citas', firebaseAuthMiddleware, getCitasUsuario);

router.post('/send-email', sendPurchaseEmail);
router.post('/inscripcion-clase', logAfterResponse('inscribirClase'), firebaseAuthMiddleware, sendInscripcionClase);

export default router;
