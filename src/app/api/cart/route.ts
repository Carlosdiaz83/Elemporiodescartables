import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const items = await db.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { productId, quantity } = await request.json();

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  if (quantity > product.stock) {
    return NextResponse.json(
      { error: "Stock insuficiente" },
      { status: 400 }
    );
  }

  const existing = await db.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  let item;
  if (existing) {
    item = await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(existing.quantity + quantity, product.stock) },
      include: { product: true },
    });
  } else {
    item = await db.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity: Math.min(quantity, product.stock),
      },
      include: { product: true },
    });
  }

  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { productId, quantity } = await request.json();

  if (quantity <= 0) {
    await db.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
    return NextResponse.json({ deleted: true });
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  const item = await db.cartItem.update({
    where: { userId_productId: { userId: session.user.id, productId } },
    data: { quantity: Math.min(quantity, product.stock) },
    include: { product: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { productId } = await request.json();

  if (productId) {
    await db.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
  } else {
    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    });
  }

  return NextResponse.json({ deleted: true });
}
