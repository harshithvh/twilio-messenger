import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { generateJWTtoken } from "../utils/generateJWT.util.js";
import { hash, compare } from 'bcrypt';

const registerUser = asyncHandler(async (req, res) => {
    const { password, phone_number, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirm-password should be same',
      });
    }

    // Checking if the phone number is already registered
    const existingUser = await User.findOne({ phone_number });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    try {
      const hashedPassword = await hash(password, 10);
      const newUser = await User.create({ phone_number, password: hashedPassword });
      res.status(201).json({ message: `User registered successfully with ${newUser.phone_number}` });
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
  });

const loginUser = asyncHandler(async (req, res) => {
  const { password, phone_number } = req.body;

  // Check if user exists
  const user = await User.findOne({ phone_number });
  if (!user) {
    return res.status(404).json({
      message: 'User does not exist with this phone',
    });
  }

  try {
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Incorrect Password',
      });
    }

    // Generate token
    const token = generateJWTtoken(user._id, user.phone_number);
    return res.status(200).json({
      message: `Logged in successfully, auth token generated for ${user.phone_number}`,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const currentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});


export { registerUser, loginUser, currentUser };
