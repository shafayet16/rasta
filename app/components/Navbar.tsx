"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

interface Product {
  id: string | number;
  name: string;
  price?: number;
  price_formatted?: string;
  images?: string[];
  image?: string;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  // Search Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch products when search opens
  useEffect(() => {
    if (isSearchOpen && products.length === 0) {
      setLoading(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to load search catalog:", err))
        .finally(() => setLoading(false));
    }
  }, [isSearchOpen, products.length]);

  // Focus & prevent background scrolling
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSearchOpen]);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  function scrollToProducts() {
    setMenuOpen(false);
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#shop";
    }
  }

  const formatPrice = (product: Product) => {
    if (product.price_formatted) return product.price_formatted;
    if (product.price != null && !isNaN(Number(product.price))) {
      return `৳ ${Number(product.price).toLocaleString("en-BD")}.00`;
    }
    return "৳ 0.00";
  };

  const getPrimaryImage = (product: Product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return "/hero.png";
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/95 via-black/60 to-transparent px-5 py-5 text-white sm:px-12 sm:py-8 transition-all">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between">
          {/* Left Navigation (Desktop) */}
          <nav className="hidden items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase sm:flex">
            <button
              onClick={scrollToProducts}
              className="transition-opacity duration-300 hover:opacity-50 cursor-pointer"
            >
              SHOP
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
            className="flex items-center gap-2.5 text-[10px] font-medium tracking-[0.25em] uppercase sm:hidden focus:outline-none cursor-pointer"
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
            <span className="text-[10px] font-medium tracking-[0.2em]">
              {menuOpen ? "Close" : "Menu"}
            </span>
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
              onClick={() => setIsSearchOpen(true)}
              className="hidden transition-opacity duration-300 hover:opacity-50 sm:block cursor-pointer"
            >
              SEARCH
            </button>
            <Link
              href="/bag"
              className="transition-opacity duration-300 hover:opacity-50 text-[11px] font-medium tracking-[0.2em]"
            >
              Bag ({cartCount})
            </Link>
          </nav>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 sm:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col justify-between px-8 pt-28 pb-12">
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            <button
              onClick={scrollToProducts}
              className="py-5 text-left text-[12px] font-medium tracking-[0.25em] uppercase text-white transition-colors hover:text-white/50 cursor-pointer"
            >
              Shop
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="py-5 text-left text-[12px] font-medium tracking-[0.25em] uppercase text-white transition-colors hover:text-white/50 cursor-pointer"
            >
              Search
            </button>
            <Link
              href="/#home"
              onClick={() => setMenuOpen(false)}
              className="py-5 text-left text-[12px] font-medium tracking-[0.25em] uppercase text-white transition-colors hover:text-white/50"
            >
              Home
            </Link>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="py-5 text-left text-[12px] font-medium tracking-[0.25em] uppercase text-white transition-colors hover:text-white/50"
            >
              Contact
            </a>
            <Link
              href="/bag"
              onClick={() => setMenuOpen(false)}
              className="py-5 text-left text-[12px] font-medium tracking-[0.25em] uppercase text-white transition-colors hover:text-white/50"
            >
              Shopping Bag ({cartCount})
            </Link>
          </div>

          <div className="space-y-2 text-[9px] font-medium text-white/40 tracking-[0.25em] uppercase">
            <p>REGION: BANGLADESH (BDT ৳)</p>
            <p>© RASTA OFFICIAL STORE</p>
          </div>
        </nav>
      </div>

      {/* CENTERED POP-UP MODAL */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setIsSearchOpen(false)}
        >
          {/* MODAL CARD */}
          <div
            className="relative flex max-h-[85vh] w-full max-w-[620px] flex-col rounded-2xl bg-white p-6 shadow-2xl text-black overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SEARCH INPUT HEADER */}
            <div className="relative flex items-center border-b border-gray-100 pb-4">
              <svg
                className="h-4 w-4 text-gray-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="ml-3 w-full bg-transparent text-[13px] font-medium text-black outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* RESULTS GRID AREA */}
            <div className="mt-5 overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 text-center text-[11px] text-gray-400">
                  Loading...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-[11px] text-gray-400">
                  No products found
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                  {filteredProducts.map((product) => {
                    const mainImage = getPrimaryImage(product);
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="group flex flex-col text-left"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-transparent">
                          <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-contain object-center mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h2 className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-black group-hover:underline">
                          {product.name}
                        </h2>
                        <p className="mt-0.5 text-[10px] font-medium text-gray-500">
                          {formatPrice(product)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}