import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount } = body;

    if (!customerName || !customerPhone || !shippingAddress || !items || !totalAmount) {
      return NextResponse.json({ error: "Missing checkout parameters" }, { status: 400 });
    }

    const totalFormatted = `৳ ${parseFloat(totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    const newOrder = await sql`
      INSERT INTO orders (
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        total_amount,
        total_formatted,
        items
      )
      VALUES (
        ${customerName},
        ${customerEmail || ""},
        ${customerPhone},
        ${shippingAddress},
        ${totalAmount},
        ${totalFormatted},
        ${JSON.stringify(items)}::jsonb
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, order: newOrder[0] });
  } catch (error) {
    console.error("Order insertion error:", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}