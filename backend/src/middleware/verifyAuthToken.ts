import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

interface JwtPayload {
  userId: string;
  role: string;
  [key: string]: any;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Fetch JWKS keys manually
const fetchFirebasePublicKeys = async () => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Firebase public keys", error);
    throw error;
  }
};

const verifyAuthToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "No authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Decode token to get key ID
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    // Fetch public keys
    const publicKeys = await fetchFirebasePublicKeys();

    // Verify token with appropriate public key
    jwt.verify(
      token,
      publicKeys[decoded?.header?.kid!],
      {
        algorithms: ["RS256"],
        audience: process.env.FIREBASE_PROJECT_ID,
        issuer: `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,
      },
      (err, verifiedToken) => {
        if (err) {
          console.error("Token verification error:", err);
          res.status(401).json({
            message:
              err.name === "TokenExpiredError"
                ? "Token expired"
                : "Invalid token",
          });
          return;
        }

        req.user = verifiedToken as JwtPayload;
        next();
      }
    );
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

export default verifyAuthToken;
