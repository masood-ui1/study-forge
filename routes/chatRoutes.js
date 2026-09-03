import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);

export default router;
