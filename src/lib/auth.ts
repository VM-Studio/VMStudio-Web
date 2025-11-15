import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: { userId: number }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // jwt.verify can return string or object; we expect an object with userId
    if (typeof decoded === "object" && decoded && "userId" in decoded) {
      return decoded as { userId: number };
    }
    return null;
  } catch {
    return null;
  }
}
