import { Context } from "hono";

// Error Handler
export const errorHandler = (c: Context) => {
  return c.json(
    {
      success: false,
      message: c.error?.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : c.error?.stack,
    },
    500
  );
};

// Not Found Handler
export const notFound = (c: Context) => {
  return c.json(
    {
      success: false,
      code: "NOT_FOUND",
      message: `Not Found - [${c.req.method}] ${c.req.url}`,
    },
    404
  );
};
