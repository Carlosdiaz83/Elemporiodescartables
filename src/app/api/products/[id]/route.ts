import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const product = await db.product.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.features !== undefined && { features: body.features }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.stock !== undefined && { stock: body.stock }),
      ...(body.status !== undefined && { status: body.status }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  await db.product.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
