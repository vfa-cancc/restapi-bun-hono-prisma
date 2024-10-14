import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(connection);

export default db;
