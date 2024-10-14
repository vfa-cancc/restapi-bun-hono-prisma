import { Context } from "hono";
import { USERS_ROLE } from "@prisma/client";
import { genToken, getPaginationParams } from "../utils";
import db from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * @api {post} /users Create User
 * @apiGroup Users
 * @access Public
 */
export const createUser = async (c: Context) => {
  const { fullname, email, password, role } = await c.req.json();

  // check roles
  const validRoles = Object.values(USERS_ROLE);
  if (!validRoles.includes(role)) {
    return c.json({ success: false, message: "Invalid role" }, 400);
  }

  try {
    // Check for existing user
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (userExists.length) {
      return c.json({ success: false, message: "User already exists" }, 400);
    }

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    // Create user
    await db.insert(users).values({
      fullname,
      email,
      password: bcryptHash,
      role,
    });

    const [user] = await db.select().from(users).where(eq(users.email, email));

    return c.json(
      {
        success: true,
        message: "User registered successfully!",
        data: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
        },
      },
      201
    );
  } catch (error) {
    return c.json({ message: "Error registering user" }, 500);
  }
};

/**
 * @api {post} /users/login Login User
 * @apiGroup Users
 * @access Public
 */
export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();
  if (!user) {
    c.status(401);
    throw new Error("No user found with this email");
  }
  const isMatch = await Bun.password.verify(password, user.password);

  if (!isMatch) {
    c.status(401);
    throw new Error("Invalid credentials");
  } else {
    const token = await genToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return c.json({
      success: true,
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        isAdmin: user.role === USERS_ROLE.ADMIN,
      },
      token,
      message: "User logged in successfully",
    });
  }
};

/**
 * @api {get} /users Get Users
 * @apiGroup Users
 * @access Private
 */
export const getUsers = async (c: Context) => {
  // pagination
  const { skip, limit, page } = getPaginationParams(c.req.query());
  const allUsers = await db.select().from(users).limit(limit).offset(skip);

  const allUsersMap = allUsers.map((user) => ({
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  }));

  return c.json(
    {
      success: true,
      message: "List Users!",
      pagging: {
        page: page,
        limit: limit,
      },
      data: allUsersMap,
    },
    200
  );
};
