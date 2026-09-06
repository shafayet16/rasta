import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// 1. GET ALL PRODUCTS (Used by shop page & visiting /api/products in browser)
export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC;
    `;

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// 2. CREATE NEW PRODUCT (Used by admin form)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body provided" }, { status: 400 });
    }

    const { name, price, description, sizes, images } = body;

    if (!name || !price || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Name, price, and at least one image are required." },
        { status: 400 }
      );
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: "Invalid numeric price" }, { status: 400 });
    }

    const priceFormatted = `৳ ${numericPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now()}`;

    const finalSizes: string[] = Array.isArray(sizes) && sizes.length > 0 ? sizes : ["S", "M", "L", "XL"];
    const finalImages: string[] = images;

    const newProduct = await sql`
      INSERT INTO products (
        name,
        slug,
        price,
        price_formatted,
        images,
        description,
        sizes,
        in_stock
      )
      VALUES (
        ${name},
        ${slug},
        ${numericPrice},
        ${priceFormatted},
        ${finalImages},
        ${description || ""},
        ${finalSizes},
        true
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, product: newProduct[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Neon DB Insert Error:", error);
    return NextResponse.json(
      { error: error?.detail || error?.message || "Database insert error" },
      { status: 500 }
    );
  }
}