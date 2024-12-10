import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../Middlewares/asyncHandler.js";
import generateToken from "../Utils/createToken.js";

// Create User Function
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
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
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    generateToken(res, newUser._id);
    res
      .status(201)
      .json({ 
        _id: newUser._id,
         name: newUser.name,
          email: newUser.email });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { createUser };
