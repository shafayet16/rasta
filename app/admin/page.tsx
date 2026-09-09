"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  price_formatted?: string;
  price?: number;
  images: string[];
  in_stock: boolean;
}

interface PaymentDetails {
  senderPhone?: string;
  sender_phone?: string;
  transactionId?: string;
  transaction_id?: string;
  trx_id?: string;
}

interface Order {
  id: string;
  customer_name?: string;
  name?: string;
  phone?: string;
  customer_phone?: string;
  email?: string;
  address?: string;
  shipping_address?: string;
  city?: string;
  subtotal?: number;
  shipping_fee?: number;
  total?: number | string;
  payment_method?: string;
  payment_details?: PaymentDetails | string;
  sender_phone?: string;
  transaction_id?: string;
  status?: string;
  created_at?: string;
  items?: OrderItem[] | string;
}

export default function AdminDashboard() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

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

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      alert("Failed to update status");
    }
  }

  async function deleteOrder(orderId: string) {
    if (!confirm(`Delete order ${orderId}?`)) return;
    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } else {
      alert("Failed to delete order");
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete product");
    }
  }

  const parseItems = (items: any): OrderItem[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (typeof items === "string") {
      try {
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const parsePaymentDetails = (order: Order): PaymentDetails => {
    let details: PaymentDetails = {};

    if (order.payment_details) {
      if (typeof order.payment_details === "string") {
        try {
          details = JSON.parse(order.payment_details);
        } catch {
          details = {};
        }
      } else {
        details = order.payment_details;
      }
    }

    return {
      senderPhone:
        details.senderPhone ||
        details.sender_phone ||
        order.sender_phone ||
        "N/A",
      transactionId:
        details.transactionId ||
        details.transaction_id ||
        details.trx_id ||
        order.transaction_id ||
        "N/A",
    };
  };

  const formatTaka = (amount?: number | string) => {
    if (amount == null || isNaN(Number(amount))) return "৳0";
    return `৳${Number(amount).toLocaleString("en-BD")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans pt-32 px-12 text-xs font-mono tracking-widest uppercase">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-6 py-4 border-b border-white/10 sm:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] font-medium tracking-[0.2em] uppercase">
          <Link href="/admin" className="text-[13px] font-bold tracking-[0.3em]">
            RASTA // ADMIN
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" target="_blank" className="border border-white/20 px-3 py-1 text-white/80 hover:text-white">
              Live Store ↗
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24 sm:px-12">
        {/* HEADER & TAB SWITCHER */}
        <div className="border-b border-black/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[12px] font-medium tracking-[0.25em] uppercase text-black/50">
              CONSOLE MANAGEMENT
            </h1>
            <p className="text-xl font-bold tracking-tight uppercase">
              {activeTab === "orders" ? `Incoming Orders (${orders.length})` : `Catalog Products (${products.length})`}
            </p>
          </div>

          <div className="flex items-center gap-2 border border-black p-1 bg-black/5 font-mono text-xs">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-bold uppercase transition-colors ${
                activeTab === "orders" ? "bg-black text-white" : "text-black/60 hover:text-black"
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 font-bold uppercase transition-colors ${
                activeTab === "products" ? "bg-black text-white" : "text-black/60 hover:text-black"
              }`}
            >
              Products ({products.length})
            </button>
          </div>
        </div>

        {/* ORDERS VIEW */}
        {activeTab === "orders" && (
          <section>
            <div className="border border-black/10 divide-y divide-black/10 text-xs font-mono">
              {orders.length === 0 ? (
                <div className="p-6 text-black/40 font-sans">No incoming orders found.</div>
              ) : (
                orders.map((order) => {
                  const customerName = order.customer_name || order.name || "N/A";
                  const phone = order.phone || order.customer_phone || "N/A";
                  const currentStatus = order.status || "pending";
                  const itemList = parseItems(order.items);
                  const payInfo = parsePaymentDetails(order);

                  return (
                    <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-black/[0.02]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-black">{order.id}</span>
                          <span className="text-black/30">|</span>
                          <span className="font-medium text-black">{customerName}</span>
                          <span className="text-black/50 text-[11px]">({phone})</span>
                        </div>
                        <p className="text-black/50 text-[11px]">
                          {itemList.length} ITEM(S) — {formatTaka(order.total)} | METHOD:{" "}
                          <span className="font-bold text-black uppercase">{order.payment_method || "COD"}</span>
                        </p>
                        {payInfo.transactionId !== "N/A" && (
                          <p className="text-[10px] text-black/70 bg-neutral-100 border border-black/10 px-2 py-0.5 inline-block font-mono">
                            TRXID: <span className="font-bold text-black uppercase">{payInfo.transactionId}</span> | SENDER: {payInfo.senderPhone}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-black text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 border border-black cursor-pointer"
                        >
                          <option value="pending">PENDING</option>
                          <option value="processing">PROCESSING</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="delivered">DELIVERED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 border border-black text-black hover:bg-black hover:text-white transition-colors text-[10px] uppercase tracking-wider font-bold"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 text-[10px] uppercase font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* PRODUCTS VIEW */}
        {activeTab === "products" && (
          <section>
            <div className="flex justify-end mb-4">
              <Link
                href="/admin/new"
                className="bg-black px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-white hover:bg-black/80 transition-colors"
              >
                + Add New Product
              </Link>
            </div>

            <div className="border border-black/10 divide-y divide-black/10 text-[11px] tracking-wider uppercase font-mono">
              {products.length === 0 ? (
                <div className="p-4 text-black/40 font-sans">No products found.</div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 hover:bg-black/[0.02]">
                    <div className="flex items-center gap-4">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover border border-black/10" />
                      )}
                      <div>
                        <p className="font-bold text-black">{product.name}</p>
                        <p className="text-black/60">
                          {product.price_formatted || formatTaka(product.price)}
                        </p>
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
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 underline underline-offset-4 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* INSPECT ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black pb-4">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-black/50 block">Order Specification</span>
                <h2 className="font-mono text-xl font-black uppercase">{selectedOrder.id}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="font-mono text-xs uppercase font-bold border border-black px-3 py-1 hover:bg-black hover:text-white"
              >
                Close [X]
              </button>
            </div>

            {/* CUSTOMER & SHIPPING INFO */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-black/10 pb-4">
              <div>
                <span className="text-black/40 uppercase text-[10px] block">Customer</span>
                <p className="font-bold text-black">{selectedOrder.customer_name || selectedOrder.name}</p>
                <p className="text-black/60">{selectedOrder.phone || selectedOrder.customer_phone}</p>
                <p className="text-black/60">{selectedOrder.email || "No Email Provided"}</p>
              </div>
              <div>
                <span className="text-black/40 uppercase text-[10px] block">Shipping Address</span>
                <p className="font-bold text-black">{selectedOrder.address || selectedOrder.shipping_address}</p>
                <p className="text-black/60">{selectedOrder.city || "N/A"}</p>
              </div>
            </div>

            {/* PAYMENT VERIFICATION SECTION */}
            <div className="border-b border-black/10 pb-4 text-xs font-mono bg-neutral-50 p-4 border border-black/10">
              <span className="text-black/40 uppercase text-[10px] block font-bold mb-2">Payment Verification</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-black/50 text-[10px] block">Method:</span>
                  <p className="font-bold text-black uppercase">{selectedOrder.payment_method || "COD"}</p>
                </div>
                <div>
                  <span className="text-black/50 text-[10px] block">Sender Phone:</span>
                  <p className="font-bold text-black">{parsePaymentDetails(selectedOrder).senderPhone}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-black/5">
                  <span className="text-black/50 text-[10px] block">Transaction ID (TrxID):</span>
                  <p className="font-mono font-bold text-black text-sm uppercase tracking-wider">
                    {parsePaymentDetails(selectedOrder).transactionId}
                  </p>
                </div>
              </div>
            </div>

            {/* ORDERED ITEMS LIST */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-black/50 block">Purchased Items</span>
              <div className="border border-black/10 divide-y divide-black/10 font-mono text-xs">
                {parseItems(selectedOrder.items).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-black/50 text-[10px]">
                        Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                      </p>
                    </div>
                    <span className="font-bold">{formatTaka(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FINANCIAL BREAKDOWN */}
            <div className="border-t border-black pt-4 font-mono text-xs space-y-1 text-right">
              <p className="text-black/60">Shipping Fee: <span className="font-bold">{formatTaka(selectedOrder.shipping_fee || 0)}</span></p>
              <p className="text-lg font-black uppercase text-black pt-2">
                Total Amount: {formatTaka(selectedOrder.total)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}