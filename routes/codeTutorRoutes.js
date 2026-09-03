import express from 'express';
import { askQuestion, getHistory } from '../controllers/codeTutorController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, askQuestion);
router.get('/', verifyToken, getHistory);

export default router;
