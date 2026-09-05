"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";

const initialProducts = [
  {
    id: 1,
    name: "Black Essential Tee",
    price: 1490,
    priceFormatted: "৳ 1,490.00",
    image: "/blacktee.png",
    inStock: true,
  },
  {
    id: 2,
    name: "Dark Grey Trousers",
    price: 2290,
    priceFormatted: "৳ 2,290.00",
    image: "/dark-gray-trousers.jpeg",
    inStock: true,
  },
  {
    id: 3,
    name: "Grey Trousers",
    price: 2290,
    priceFormatted: "৳ 2,290.00",
    image: "/gray-trousers.jpeg",
    inStock: false,
  },
  {
    id: 4,
    name: "Napoleon Jacket",
    price: 4500,
    priceFormatted: "৳ 4,500.00",
    image: "/blacktee.png",
    inStock: true,
  },
  {
    id: 5,
    name: "Fencing Jacket",
    price: 5200,
    priceFormatted: "৳ 5,200.00",
    image: "/dark-gray-trousers.jpeg",
    inStock: true,
  },
];

export default function ShopPage() {
  const [availability, setAvailability] = useState<"all" | "inStock" | "outOfStock">("all");
  const [sortBy, setSortBy] = useState<"featured" | "priceAsc" | "priceDesc">("featured");
  const [showAvailabilityMenu, setShowAvailabilityMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (availability === "inStock") {
      result = result.filter((p) => p.inStock);
    } else if (availability === "outOfStock") {
      result = result.filter((p) => !p.inStock);
    }

    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [availability, sortBy]);

  // Entrance transition for filtered products
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [filteredProducts]);

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
              className="flex items-center gap-2 transition-opacity hover:opacity-60"
            >
              <span>
                AVAILABILITY{" "}
                {availability !== "all" && `(${availability === "inStock" ? "IN STOCK" : "OUT OF STOCK"})`}
              </span>
              <span className="text-[9px]">∨</span>
            </button>

            {showAvailabilityMenu && (
              <div className="absolute left-0 top-8 z-30 flex w-48 flex-col gap-3 border border-black/10 bg-white p-4 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAvailability("all");
                    setShowAvailabilityMenu(false);
                  }}
                  className={`text-left text-[10px] tracking-[0.15em] uppercase ${
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
                  className={`text-left text-[10px] tracking-[0.15em] uppercase ${
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
                  className={`text-left text-[10px] tracking-[0.15em] uppercase ${
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
                className="flex items-center gap-2 transition-opacity hover:opacity-60"
              >
                <span>SORT</span>
                <span className="text-[9px]">∨</span>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-8 z-30 flex w-48 flex-col gap-3 border border-black/10 bg-white p-4 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("featured");
                      setShowSortMenu(false);
                    }}
                    className={`text-left text-[10px] tracking-[0.15em] uppercase ${
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
                    className={`text-left text-[10px] tracking-[0.15em] uppercase ${
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
                    className={`text-left text-[10px] tracking-[0.15em] uppercase ${
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

        {/* ENLARGED PRODUCT GRID (MATCHES SOUL GALLERY SPACING & SCALE) */}
        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col text-left"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden mix-blend-multiply">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]"
                />
                {!product.inStock && (
                  <span className="absolute top-2 left-2 bg-black px-2 py-1 text-[9px] font-medium tracking-widest text-white uppercase">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-start justify-between gap-1 text-[11px] font-normal tracking-wide uppercase text-black">
                <h2 className="leading-tight">{product.name}</h2>
                {product.inStock && (
                  <button
                    type="button"
                    className="text-[14px] leading-none text-black/60 transition-colors hover:text-black"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    +
                  </button>
                )}
              </div>

              <p className="mt-1 text-[11px] font-normal text-black/60">
                {product.priceFormatted}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}