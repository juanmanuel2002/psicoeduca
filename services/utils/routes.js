import express from 'express';
import {generateImage} from './generateImage.js';

import { sendEmailInscripcionStatus } from './sendEmail.js';

const router = express.Router();

router.post('/generate-image', generateImage);
router.post('/inscripcion-status', sendEmailInscripcionStatus);
router.post('/test', (req, res) => {
  res.json({ ok: true });
});
export default router;