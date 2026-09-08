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
    <div className="w-full max-w-[540px] mx-auto bg-white border border-black/10 p-8 sm:p-12 space-y-10 selection:bg-black selection:text-white">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-black/10 text-black mb-2">
          <svg 
            className="w-4 h-4 text-black" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4.5 12.75l6 6 9-13.5" 
            />
          </svg>
        </div>
        
        <div>
          <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-black/40 block mb-1">
            CONFIRMATION
          </span>
          <h1 className="text-lg sm:text-xl font-medium tracking-[0.2em] text-black uppercase">
            ORDER PLACED
          </h1>
        </div>

        <p className="text-[11px] text-black/60 font-normal max-w-xs mx-auto leading-relaxed tracking-wide">
          Thank you for your purchase. Your order has been recorded and is currently being processed.
        </p>
      </div>

      {/* ORDER DETAILS PANEL */}
      <div className="border border-black/10 p-6 space-y-6 bg-white">
        
        {/* ORDER REFERENCE & COPY */}
        <div className="flex items-center justify-between pb-5 border-b border-black/10">
          <div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-black/40 font-medium block mb-1">
              ORDER REFERENCE
            </span>
            <span className="text-[12px] font-medium tracking-wider text-black">
              {orderId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`text-[9px] font-medium tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-300 ${
              copied 
                ? "bg-black border-black text-white" 
                : "border-black/20 hover:border-black text-black/60 hover:text-black"
            }`}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>

        {/* STATUS & DELIVERY META */}
        <div className="grid grid-cols-2 gap-4 text-[10px] tracking-wide pt-1">
          <div>
            <span className="text-black/40 uppercase text-[8px] tracking-[0.2em] block mb-1.5 font-medium">
              STATUS
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-black font-medium tracking-widest uppercase text-[9px]">
                PROCESSING
              </span>
            </div>
          </div>

          <div>
            <span className="text-black/40 uppercase text-[8px] tracking-[0.2em] block mb-1.5 font-medium">
              ESTIMATED DELIVERY
            </span>
            <span className="text-black font-medium tracking-wider text-[10px]">
              2–4 BUSINESS DAYS
            </span>
          </div>
        </div>

      </div>

      {/* VERIFICATION NOTICE */}
      <div className="border-l border-black pl-4 py-0.5 space-y-1">
        <p className="text-[9px] uppercase text-black tracking-[0.25em] font-medium">
          VERIFICATION NOTE
        </p>
        <p className="text-[11px] leading-relaxed text-black/60 font-normal">
          Our team will reach out via mobile to verify your delivery location before dispatching your package.
        </p>
      </div>

      {/* ACTION CTA */}
      <div className="pt-2">
        <Link
          href="/shop"
          className="w-full inline-block text-center border border-black bg-black hover:bg-transparent text-white hover:text-black text-[10px] font-medium uppercase tracking-[0.3em] py-4 transition-all duration-300"
        >
          CONTINUE SHOPPING
        </Link>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-6 sm:p-12 pt-28 pb-20">
      <Suspense 
        fallback={
          <div className="text-[10px] font-medium text-black/40 uppercase tracking-[0.3em] animate-pulse">
            LOADING CONFIRMATION...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}