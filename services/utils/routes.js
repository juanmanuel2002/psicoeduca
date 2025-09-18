import express from 'express';
import {generateImage} from './generateImage.js';

const router = express.Router();

router.post('/generate-image', generateImage);

export default router;