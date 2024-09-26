import { Context } from "hono";
import prisma from "../../prisma/client";
import { USERS_ROLE } from "@prisma/client";
import { genToken } from "../utils";

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
    const userExists = await prisma.users.findFirst({ where: { email } });
    if (userExists) {
      return c.json({ message: "User already exists" }, 400);
    }

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    // Create user
    const user = await prisma.users.create({
      data: {
        fullname,
        email,
        password: bcryptHash,
        role,
      },
    });

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

  const user = await prisma.users.findFirst({ where: { email } });
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
  const users = await prisma.users.findMany();

  return c.json({ users });
};
