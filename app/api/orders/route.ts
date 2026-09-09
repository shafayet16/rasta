import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const orders = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `;
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch orders." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await req.json();

    const { customer, items, subtotal, shippingFee, total, paymentMethod, paymentDetails } = body;

    const fullNameValue = customer?.fullName || customer?.name || customer?.customer_name;
    const phoneValue = customer?.phone || customer?.phoneNumber || customer?.phone_number;
    const addressValue = customer?.address || customer?.shipping_address;

    if (!fullNameValue || !phoneValue || !addressValue || !items?.length) {
      return NextResponse.json({ error: "Missing required order information." }, { status: 400 });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    // 1. Ensure table structure exists with payment verification columns
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        items JSONB NOT NULL,
        subtotal NUMERIC NOT NULL,
        shipping_fee NUMERIC NOT NULL,
        total NUMERIC NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        payment_details JSONB,
        sender_phone TEXT,
        transaction_id TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Safely add missing columns for existing tables & adjust constraints
    try {
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_details JSONB;`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS sender_phone TEXT;`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;`;
      await sql`ALTER TABLE orders ALTER COLUMN id DROP DEFAULT;`;
      await sql`ALTER TABLE orders ALTER COLUMN id TYPE VARCHAR(50) USING id::text;`;
      await sql`ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;`;
      await sql`ALTER TABLE orders ALTER COLUMN email DROP NOT NULL;`;
      await sql`ALTER TABLE orders ALTER COLUMN customer_phone DROP NOT NULL;`;
      await sql`ALTER TABLE orders ALTER COLUMN phone DROP NOT NULL;`;
      await sql`ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;`;
    } catch {
      // Ignore non-fatal migration warnings
    }

    const customerEmail = customer?.email?.trim() || "N/A";
    const senderPhone = paymentDetails?.senderPhone || null;
    const transactionId = paymentDetails?.transactionId || null;

    await sql`
      INSERT INTO orders (
        id, customer_name, phone, email, address, city, 
        items, subtotal, shipping_fee, total, payment_method,
        payment_details, sender_phone, transaction_id
      )
      VALUES (
        ${orderId},
        ${fullNameValue},
        ${phoneValue},
        ${customerEmail},
        ${addressValue},
        ${customer.city || "N/A"},
        ${JSON.stringify(items)},
        ${Number(subtotal) || 0},
        ${Number(shippingFee) || 0},
        ${Number(total) || 0},
        ${paymentMethod || "COD"},
        ${paymentDetails ? JSON.stringify(paymentDetails) : null},
        ${senderPhone},
        ${transactionId}
      )
    `;

    return NextResponse.json({ success: true, orderId });
  } catch (err: any) {
    console.error("Order error:", err);
    return NextResponse.json({ error: err.message || "Failed to place order." }, { status: 500 });
  }
}