import express from 'express';
import { generatePlan, getPlans } from '../controllers/studyPlanController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, generatePlan);
router.get('/', verifyToken, getPlans);

export default router;
