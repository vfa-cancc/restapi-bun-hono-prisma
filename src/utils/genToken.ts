import { sign } from "hono/jwt";

const JWT_SECRET = Bun.env.JWT_SECRET || "";

export const genToken = async (user: {
  id: number;
  email: string;
  role: any;
}) => {
  // Create payload
  const payload = {
    id: user.id,
    sub: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };

  // Create JWT token
  const token = await sign(payload, JWT_SECRET, "HS256");
  return token;
};
