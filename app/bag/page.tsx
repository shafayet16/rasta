"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function BagPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const router = useRouter();

  const shippingFee = cartTotal > 0 ? 120 : 0;
  const grandTotal = cartTotal + shippingFee;

  const formatTaka = (amount: number) =>
    `৳ ${amount.toLocaleString("en-BD")}.00`;

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white pt-24 sm:pt-32 pb-32 sm:pb-24 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* HEADER SECTION */}
        <header className="border-b border-black/10 pb-5 mb-8 sm:mb-12 flex items-end justify-between">
          <div>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.3em] uppercase text-black/40 block mb-1">
              YOUR SELECTION
            </span>
            <h1 className="text-lg sm:text-2xl font-medium tracking-[0.15em] uppercase text-black flex items-center gap-2">
              SHOPPING BAG
              <span className="text-black/30 font-normal text-base sm:text-xl">
                ({cartCount})
              </span>
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-[9px] sm:text-[10px] font-medium tracking-[0.25em] uppercase text-black/60 hover:text-black transition-colors underline underline-offset-8"
          >
            ← CONTINUE SHOPPING
          </Link>
        </header>

        {cart.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-24 sm:py-32 text-center space-y-6">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-black/40">
              Your shopping bag is currently empty.
            </p>
            <div>
              <Link
                href="/shop"
                className="inline-block border border-black bg-black px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-transparent hover:text-black"
              >
                EXPLORE CATALOG
              </Link>
            </div>
          </div>
        ) : (
          /* RESPONSIVE LAYOUT CONTAINER */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* LEFT: SHOPPING BAG ITEMS (8 COLS ON DESKTOP) */}
            <div className="lg:col-span-8">
              {/* TABLE HEADER - DESKTOP ONLY */}
              <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-black/10 pb-3 text-[9px] font-medium tracking-[0.25em] uppercase text-black/40">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-3 text-center">QUANTITY</div>
                <div className="col-span-3 text-right">TOTAL</div>
              </div>

              {/* ITEMS LIST */}
              <div className="divide-y divide-black/10 border-b border-black/10 sm:border-b-0">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center"
                  >
                    {/* PRODUCT IMAGE & INFO */}
                    <div className="sm:col-span-6 flex items-center gap-4 sm:gap-6">
                      <Link
                        href={`/product/${item.productId}`}
                        className="shrink-0 relative aspect-[3/4] w-20 sm:w-24 bg-neutral-50/50 border border-black/5"
                      >
                        <Image
                          src={item.image || "/hero.png"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 80px, 96px"
                          className="object-contain p-1.5 transition-transform duration-500 hover:scale-105"
                        />
                      </Link>

                      <div className="flex flex-col justify-center space-y-1">
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-[11px] sm:text-[12px] font-medium tracking-[0.15em] uppercase text-black hover:opacity-60 transition-opacity leading-tight"
                        >
                          {item.name}
                        </Link>
                        
                        {item.size && (
                          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-black/40">
                            SIZE: {item.size}
                          </span>
                        )}

                        <span className="text-[10px] font-medium text-black/60 sm:hidden pt-1">
                          {formatTaka(item.price)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[9px] font-medium tracking-[0.2em] uppercase text-black/40 hover:text-red-600 transition-colors underline underline-offset-4 w-max pt-2 sm:pt-1"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>

                    {/* QUANTITY SELECTOR */}
                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-center mt-2 sm:mt-0">
                      <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-black/40 sm:hidden">
                        QTY:
                      </span>
                      <div className="flex items-center border border-black/15 text-[10px]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* PRICE TOTAL */}
                    <div className="sm:col-span-3 text-right hidden sm:block">
                      <span className="text-[11px] sm:text-[12px] font-medium tracking-wider text-black">
                        {formatTaka(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY SIDEBAR (4 COLS ON DESKTOP, STICKY) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="border border-black/10 p-6 sm:p-8 bg-white space-y-6">
                <h2 className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] text-black border-b border-black/10 pb-4">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3.5 text-[10px] sm:text-[11px] font-normal tracking-wide text-black/70">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="text-black font-medium">{formatTaka(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ESTIMATED SHIPPING (BD)</span>
                    <span className="text-black font-medium">{formatTaka(shippingFee)}</span>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4 flex justify-between text-[11px] sm:text-[12px] font-medium tracking-[0.15em] text-black">
                  <span>TOTAL</span>
                  <span>{formatTaka(grandTotal)}</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/checkout")}
                    className="w-full border border-black bg-black py-4 text-[10px] font-medium tracking-[0.3em] uppercase text-white transition-all duration-300 hover:bg-transparent hover:text-black cursor-pointer"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>

                {/* POLICY ASSURANCE */}
                <div className="border-t border-black/10 pt-5 space-y-2.5 text-[9px] tracking-[0.15em] text-black/40 uppercase">
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-black/40" />
                    <span>CASH ON DELIVERY AVAILABLE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-black/40" />
                    <span>7-DAY EASY RETURN & EXCHANGE</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR (< 1024px) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10 px-6 py-3.5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[8px] font-medium tracking-[0.2em] uppercase text-black/40 block">
              TOTAL (INCL. SHIPPING)
            </span>
            <span className="text-[12px] font-semibold text-black tracking-wider">
              {formatTaka(grandTotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="bg-black text-white text-[9px] font-medium tracking-[0.25em] uppercase px-6 py-3 hover:bg-black/80 transition-colors"
          >
            CHECKOUT
          </button>
        </div>
      )}
    </main>
  );
}