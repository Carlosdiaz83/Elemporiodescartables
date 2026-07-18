import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("includeAll");

  let products;

  if (includeAll && session.user?.role === "admin") {
    products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } else {
    products = await db.product.findMany({
      where: { status: "activo" },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();

  const product = await db.product.create({
    data: {
      name: body.name,
      description: body.description,
      features: body.features,
      category: body.category,
      price: body.price ?? 0,
      imageUrl: body.imageUrl,
      stock: body.stock ?? 0,
      status: body.status ?? "borrador",
    },
  });

  return NextResponse.json(product, { status: 201 });
}
