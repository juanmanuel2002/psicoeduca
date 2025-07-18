import express from 'express';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword, 
  getLoginWithGoogle
} from './firebaseAuthController.js';

const router = express.Router();

router.post('/login', loginWithEmail);
router.post('/register', registerWithEmail);
router.post('/login/google', loginWithGoogle);
router.post('/reset-password', resetPassword);
router.get('/login/google', getLoginWithGoogle);

export default router;
