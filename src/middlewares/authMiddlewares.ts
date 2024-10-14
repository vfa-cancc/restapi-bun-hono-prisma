import { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import { USERS_ROLE } from "../../drizzle/schema";

export const protect = async (c: Context, next: Next) => {
  const jwtMiddleware = jwt({
    secret: Bun.env.JWT_SECRET || "",
  });
  return jwtMiddleware(c, next);
};

// Check if user is admin
export const isAdmin = async (c: Context, next: Next) => {
  const user = c.get("jwtPayload");
  if (
    (user && user.role === USERS_ROLE.ADMIN) ||
    user.role === USERS_ROLE.ROOT
  ) {
    await next();
  } else {
    c.status(403);
    throw new Error("Access denied. Admin only");
  }
};

export const isRoot = async (c: Context, next: Next) => {
  const user = c.get("jwtPayload");
  if (user.role === USERS_ROLE.ROOT) {
    await next();
  } else {
    c.status(403);
    throw new Error("Access denied. ROOT only");
  }
};
