import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { products } = await request.json();

  if (!Array.isArray(products) || products.length === 0) {
    return NextResponse.json(
      { error: "No se proporcionaron productos" },
      { status: 400 }
    );
  }

  const created = [];
  const errors = [];

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    const name = typeof item === "string" ? item.trim() : item.name?.trim();

    if (!name) {
      errors.push({ index: i, error: "Nombre vacío" });
      continue;
    }

    try {
      const product = await db.product.create({
        data: {
          name,
          description: null,
          features: null,
          price: 0,
          imageUrl: null,
          stock: 0,
          status: "borrador",
        },
      });
      created.push(product);
    } catch (err) {
      errors.push({ index: i, name, error: "Error al crear" });
    }
  }

  return NextResponse.json({
    created: created.length,
    errors: errors.length,
    errorDetails: errors,
  });
}
