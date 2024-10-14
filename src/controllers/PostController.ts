import { Context } from "hono";
import { getPaginationParams } from "../utils";
import db from "../db";
import { desc, asc, count, sql, eq } from "drizzle-orm";
import { posts } from "../../drizzle/schema";

/**
 * Getting all posts
 */
export const getPosts = async (c: Context) => {
  try {
    const { page, skip, limit } = getPaginationParams(c.req.query());

    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.id))
      .limit(limit)
      .offset(skip);

    const totalPosts = await db.select({ count: count() }).from(posts);

    return c.json(
      {
        success: true,
        message: "List Data Posts!",
        pagging: {
          page: page,
          limit: limit,
          total: totalPosts[0]?.count || 0,
        },
        data: allPosts,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error getting posts: ${e}`);
  }
};

/**
 * Creating a post
 */
export async function createPost(c: Context) {
  try {
    const { title, content } = await c.req.json();
    const id = 1;
    const [newPost] = await db.insert(posts).values({
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, newPost.insertId));

    return c.json(
      {
        success: true,
        message: "Post Created Successfully!",
        data: post,
      },
      201
    );
  } catch (e: unknown) {
    throw e;
  }
}

/**
 * Getting a post by ID
 */
export async function getPostById(c: Context) {
  try {
    const postId = parseInt(c.req.param("id"));

    const post = await db.select().from(posts).where(eq(posts.id, postId));

    if (!post) {
      return c.json(
        {
          success: false,
          message: "Post Not Found!",
        },
        404
      );
    }

    return c.json(
      {
        success: true,
        message: `Detail Data Post By ID : ${postId}`,
        data: post,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error finding post: ${e}`);
  }
}

/**
 * Updating a post
 */
export async function updatePost(c: Context) {
  try {
    const postId = parseInt(c.req.param("id"));

    const { title, content } = await c.req.json();

    const [post] = await db
      .update(posts)
      .set({
        title: title,
        content: content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    if (post.affectedRows === 0) {
      return c.json({ success: false, message: "Post Not Found!" }, 404);
    }

    return c.json(
      {
        success: true,
        message: "Post Updated Successfully!",
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error updating post: ${e}`);
  }
}

/**
 * Deleting a post
 */
export async function deletePost(c: Context) {
  try {
    const postId = parseInt(c.req.param("id"));

    const deletedRows = await db.delete(posts).where(eq(posts.id, postId));

    if (deletedRows[0].affectedRows === 0) {
      return c.json(
        {
          success: false,
          message: "Post Not Found!",
        },
        404
      );
    }

    return c.json(
      {
        success: true,
        message: "Post Deleted Successfully!",
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error deleting post: ${e}`);
  }
}
