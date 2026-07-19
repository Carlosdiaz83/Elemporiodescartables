import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const offers = await db.offer.findMany({
    where: { active: true },
    include: { product: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(offers);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, salePrice, label, sortOrder } = body;

  if (!productId || salePrice == null) {
    return NextResponse.json({ error: "productId and salePrice required" }, { status: 400 });
  }

  const offer = await db.offer.create({
    data: {
      productId,
      salePrice: Number(salePrice),
      label: label || "OFERTA",
      sortOrder: sortOrder != null ? Number(sortOrder) : 0,
    },
    include: { product: true },
  });

  return NextResponse.json(offer, { status: 201 });
}
