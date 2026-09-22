"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  price_formatted?: string;
  priceFormatted?: string;
  images: string[];
  image?: string;
  description?: string;
  in_stock?: boolean;
  inStock?: boolean;
}

/* SLEEK SKELETON LOADER GRID */
function ShopSkeletonGrid() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col text-left animate-pulse">
          <div className="aspect-square w-full bg-black/[0.04]" />
          <div className="mt-5 flex items-center justify-between gap-2">
            <div className="h-3 w-3/4 bg-black/[0.05]" />
            <div className="h-3 w-3 bg-black/[0.05]" />
          </div>
          <div className="mt-2 h-3 w-1/3 bg-black/[0.03]" />
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availability, setAvailability] = useState<"all" | "inStock" | "outOfStock">("all");
  const [sortBy, setSortBy] = useState<"featured" | "priceAsc" | "priceDesc">("featured");
  const [showAvailabilityMenu, setShowAvailabilityMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const availMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (availability === "inStock") {
      result = result.filter((p) => p.in_stock ?? p.inStock ?? true);
    } else if (availability === "outOfStock") {
      result = result.filter((p) => !(p.in_stock ?? p.inStock ?? true));
    }

    if (sortBy === "priceAsc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, availability, sortBy]);

  /* REFRESH SCROLLTRIGGER ONCE PRODUCTS LOAD & EXPAND PAGE HEIGHT */
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, filteredProducts]);

  /* SMOOTH GRID ENTRANCE TRANSITION */
  useEffect(() => {
    if (gridRef.current && gridRef.current.children.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 16, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    }
  }, [filteredProducts, loading]);

  /* SMOOTH DROPDOWN TRANSITIONS */
  useEffect(() => {
    if (showAvailabilityMenu && availMenuRef.current) {
      gsap.fromTo(
        availMenuRef.current,
        { opacity: 0, y: -6, scaleY: 0.96 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [showAvailabilityMenu]);

  useEffect(() => {
    if (showSortMenu && sortMenuRef.current) {
      gsap.fromTo(
        sortMenuRef.current,
        { opacity: 0, y: -6, scaleY: 0.96 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [showSortMenu]);

  return (
    <main className="min-h-screen bg-white px-6 pt-32 pb-24 sm:px-12">
      <div className="mx-auto max-w-[1800px]">
        {/* PAGE TITLE */}
        <h1 className="text-[11px] font-medium tracking-[0.25em] uppercase text-black/60">
          VIEW ALL
        </h1>

        {/* CONTROLS BAR: AVAILABILITY FILTER & SORT */}
        <div className="relative mt-6 flex items-center justify-between border-b border-black/10 pb-4 text-[11px] font-medium tracking-[0.15em] uppercase text-black">
          {/* AVAILABILITY FILTER DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowAvailabilityMenu(!showAvailabilityMenu);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-2 transition-opacity hover:opacity-60 cursor-pointer"
            >
              <span>
                AVAILABILITY{" "}
                {availability !== "all" && `(${availability === "inStock" ? "IN STOCK" : "OUT OF STOCK"})`}
              </span>
              <span className={`text-[9px] transition-transform duration-300 ${showAvailabilityMenu ? "rotate-180" : ""}`}>
                ∨
              </span>
            </button>

            {showAvailabilityMenu && (
              <div
                ref={availMenuRef}
                className="absolute left-0 top-8 z-30 flex w-48 origin-top flex-col gap-3 border border-black/10 bg-white p-4 shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    setAvailability("all");
                    setShowAvailabilityMenu(false);
                  }}
                  className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
                    availability === "all" ? "font-bold text-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvailability("inStock");
                    setShowAvailabilityMenu(false);
                  }}
                  className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
                    availability === "inStock" ? "font-bold text-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  In Stock
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvailability("outOfStock");
                    setShowAvailabilityMenu(false);
                  }}
                  className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
                    availability === "outOfStock" ? "font-bold text-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  Out of Stock
                </button>
              </div>
            )}
          </div>

          {/* RIGHT STATS & SORT DROPDOWN */}
          <div className="flex items-center gap-8">
            <span className="text-black/50">{filteredProducts.length} ITEMS</span>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowAvailabilityMenu(false);
                }}
                className="flex items-center gap-2 transition-opacity hover:opacity-60 cursor-pointer"
              >
                <span>SORT</span>
                <span className={`text-[9px] transition-transform duration-300 ${showSortMenu ? "rotate-180" : ""}`}>
                  ∨
                </span>
              </button>

              {showSortMenu && (
                <div
                  ref={sortMenuRef}
                  className="absolute right-0 top-8 z-30 flex w-48 origin-top flex-col gap-3 border border-black/10 bg-white p-4 shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("featured");
                      setShowSortMenu(false);
                    }}
                    className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
                      sortBy === "featured" ? "font-bold text-black" : "text-black/60 hover:text-black"
                    }`}
                  >
                    Featured
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("priceAsc");
                      setShowSortMenu(false);
                    }}
                    className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
                      sortBy === "priceAsc" ? "font-bold text-black" : "text-black/60 hover:text-black"
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("priceDesc");
                      setShowSortMenu(false);
                    }}
                    className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
                      sortBy === "priceDesc" ? "font-bold text-black" : "text-black/60 hover:text-black"
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOADING STATE WITH SKELETON */}
        {loading && <ShopSkeletonGrid />}

        {/* ERROR STATE */}
        {error && (
          <div className="mt-24 text-center text-[11px] font-medium tracking-[0.2em] uppercase text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="mt-24 text-center text-[11px] font-medium tracking-[0.2em] uppercase text-black/40">
            NO PRODUCTS AVAILABLE
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && (
          <div
            ref={gridRef}
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {filteredProducts.map((product) => {
              const mainImage = product.images?.[0] || product.image || "/placeholder.png";
              const secondImage = product.images?.[1] || null;
              
              const formattedPrice =
                product.price_formatted ||
                product.priceFormatted ||
                `৳ ${Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
              const isAvailable = product.in_stock ?? product.inStock ?? true;

              return (
                <article key={product.id} className="group flex flex-col text-left">
                  <Link href={`/product/${product.slug || product.id}`}>
                    <div className="relative aspect-square w-full overflow-hidden bg-transparent">
                      {/* PRIMARY IMAGE */}
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className={`object-contain object-center transition-all duration-500 ease-out group-hover:scale-105 ${
                          secondImage ? "opacity-100 group-hover:opacity-0" : ""
                        }`}
                      />

                      {/* SECONDARY HOVER IMAGE */}
                      {secondImage && (
                        <Image
                          src={secondImage}
                          alt={`${product.name} alternate view`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-contain object-center opacity-0 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
                        />
                      )}

                      {!isAvailable && (
                        <span className="absolute top-2 left-2 bg-black px-2 py-1 text-[9px] font-medium tracking-widest text-white uppercase z-10">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="mt-5 flex items-start justify-between gap-1 text-[11px] font-normal tracking-wide uppercase text-black">
                    <h2 className="leading-tight">
                      <Link href={`/product/${product.slug || product.id}`} className="hover:opacity-60 transition-opacity">
                        {product.name}
                      </Link>
                    </h2>
                    {isAvailable && (
                      <button
                        type="button"
                        className="text-[14px] leading-none text-black/60 transition-transform duration-300 hover:scale-125 hover:text-black cursor-pointer"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        +
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] font-normal text-black/60">
                    {formattedPrice}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}