import express from 'express';
import { getFirebaseToken, getRefreshToken } from './getTokenController.js';
import { firebaseAuthMiddleware } from '../middleware/firebaseAuthMiddleware.js';

const router = express.Router();

router.post('/token', getFirebaseToken);
router.post('/refreshToken', firebaseAuthMiddleware, getRefreshToken)

export default router;
