import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { UserController } from "../controllers";
import { isAdmin, protect } from "../middlewares/authMiddlewares";
import { USERS_ROLE } from "../../drizzle/schema";

//initialize router
type Variables = { jwtPayload: any };
const userRoute = new Hono<{ Variables: Variables }>();

const registerSchema = z.object({
  fullname: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(USERS_ROLE),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

//register user
userRoute.post(
  "/",

  zValidator("json", registerSchema, (result, c) => {
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
  UserController.createUser
);

//login user
userRoute.post(
  "/login",
  zValidator("json", loginSchema, (result, c) => {
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
  UserController.loginUser
);

// get all users
userRoute.get("/", protect, isAdmin, UserController.getUsers);

export const UserRoute = userRoute;
