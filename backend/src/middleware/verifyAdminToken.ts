import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  userId: string;
  role: string;
  [key: string]: any;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "JWT_SECRET_KEY is not defined in environment variables. Please check your .env file."
    );
  }
  return secret;
};

const verifyAdminToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const JWT_SECRET = getJwtSecret();

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res
        .status(401)
        .json({ message: "Access Denied. No authorization header found" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Access Denied. No token provided" });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ message: "Token has expired" });
        } else {
          res.status(403).json({ message: "Invalid token" });
        }
        return;
      }

      req.user = decoded as JwtPayload;
      next();
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during authentication" });
  }
};

export default verifyAdminToken;
