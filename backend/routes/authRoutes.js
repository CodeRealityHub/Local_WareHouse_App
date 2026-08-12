import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { createUser, updateUserProfile } from "../controllers/userControllers.js";
import {
    loginUser,
    getUserProfile,
    logoutUser
} from "../controllers/authControllers.js"; // Or wherever updateUserProfile is located

const router = express.Router();

// Public Routes
router.post("/register", createUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile); // Added this route to handle profile updates
router.post("/logout", authMiddleware, logoutUser);

export default router;