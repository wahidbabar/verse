import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "./user.model";

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

interface JWTPayload {
  id: string;
  username: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY must be defined in environment variables");
}

export const loginAdmin = async (
  req: LoginRequest,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const admin = await User.findOne({ username, role: "admin" });

    if (!admin) {
      res.status(404).json({ message: "Admin not found!" });
      return;
    }

    const isValidPassword = await admin.comparePassword(password);

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid password!" });
      return;
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as admin:", error);
    res.status(401).json({ message: "Failed to login as admin" });
  }
};

// Optional: Add more authentication methods
export const registerUser = async (
  req: LoginRequest,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const user = new User({
      username,
      password,
      role: "user", // Default role
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Failed to register user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};
