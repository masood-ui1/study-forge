import express from 'express';
import { getStats, updateUsername, getPublicProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/stats', verifyToken, getStats);
router.put('/username', verifyToken, updateUsername);
router.get('/public/:username', getPublicProfile);

export default router;
