import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// 1. DELETE PRODUCT
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM products
      WHERE id::text = ${id} OR slug = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

// 2. GET SINGLE PRODUCT (Matches by ID, UUID, or Slug)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Casts id to text so PostgreSQL safely matches integer, string/UUID, or slug
    const product = await sql`
      SELECT * FROM products 
      WHERE id::text = ${id} OR slug = ${id}
      LIMIT 1;
    `;

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product[0], { status: 200 });
  } catch (error: any) {
    console.error("Fetch single product error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// 3. UPDATE PRODUCT
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, price, description, inStock, sizes, images } = body;

    const numericPrice = parseFloat(price);
    const priceFormatted = `৳ ${numericPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    const updatedProduct = await sql`
      UPDATE products
      SET 
        name = ${name},
        price = ${numericPrice},
        price_formatted = ${priceFormatted},
        description = ${description || ""},
        in_stock = ${inStock},
        sizes = ${sizes},
        images = ${images}
      WHERE id::text = ${id} OR slug = ${id}
      RETURNING *;
    `;

    if (updatedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found for update" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct[0] }, { status: 200 });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}