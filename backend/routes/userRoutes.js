import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  getUserProfile
} from "../controllers/userControllers.js";

const router = express.Router();

// Public Route
router.post("/register", createUser);

// Profile Route
router.put("/profile", authMiddleware, updateUserProfile);
router.get("/profile", authMiddleware, getUserProfile);
// Protected Routes
router.get("/", authMiddleware, getUsers);

router.get("/:id", authMiddleware, getUserById);

router.put("/:id", authMiddleware, updateUser);

router.delete("/:id", authMiddleware, deleteUser);

export default router;