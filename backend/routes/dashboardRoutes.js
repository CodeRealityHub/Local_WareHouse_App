import express from "express";
import { getDashboardData, getReports } from "../controllers/dashboardControllers.js";

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.get('/reports', getReports);

export default router;