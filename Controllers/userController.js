import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../Middlewares/asyncHandler.js";
import generateToken from "../Utils/createToken.js";

// Create User Function
const createUser = asyncHandler(async (req, res) => {
  const { name,username, email, password } = req.body;

  if (!name || !email || !password || !username) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    generateToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//login for registered accounts
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      generateToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      });
      return;
    } else {
      res.status(404).json({ message: "Invalid Password" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

//user logout
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export { createUser, loginUser, logoutCurrentUser };
