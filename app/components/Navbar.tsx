"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagCount] = useState(0);

  function scrollToProducts() {
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#shop";
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent px-6 py-6 text-white transition-all sm:px-12 sm:py-8">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between">
        {/* Left Navigation */}
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
          className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase sm:hidden"
          aria-label="Toggle navigation"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`h-[1px] w-5 bg-white transition-transform ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1px] w-5 bg-white transition-transform ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </div>
          Menu
        </button>

        {/* Center Brand Text Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.4em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-3xl"
        >
          RASTA
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-6 text-[11px] font-medium tracking-[0.2em] uppercase sm:gap-8">
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
          <button
            type="button"
            onClick={() => alert(`Your bag contains ${bagCount} item(s).`)}
            className="transition-opacity duration-300 hover:opacity-50"
          >
            Bag ({bagCount})
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="mt-6 flex flex-col border-t border-white/20 pt-6 text-[12px] tracking-[0.2em] uppercase backdrop-blur-md sm:hidden">
          <button
            onClick={() => {
              scrollToProducts();
              setMenuOpen(false);
            }}
            className="py-3 text-left"
          >
            Shop
          </button>
          <Link
            href="/#home"
            onClick={() => setMenuOpen(false)}
            className="py-3 text-left"
          >
            Home
          </Link>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="py-3 text-left"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}