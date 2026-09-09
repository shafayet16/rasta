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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    notes: "",
    paymentMethod: "cod", // "cod" | "bkash" | "nagad"
    senderPhone: "",
    transactionId: "",
  });

  const shippingFee = formData.city.toLowerCase() === "dhaka" ? 80 : 130;
  const grandTotal = cartTotal + shippingFee;

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    if (
      (formData.paymentMethod === "bkash" || formData.paymentMethod === "nagad") &&
      (!formData.senderPhone || !formData.transactionId)
    ) {
      alert("Please provide the sender phone number and Transaction ID for digital payments.");
      return;
    }

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
          paymentMethod: formData.paymentMethod,
          paymentDetails: {
            senderPhone: formData.senderPhone,
            transactionId: formData.transactionId,
          },
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
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pt-24 sm:pt-32 pb-32 sm:pb-24 px-4 sm:px-8 lg:px-16">
      <main className="mx-auto max-w-[1400px]">
        <h1 className="border-b border-black/10 pb-5 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-black">
          CHECKOUT
        </h1>

        <form onSubmit={handleOrderSubmit} className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* LEFT: SHIPPING & PAYMENT DETAILS (7 COLS) */}
          <div className="flex flex-col gap-10 text-[10px] tracking-wider uppercase lg:col-span-7">
            <div>
              <h2 className="mb-6 text-[10px] font-medium tracking-[0.25em] text-black border-b border-black/10 pb-3">
                1. SHIPPING DETAILS
              </h2>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="mb-2 block text-black/50 text-[9px] tracking-[0.2em]">FULL NAME *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-black/20 p-3.5 text-[11px] text-black focus:border-black focus:outline-none normal-case transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-black/50 text-[9px] tracking-[0.2em]">PHONE NUMBER *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-black/20 p-3.5 text-[11px] text-black focus:border-black focus:outline-none normal-case transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-black/50 text-[9px] tracking-[0.2em]">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-black/20 p-3.5 text-[11px] text-black focus:border-black focus:outline-none normal-case transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-black/50 text-[9px] tracking-[0.2em]">DELIVERY CITY *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-black/20 p-3.5 text-[10px] text-black focus:border-black focus:outline-none uppercase transition-colors"
                  >
                    <option value="Dhaka">INSIDE DHAKA (৳ 80)</option>
                    <option value="Outside Dhaka">OUTSIDE DHAKA (৳ 130)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-black/50 text-[9px] tracking-[0.2em]">FULL STREET ADDRESS *</label>
                  <textarea
                    name="address"
                    rows={3}
                    required
                    placeholder="House/Apartment no, Road, Area"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-black/20 p-3.5 text-[11px] text-black focus:border-black focus:outline-none normal-case transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="pt-2">
              <h2 className="mb-6 text-[10px] font-medium tracking-[0.25em] text-black border-b border-black/10 pb-3">
                2. PAYMENT METHOD
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {/* CASH ON DELIVERY */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                  className={`border p-4 flex items-center justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === "cod" ? "border-black bg-neutral-50" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full border border-black ${formData.paymentMethod === "cod" ? "bg-black" : "bg-transparent"}`} />
                    <span className="font-medium text-[10px] tracking-[0.2em]">CASH ON DELIVERY (COD)</span>
                  </div>
                  <span className="text-[9px] text-black/40 tracking-[0.15em]">PAY UPON RECEIVING</span>
                </label>

                {/* BKASH */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "bkash" })}
                  className={`border p-4 flex items-center justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === "bkash" ? "border-black bg-neutral-50" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full border border-black ${formData.paymentMethod === "bkash" ? "bg-black" : "bg-transparent"}`} />
                    <span className="font-medium text-[10px] tracking-[0.2em]">BKASH</span>
                  </div>
                  <span className="text-[9px] text-pink-600 font-bold tracking-[0.15em]">01847791140</span>
                </label>

                {/* NAGAD */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "nagad" })}
                  className={`border p-4 flex items-center justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === "nagad" ? "border-black bg-neutral-50" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full border border-black ${formData.paymentMethod === "nagad" ? "bg-black" : "bg-transparent"}`} />
                    <span className="font-medium text-[10px] tracking-[0.2em]">NAGAD</span>
                  </div>
                  <span className="text-[9px] text-orange-600 font-bold tracking-[0.15em]">01706379209</span>
                </label>
              </div>

              {/* DYNAMIC PAYMENT INSTRUCTION PANEL */}
              <div className="mt-6 border border-black/20 p-5 bg-neutral-50 text-[10px] normal-case tracking-normal">
                {formData.paymentMethod === "cod" ? (
                  <div className="space-y-2">
                    <p className="font-medium uppercase tracking-[0.15em] text-black">
                      ORDER CONFIRMATION REQUIREMENT:
                    </p>
                    <p className="text-black/70 leading-relaxed">
                      To confirm your Cash on Delivery order, please send the delivery charge of{" "}
                      <span className="font-bold text-black">৳ {shippingFee}</span> via bKash (
                      <span className="font-mono text-black font-semibold">01847791140</span>) or Nagad (
                      <span className="font-mono text-black font-semibold">01706379209</span>). The remaining product amount of{" "}
                      <span className="font-bold text-black">৳ {cartTotal.toLocaleString()}</span> will be collected at delivery.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium uppercase tracking-[0.15em] text-black">
                      PAYMENT INSTRUCTIONS ({formData.paymentMethod.toUpperCase()}):
                    </p>
                    <p className="text-black/70 leading-relaxed">
                      Please send the full amount including delivery charge (<span className="font-bold text-black">৳ {grandTotal.toLocaleString()}</span>) to{" "}
                      <span className="font-bold text-black">
                        {formData.paymentMethod === "bkash" ? "01847791140 (bKash)" : "01706379209 (Nagad)"}
                      </span>.
                    </p>
                  </div>
                )}

                {/* TRANSACTION VERIFICATION INPUTS */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-black/10 pt-4">
                  <div>
                    <label className="mb-1.5 block text-black/60 text-[9px] tracking-[0.15em] uppercase font-medium">
                      SENDER PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      name="senderPhone"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                      className="w-full border border-black/20 p-3 text-[11px] text-black focus:border-black focus:outline-none bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-black/60 text-[9px] tracking-[0.15em] uppercase font-medium">
                      TRANSACTION ID (TRXID) *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      required
                      placeholder="e.g. BXA8923JK"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className="w-full border border-black/20 p-3 text-[11px] text-black focus:border-black focus:outline-none uppercase bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (5 COLS, STICKY) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="border border-black/10 p-6 sm:p-8 bg-white">
              <h2 className="border-b border-black/10 pb-4 text-[10px] font-medium tracking-[0.25em] uppercase text-black">
                ORDER SUMMARY
              </h2>

              <div className="mt-6 flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-2 divide-y divide-black/5">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex justify-between items-center text-[10px] tracking-wider uppercase">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-11 shrink-0 bg-white border border-black/10">
                        <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <p className="font-medium max-w-[140px] sm:max-w-[180px] truncate">{item.name}</p>
                        <p className="text-black/40 text-[9px] pt-0.5">SIZE: {item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-black/10 pt-4 flex flex-col gap-3 text-[10px] tracking-wider uppercase">
                <div className="flex justify-between text-black/60">
                  <span>SUBTOTAL</span>
                  <span>৳ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>SHIPPING</span>
                  <span>৳ {shippingFee}</span>
                </div>
                <div className="flex justify-between font-medium text-[11px] text-black pt-3 border-t border-black/10 tracking-[0.15em]">
                  <span>TOTAL</span>
                  <span>৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full border border-black bg-black py-4 text-[10px] font-medium tracking-[0.3em] uppercase text-white hover:bg-transparent hover:text-black transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "PROCESSING ORDER..." : "PLACE ORDER"}
              </button>

              <div className="border-t border-black/10 mt-6 pt-5 space-y-2 text-[8px] sm:text-[9px] tracking-[0.15em] text-black/40 uppercase">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-black/40" />
                  <span>VERIFICATION CALL PRIOR TO DISPATCH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-black/40" />
                  <span>7-DAY RETURN & EXCHANGE POLICY</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}