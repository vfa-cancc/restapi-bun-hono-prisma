import db from "./index";
import { users } from "../../drizzle/schema";

async function seed() {
  await db
    .insert(users)
    .values([
      {
        email: "cancc@vitalify.asia",
        fullname: "CanCC",
        password:
          "$2b$04$KAlQ0luHqGQt74yDbzSjKuUtNvWoU5L1GeZuAIju8HOyZIWTqGvHe", // 11111111
        role: "ROOT",
      },
    ])
    .execute();
}

seed();
