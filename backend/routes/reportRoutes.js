import express from 'express';
import { getReportMetrics } from '../controllers/reportControllers.js';
import { getDashboardMetrics } from '../controllers/reportControllers.js';

const router = express.Router();

// GET /api/reports/metrics
router.get('/metrics', getReportMetrics);
router.get('/dashboard', getDashboardMetrics);

export default router;