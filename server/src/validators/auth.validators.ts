import { z } from "zod";

// Username: cleaned first (trim, lowercase), then checked
const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-z0-9_]+$/, "Username can only contain letters, numbers and underscores");

// Email: cleaned first, then handed to Zod's email checker
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email is too long")
  .pipe(z.email("Please enter a valid email address"));

// Password: bcrypt only reads the first 72 bytes, so we cap it at 72
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Zod removes any extra fields the client sends
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Login only checks "non-empty string", so old accounts can still log in
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(72, "Password is too long"),
});

// TypeScript types built automatically from the schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;