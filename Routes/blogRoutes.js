import express from "express";
import {
  createPost,
  addComment,
  toggleLike,
  toggleBookmark,
  searchBlogsByTitle,
  updateBlogPost,
getUserBlogPosts,
  deleteBlogPost,
  
} from "../Controllers/blogController.js";
import { authenticate } from "../Middlewares/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// Route to create a new post
router.route("/").post(authenticate, createPost);
router.post("/:id/comments", authenticate, addComment);
router.post("/:postId/like", authenticate, toggleLike);
router.post("/:postId/bookmark", authenticate, toggleBookmark);
router.get("/search", authenticate, searchBlogsByTitle);
router
  .route("/:id")
  .put(authenticate, updateBlogPost)
  .delete(authenticate, deleteBlogPost);
router.get("/postlist", authenticate,getUserBlogPosts);
export default router;
