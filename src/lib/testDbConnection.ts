// lib/testDbConnection.ts
import db from "@/lib/db/db";

async function testDbConnection() {
  try {
    const result = await db.$queryRaw`SELECT 1`;
    console.log("Database connection test successful:", result);
  } catch (error) {
    console.error("Database connection test failed:", error);
  }
}

testDbConnection();