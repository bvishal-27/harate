import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";
import { toPublicUser } from "../utils/serializers.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validators.js";

// bcrypt "cost": higher = slower = harder for attackers to guess passwords.
// 12 is a good real-world value. In tests we use 4 so the tests run fast.
const SALT_ROUNDS = env.NODE_ENV === "test" ? 4 : 12;

// ---------- POST /api/auth/register ----------
export async function register(req: Request, res: Response): Promise<void> {
  // validateBody already cleaned and checked req.body, so this cast is safe
  const { username, email, password } = req.body as RegisterInput;

  // Is the email or username already taken?
  const emailTaken = await User.exists({ email });
  if (emailTaken) {
    throw new AppError(409, "Email is already registered");
  }
  const usernameTaken = await User.exists({ username });
  if (usernameTaken) {
    throw new AppError(409, "Username is already taken");
  }

  // Scramble the password. The result looks like "$2a$12$Kx9...".
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Save the new user. We store the HASH in the "password" field.
  const user = await User.create({ username, email, password: passwordHash });

  // Sign a token so the user is logged in right after registering
  const token = signToken(user._id.toString());

  // 201 = "Created"
  res.status(201).json({
    success: true,
    message: "Account created",
    data: { user: toPublicUser(user), token },
  });
}

// ---------- POST /api/auth/login ----------
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  // ".select('+password')" = "yes, include the hidden password hash this time"
  const user = await User.findOne({ email }).select("+password");

  // Compare the typed password with the stored hash
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  // SAME message whether the email or the password was wrong.
  // If we said "email not found", attackers could discover which emails have accounts.
  if (!user || !passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken(user._id.toString());

  res.status(200).json({
    success: true,
    message: "Logged in",
    data: { user: toPublicUser(user), token },
  });
}

// ---------- GET /api/auth/me ----------
// Runs AFTER "protect", so req.user is already filled in.
export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    // Should never happen if "protect" is on the route, but TypeScript needs the check
    throw new AppError(401, "Not authenticated. Please log in.");
  }
  res.status(200).json({ success: true, data: { user: req.user } });
}