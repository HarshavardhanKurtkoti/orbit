import { neon } from "@neondatabase/serverless";

/**
 * Returns a Neon serverless SQL query client using DATABASE_URL.
 * Compatible with Next.js edge and serverless runtimes.
 */
export function getNeonSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }
  return neon(databaseUrl);
}
