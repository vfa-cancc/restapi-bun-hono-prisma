import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

//import controller
import { PostController } from "../controllers";
import { protect } from "../middlewares/authMiddlewares";

//initialize router
const posts = new Hono();

// schema validation
const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});
const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
});

// routes
posts.get(
  "/",
  zValidator("query", paginationSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: result.error.issues,
          data: null,
        },
        400
      );
    }
  }),
  (c) => PostController.getPosts(c)
);

posts.post(
  "/",
  // validate request
  protect,
  zValidator("json", postSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: result.error.issues,
          data: null,
        },
        400
      );
    }
  }),
  (c) => PostController.createPost(c)
);

posts.get("/:id", (c) => PostController.getPostById(c));

posts.patch(
  "/:id", // validate request
  protect,
  (c) => PostController.updatePost(c)
);

posts.delete(
  "/:id", // validate request
  protect,
  (c) => PostController.deletePost(c)
);

export const PostRoute = posts;
