import express from 'express';
import { getFirebaseToken } from './getTokenController.js';

const router = express.Router();

router.post('/token', getFirebaseToken);

export default router;
