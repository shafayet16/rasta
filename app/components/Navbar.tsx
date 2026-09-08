"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  function scrollToProducts() {
    setMenuOpen(false);
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#shop";
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/95 via-black/60 to-transparent px-5 py-5 text-white sm:px-12 sm:py-8 transition-all">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between">
          {/* Left Navigation (Desktop) */}
          <nav className="hidden items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase sm:flex">
            <button
              onClick={scrollToProducts}
              className="transition-opacity duration-300 hover:opacity-50"
            >
              Shop
            </button>
            <Link
              href="/#home"
              className="transition-opacity duration-300 hover:opacity-50"
            >
              Home
            </Link>
            <a
              href="#contact"
              className="transition-opacity duration-300 hover:opacity-50"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase sm:hidden focus:outline-none"
            aria-label="Toggle navigation"
          >
            <div className="relative flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`h-[1px] w-full bg-white transition-all duration-300 ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1px] w-full bg-white transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-[1px] w-full bg-white transition-all duration-300 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </div>
            <span className="font-mono text-[10px]">{menuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* Center Brand Text Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-xl tracking-[0.35em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-3xl"
          >
            RASTA
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center gap-5 text-[11px] font-medium tracking-[0.2em] uppercase sm:gap-8">
            <button
              type="button"
              className="hidden transition-opacity duration-300 hover:opacity-50 md:block"
            >
              BDT ৳
            </button>
            <button
              type="button"
              className="hidden transition-opacity duration-300 hover:opacity-50 sm:block"
            >
              Search
            </button>
            <Link
              href="/bag"
              className="transition-opacity duration-300 hover:opacity-50 font-mono text-[11px]"
            >
              Bag ({cartCount})
            </Link>
          </nav>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-xl transition-all duration-500 sm:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col justify-between px-8 pt-28 pb-12 font-mono text-xs tracking-[0.25em] uppercase text-white">
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            <button
              onClick={scrollToProducts}
              className="py-5 text-left transition-colors hover:text-neutral-400"
            >
              Shop Collection
            </button>
            <Link
              href="/#home"
              onClick={() => setMenuOpen(false)}
              className="py-5 text-left transition-colors hover:text-neutral-400"
            >
              Home
            </Link>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="py-5 text-left transition-colors hover:text-neutral-400"
            >
              Contact
            </a>
            <Link
              href="/bag"
              onClick={() => setMenuOpen(false)}
              className="py-5 text-left transition-colors hover:text-neutral-400"
            >
              Shopping Bag ({cartCount})
            </Link>
          </div>

          <div className="space-y-2 text-[10px] text-neutral-500 tracking-widest">
            <p>Region: Bangladesh (BDT ৳)</p>
            <p>© RASTA Official Store</p>
          </div>
        </nav>
      </div>
    </>
  );
}