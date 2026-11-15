import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { toPublicUser } from "../utils/serializers.js";

export async function protect(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Not authenticated. Please log in.");
  }
  const token = header.slice("Bearer ".length).trim();
  let userId: string;
  try {
    userId = verifyToken(token); // throws if fake or expired
  } catch {
    throw new AppError(401, "Invalid or expired token. Please log in again.");
  }

  // The token is valid, but does the user still exist? (They could have been deleted.)
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(401, "User no longer exists");
  }

  // Attach the user to the request so later functions can use req.user
  req.user = toPublicUser(user);
  next();
}
