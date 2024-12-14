import express from "express";
import { createPost, addComment, toggleLike, toggleBookmark } from "../Controllers/blogController.js";
import { authenticate } from "../Middlewares/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// Route to create a new post
router.post("/", authenticate, createPost);
router.post("/:id/comments", authenticate, addComment);
router.post("/:postId/like", authenticate, toggleLike);
router.post("/:postId/bookmark", authenticate, toggleBookmark);

export default router;
