import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function PATCH(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams.id;
    const sql = neon(process.env.DATABASE_URL!);
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status required" }, { status: 400 });
    }

    await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PATCH /api/orders/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed to update status." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams.id;
    const sql = neon(process.env.DATABASE_URL!);

    await sql`DELETE FROM orders WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/orders/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete order." }, { status: 500 });
  }
}