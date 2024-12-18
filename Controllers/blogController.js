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

const updateBlogPost = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body; 

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const blogPost = await Blog.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Ensure the current user is the author of the blog post
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this blog post" });
    }

    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;
    blogPost.tags = tags || blogPost.tags;

    const updatedBlogPost = await blogPost.save();

    res.status(200).json({
      message: "Blog post updated successfully!",
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

const searchBlogsByTitle = asyncHandler(async (req, res) => {
  const { title } = req.query; 

  if (!title) {
    res.status(400);
    throw new Error("Title is required to search for blogs!");
  }

  // Search for blogs with a matching title (case-insensitive)
  const blogs = await Blog.find({ title: { $regex: title, $options: "i" } }).populate(
    "author", 
    "username name" 
  );

  if (!blogs || blogs.length === 0) {
    res.status(404);
    throw new Error("No blogs found with the given title!");
  }

  // Return the blogs with author details
  res.status(200).json({
    message: "Blogs fetched successfully!",
    blogs: blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      tags: blog.tags,
      author: blog.author.username, 
      name: blog.author.name, 
      likes: blog.likes,
      comments: blog.comments.length,
      bookmarks: blog.bookmarks.length,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    })),
  });
});


export { createPost, addComment, toggleLike, toggleBookmark, searchBlogsByTitle, updateBlogPost };
