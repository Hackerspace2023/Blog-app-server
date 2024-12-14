import Blog from "../Models/blogModel.js";
import asyncHandler from "../Middlewares/asyncHandler.js";

// Create a new blog post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  const newPost = new Blog({
    title,
    content,
    tags: tags || [],
    author: req.user._id,
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

const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;

  if (!comment) {
    res.status(400);
    throw new Error("Comment is required!");
  }

  const blogPost = await Blog.findById(postId);
  if (!blogPost) {
    res.status(404);
    throw new Error("Blog post not found!");
  }

  const newComment = {
    name: req.user.name,
    user: req.user._id,   
    text: comment,        
    createdAt: new Date() 
  };

  try {
    blogPost.comments.push(newComment);
    await blogPost.save();

    res.status(201).json({
      message: "Comment added successfully!",
      comments: blogPost.comments,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to add comment!");
  }
});


// Toggle like on a blog post
const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const blogPost = await Blog.findById(postId);
  if (!blogPost) {
    res.status(404);
    throw new Error("Blog post not found!");
  }

  const likeIndex = blogPost.likes.findIndex(
    (id) => id.toString() === req.user._id.toString()
  );

  if (likeIndex === -1) {
    blogPost.likes.push(req.user._id);
    res.status(200).json({ message: "Blog post liked!" });
  } else {
    blogPost.likes.splice(likeIndex, 1);
    res.status(200).json({ message: "Blog post unliked!" });
  }

  try {
    await blogPost.save();
  } catch (error) {
    res.status(500);
    throw new Error("Failed to toggle like!");
  }
});

// Bookmark a blog post
const toggleBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const blogPost = await Blog.findById(postId);
  if (!blogPost) {
    res.status(404);
    throw new Error("Blog post not found!");
  }

  const bookmarkIndex = blogPost.bookmarks.findIndex(
    (id) => id.toString() === req.user._id.toString()
  );

  if (bookmarkIndex === -1) {
    blogPost.bookmarks.push(req.user._id);
    res.status(200).json({ message: "Blog post bookmarked!" });
  } else {
    blogPost.bookmarks.splice(bookmarkIndex, 1);
    res.status(200).json({ message: "Blog post removed from bookmarks!" });
  }

  try {
    await blogPost.save();
  } catch (error) {
    res.status(500);
    throw new Error("Failed to toggle bookmark!");
  }
});

export { createPost, addComment, toggleLike, toggleBookmark };
