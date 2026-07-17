import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const user = await db.user.findFirst({
    where: { email: "admin@test.com" },
  });

  if (!user) {
    return NextResponse.json({ error: "No hay usuario admin" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}
