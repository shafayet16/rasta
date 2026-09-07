"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-000000";
  const { clearCart } = useCart();
  const hasCleared = useRef(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white text-neutral-900 font-sans px-6 py-10 space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neutral-50 border border-neutral-200/80 text-neutral-900 mb-2 shadow-sm transition-transform duration-500 hover:scale-105">
          <svg 
            className="w-5 h-5 text-neutral-800" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7" 
              className="animate-draw"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold tracking-[0.2em] text-neutral-900 uppercase">
          Order Confirmed
        </h1>
        <p className="text-[13px] text-neutral-400 font-light max-w-xs mx-auto leading-relaxed">
          Your order has been placed successfully and is now being processed.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="border border-neutral-200/60 rounded-xl bg-neutral-50/30 p-6 space-y-5 backdrop-blur-[2px]">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100/80">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-mono block mb-1">
              Order Reference
            </span>
            <span className="font-mono text-sm font-medium tracking-wide text-neutral-900">
              {orderId}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 border rounded-lg transition-all duration-200 ${
              copied 
                ? "bg-neutral-900 border-neutral-900 text-white" 
                : "border-neutral-200/80 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1">
          <div>
            <span className="text-neutral-400 uppercase text-[10px] tracking-wider block mb-1">Status</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-neutral-800 font-medium">Processing</span>
            </div>
          </div>
          <div>
            <span className="text-neutral-400 uppercase text-[10px] tracking-wider block mb-1">Estimated Delivery</span>
            <span className="text-neutral-800 font-medium">2–4 Business Days</span>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="relative border-l border-neutral-900 pl-4 py-0.5 text-xs text-neutral-500 space-y-1">
        <p className="font-mono text-[10px] uppercase text-neutral-900 tracking-widest font-semibold">Note</p>
        <p className="leading-relaxed font-light">
          Our customer service team will reach out via mobile to confirm your final delivery details prior to dispatching your items.
        </p>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <Link
          href="/"
          className="w-full inline-block text-center bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 flex items-center justify-center p-6 selection:bg-neutral-900 selection:text-white">
      <Suspense fallback={<div className="font-mono text-xs text-neutral-400 uppercase tracking-widest animate-pulse">Loading order confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
