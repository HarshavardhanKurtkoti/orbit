import { NextResponse } from "next/server";
import { getNeonSql } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getNeonSql();
    const result = await sql`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as pg_version,
        (SELECT count(*)::int FROM information_schema.tables WHERE table_schema = 'public') as table_count
    `;

    return NextResponse.json({
      status: "healthy",
      service: "neon-postgres",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: "unhealthy",
        service: "neon-postgres",
        error: message,
      },
      { status: 500 }
    );
  }
}
