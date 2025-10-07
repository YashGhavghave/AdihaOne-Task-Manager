import express from 'express';
import { UserModel } from '../Model/UserCredentials.DataModel.js';

const Router = express.Router();

Router.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    await UserModel.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password, // will be hashed automatically in pre-save hook
    });

    res.status(201).json({ message: "User registered successfully. Please log in." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default Router;
