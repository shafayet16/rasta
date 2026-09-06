"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price_formatted: string;
  images: string[];
  in_stock: boolean;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  total_formatted: string;
  order_status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (orderRes.ok) setOrders(await orderRes.json());
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete product");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        {/* ADMIN NAVBAR */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-6 py-4 border-b border-white/10 sm:px-12">
          <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] font-medium tracking-[0.2em] uppercase">
            <Link href="/admin" className="text-[13px] font-bold tracking-[0.3em]">
              RASTA // ADMIN
            </Link>
          </div>
        </header>
        <div className="pt-32 px-12 text-[11px] font-mono tracking-widest uppercase">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ADMIN NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-6 py-4 border-b border-white/10 sm:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] font-medium tracking-[0.2em] uppercase">
          <Link href="/admin" className="text-[13px] font-bold tracking-[0.3em] text-white">
            RASTA // ADMIN
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/admin"
              className={`transition-colors ${
                pathname === "/admin"
                  ? "text-white underline underline-offset-4"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/new"
              className={`transition-colors ${
                pathname === "/admin/new"
                  ? "text-white underline underline-offset-4"
                  : "text-white/60 hover:text-white"
              }`}
            >
              + New Product
            </Link>
            <Link
              href="/"
              target="_blank"
              className="border border-white/20 px-3 py-1.5 text-white/80 transition-colors hover:border-white hover:text-white"
            >
              Live Store ↗
            </Link>
          </nav>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24 sm:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-6">
          <h1 className="text-[12px] font-medium tracking-[0.25em] uppercase">
            CATALOG OVERVIEW
          </h1>
          <Link
            href="/admin/new"
            className="bg-black px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-white hover:bg-black/80 transition-colors"
          >
            + Add New Product
          </Link>
        </div>

        {/* PRODUCTS SECTION */}
        <section className="mt-10">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/50 mb-4">
            Catalog ({products.length})
          </h2>
          <div className="border border-black/10 divide-y divide-black/10 text-[11px] tracking-wider uppercase">
            {products.length === 0 ? (
              <div className="p-4 text-black/40">No products found.</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 hover:bg-black/[0.02]">
                  <div className="flex items-center gap-4">
                    {product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover border border-black/10" />
                    )}
                    <div>
                      <p className="font-medium text-black">{product.name}</p>
                      <p className="text-black/50">{product.price_formatted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/edit/${product.id}`}
                      className="text-black/60 hover:text-black underline underline-offset-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ORDERS SECTION */}
        <section className="mt-16">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/50 mb-4">
            Orders ({orders.length})
          </h2>
          <div className="border border-black/10 divide-y divide-black/10 text-[11px] tracking-wider uppercase">
            {orders.length === 0 ? (
              <div className="p-4 text-black/40">No incoming orders yet.</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-black">{order.customer_name} ({order.customer_phone})</p>
                    <p className="text-black/50">{order.shipping_address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total_formatted}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-black/5 border border-black/10">
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}