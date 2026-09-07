"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    notes: "",
  });

  const shippingFee = formData.city.toLowerCase() === "dhaka" ? 80 : 130;
  const grandTotal = cartTotal + shippingFee;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          subtotal: cartTotal,
          shippingFee,
          total: grandTotal,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
        <p className="text-[11px] tracking-[0.25em] uppercase text-black/60">
          YOUR CART IS EMPTY
        </p>
        <Link
          href="/shop"
          className="mt-6 border border-black/80 px-8 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-all"
        >
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:px-12">
        <h1 className="border-b border-black/10 pb-6 text-[12px] font-medium tracking-[0.25em] uppercase">
          CHECKOUT
        </h1>

        <form onSubmit={handleOrderSubmit} className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT: SHIPPING & PAYMENT DETAILS */}
          <div className="flex flex-col gap-8 text-[11px] tracking-wider uppercase lg:col-span-7">
            <div>
              <h2 className="mb-4 text-[11px] font-medium tracking-[0.2em]">1. SHIPPING DETAILS</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-black/50">FULL NAME *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none normal-case"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-black/50">PHONE NUMBER *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none normal-case"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-black/50">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none normal-case"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-black/50">DELIVERY CITY *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none uppercase"
                  >
                    <option value="Dhaka">INSIDE DHAKA (৳ 80)</option>
                    <option value="Outside Dhaka">OUTSIDE DHAKA (৳ 130)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-black/50">FULL STREET ADDRESS *</label>
                  <textarea
                    name="address"
                    rows={3}
                    required
                    placeholder="House/Apartment no, Road, Area"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none normal-case"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="border-t border-black/10 pt-8">
              <h2 className="mb-4 text-[11px] font-medium tracking-[0.2em]">2. PAYMENT METHOD</h2>
              <div className="flex flex-col gap-3">
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex cursor-pointer items-center justify-between border p-4 transition-all ${
                    paymentMethod === "cod" ? "border-black bg-black/5" : "border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "cod"} readOnly className="h-4 w-4" />
                    <span className="font-medium">CASH ON DELIVERY (COD)</span>
                  </div>
                  <span className="text-[9px] text-black/50">PAY UPON RECEIVING</span>
                </label>

                <label
                  onClick={() => setPaymentMethod("online")}
                  className={`flex cursor-pointer items-center justify-between border p-4 transition-all ${
                    paymentMethod === "online" ? "border-black bg-black/5" : "border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "online"} readOnly className="h-4 w-4" />
                    <span className="font-medium">BKASH / NAGAD / CARDS</span>
                  </div>
                  <span className="text-[9px] text-black/50">SSLCOMMERZ GATEWAY</span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="border border-black/10 bg-neutral-50/50 p-6">
              <h2 className="border-b border-black/10 pb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
                ORDER SUMMARY
              </h2>

              <div className="mt-6 flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[10px] tracking-wider uppercase">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 bg-white border border-black/10">
                        <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <p className="font-medium max-w-[140px] truncate">{item.name}</p>
                        <p className="text-black/40">SIZE: {item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <span>৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-black/10 pt-4 flex flex-col gap-2 text-[10px] tracking-wider uppercase">
                <div className="flex justify-between text-black/60">
                  <span>SUBTOTAL</span>
                  <span>৳ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>SHIPPING</span>
                  <span>৳ {shippingFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-[11px] text-black pt-2 border-t border-black/10">
                  <span>TOTAL</span>
                  <span>৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-black py-4 text-[10px] font-medium tracking-[0.3em] uppercase text-white hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {loading ? "PROCESSING ORDER..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}