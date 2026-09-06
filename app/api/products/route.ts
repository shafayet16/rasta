import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC;`;
    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, imageUrl, description } = await request.json();

    if (!name || !price || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    const priceFormatted = `৳ ${numericPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const newProduct = await sql`
      INSERT INTO products (name, slug, price, price_formatted, images, description, in_stock)
      VALUES (${name}, ${slug}, ${numericPrice}, ${priceFormatted}, ARRAY[${imageUrl}], ${description || ""}, true)
      RETURNING *;
    `;

    return NextResponse.json({ success: true, product: newProduct[0] });
  } catch (error) {
    console.error("Insert product error:", error);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}