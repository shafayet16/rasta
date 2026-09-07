"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-over Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white text-black shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="text-[11px] font-medium tracking-[0.25em] uppercase">
            YOUR CART ({cart.length})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[14px] font-mono hover:opacity-50 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">
                YOUR BAG IS EMPTY
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-black/5 pb-6">
                  <div className="relative aspect-[3/4] h-24 shrink-0 bg-neutral-50 border border-black/10">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between text-[10px] tracking-wider uppercase">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-black max-w-[150px] truncate">
                          {item.name}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-black/30 hover:text-black transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="mt-1 text-black/40">SIZE: {item.size}</p>
                      <p className="mt-1 text-black/80 font-medium">
                        ৳ {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center border border-black/20 w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-black/50 hover:text-black transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-[10px] font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-black/50 hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-black/10 p-6 bg-white">
            <div className="flex justify-between text-[11px] font-medium tracking-[0.2em] uppercase">
              <span>SUBTOTAL</span>
              <span>৳ {cartTotal.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-[9px] text-black/40 tracking-wider uppercase">
              Taxes & Shipping calculated at checkout
            </p>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="mt-6 block w-full bg-black py-4 text-center text-[10px] font-medium tracking-[0.3em] uppercase text-white hover:bg-black/80 transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}