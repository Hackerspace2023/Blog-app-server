import express from "express";
import { createPost } from "../Controllers/blogController.js";
import { authenticate } from "../Middlewares/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// Route to create a new post
router.post("/", authenticate, createPost);

export default router;
