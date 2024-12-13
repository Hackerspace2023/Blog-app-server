import Blog from "../Models/blogModel.js";
import asyncHandler from "../Middlewares/asyncHandler.js";

// Create a new blog post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  // Validate input
  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  // Create the blog post
  const newPost = new Blog({
    title,
    content,
    tags,
    author: req.user._id, // Assuming the user is authenticated
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: savedPost,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to create post!");
  }
});

export { createPost };
