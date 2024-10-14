import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  int,
  varchar,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const USERS_ROLE = {
  ROOT: "ROOT" as const,
  ADMIN: "ADMIN" as const,
  USER: "USER" as const,
};

export const users = mysqlTable(
  "users",
  {
    id: int().autoincrement().notNull(),
    fullname: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: mysqlEnum(["ROOT", "ADMIN", "USER"]).default("USER").notNull(),
  },
  (table) => {
    return {
      usersId: primaryKey({ columns: [table.id], name: "users_id" }),
    };
  }
);

export const posts = mysqlTable(
  "posts",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: varchar({ length: 255 }),
    createdAt: datetime({ mode: "string", fsp: 3 })
      .default(sql`(now(3))`)
      .notNull(),
    updatedAt: datetime({ mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      postsId: primaryKey({ columns: [table.id], name: "posts_id" }),
    };
  }
);
