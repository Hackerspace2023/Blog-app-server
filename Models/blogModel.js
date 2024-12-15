import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } 
);

// Blog Schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    image: {
      type: String,
      required: true
  },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
      default: [],
    },
    comments: [commentSchema], 
    bookmarks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
      default: [],
    },
  },
  {
    timestamps: true, 
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
