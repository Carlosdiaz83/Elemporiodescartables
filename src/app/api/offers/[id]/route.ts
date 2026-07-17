import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const offer = await db.offer.update({
    where: { id },
    data: {
      ...(body.salePrice != null && { salePrice: Number(body.salePrice) }),
      ...(body.label != null && { label: body.label }),
      ...(body.sortOrder != null && { sortOrder: Number(body.sortOrder) }),
      ...(body.active != null && { active: body.active }),
    },
    include: { product: true },
  });

  return NextResponse.json(offer);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.offer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
