"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use, useRef } from "react";
import { useCart } from "../../context/CartContext";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  price_formatted?: string;
  images: string[];
  description?: string;
  sizes?: string[];
  in_stock?: boolean;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery & Interaction state
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  // Pair It With state
  const [pairProduct, setPairProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data: Product = await res.json();
        setProduct(data);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        const allRes = await fetch("/api/products");
        if (allRes.ok) {
          const allData: Product[] = await allRes.json();
          const others = allData.filter((p) => p.id !== data.id && p.slug !== data.slug);
          setRecommendations(others);
          if (others.length > 0) {
            setPairProduct(others[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  const images = product?.images && product.images.length > 0 ? product.images : ["/placeholder.png"];

  // Handle active index updates on swipe
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const width = scrollContainerRef.current.offsetWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / width);
      if (newIndex !== currentImgIndex && newIndex >= 0 && newIndex < images.length) {
        setCurrentImgIndex(newIndex);
      }
    }
  };

  const changeImage = (newIndex: number) => {
    setCurrentImgIndex(newIndex);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handlePrevImage = () => {
    const nextIdx = currentImgIndex === 0 ? images.length - 1 : currentImgIndex - 1;
    changeImage(nextIdx);
  };

  const handleNextImage = () => {
    const nextIdx = currentImgIndex === images.length - 1 ? 0 : currentImgIndex + 1;
    changeImage(nextIdx);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0] || "/placeholder.png",
      size: selectedSize || (product.sizes?.[0] ?? "OS"),
      quantity: 1,
    });
  };

  const handlePairAddToCart = () => {
    if (!product || !pairProduct) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0] || "/placeholder.png",
      size: selectedSize || (product.sizes?.[0] ?? "OS"),
      quantity: 1,
    });
    addToCart({
      productId: pairProduct.id,
      name: pairProduct.name,
      price: Number(pairProduct.price),
      image: pairProduct.images?.[0] || "/placeholder.png",
      size: pairProduct.sizes?.[0] ?? "OS",
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[10px] font-medium tracking-[0.3em] uppercase text-black/40">
        <span className="animate-pulse">LOADING PRODUCT...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
        <p className="text-[11px] tracking-[0.25em] uppercase text-black/60">
          PRODUCT NOT FOUND
        </p>
        <Link
          href="/shop"
          className="mt-6 border border-black/80 px-8 py-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 hover:bg-black hover:text-white"
        >
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  const formattedPrice =
    product.price_formatted || `৳ ${Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const descriptionBullets = product.description
    ? product.description
        .split("\n")
        .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter((line) => line.length > 0)
    : [];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* MAIN DISPLAY */}
      <main className="mx-auto max-w-[1600px] px-6 pt-28 pb-24 sm:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LEFT: GALLERY & CAROUSEL (7 COLS) */}
          <div className="flex flex-col items-center lg:col-span-7 w-full">
            <div className="group relative w-full max-w-[650px]">
              
              {/* SWIPEABLE GALLERY CONTAINER */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex aspect-[4/5] w-full overflow-x-auto snap-x snap-mandatory bg-neutral-50/50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-full w-full shrink-0 snap-center"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} image ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      className="object-contain object-center p-4 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>

              {/* GALLERY COUNTER */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 text-[9px] font-mono tracking-[0.2em] text-black/40 bg-white/50 backdrop-blur-sm px-2 py-1 rounded z-10 pointer-events-none">
                  {String(currentImgIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </div>
              )}

              {/* DESKTOP-ONLY NAVIGATION ARROWS */}
              {images.length > 1 && (
                <div className="hidden lg:block">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-black/70 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-300 shadow-sm z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-black/70 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-300 shadow-sm z-10 cursor-pointer"
                    aria-label="Next image"
                  >
                    <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* THUMBNAIL PREVIEW STRIP */}
            {images.length > 1 && (
              <div className="mt-6 flex justify-center gap-3 overflow-x-auto p-1 max-w-full">
                {images.map((img, idx) => {
                  const isActive = currentImgIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => changeImage(idx)}
                      className={`group relative aspect-square h-14 w-14 sm:h-18 sm:w-18 shrink-0 bg-neutral-50 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-2 border-black opacity-100"
                          : "border border-black/10 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <div className="relative h-full w-full p-1.5">
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS (5 COLS) */}
          <div className="flex flex-col max-w-md lg:col-span-5 lg:pt-4">
            <h1 className="text-[13px] font-medium tracking-[0.25em] uppercase text-black">
              {product.name}
            </h1>
            <p className="mt-3 text-[12px] font-medium tracking-wider text-black/70">
              {formattedPrice}
            </p>

            {/* SIZE SELECTOR */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-10 border-t border-black/10 pt-8">
                <div className="flex items-center justify-between text-[10px] font-medium tracking-[0.2em] uppercase">
                  <span>SELECT SIZE</span>
                  <button type="button" className="text-black/50 underline underline-offset-4 hover:text-black transition-colors">
                    SIZE GUIDE
                  </button>
                </div>

                <div className="mt-5 flex gap-4 text-[11px] font-medium tracking-wider uppercase">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 w-12 items-center justify-center border text-[10px] transition-all duration-300 cursor-pointer ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-black/20 bg-transparent text-black/60 hover:border-black hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADD TO CART ACTION */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden border border-black bg-black py-4 text-[10px] font-medium tracking-[0.3em] uppercase text-white transition-all duration-300 hover:bg-transparent hover:text-black cursor-pointer"
            >
              <svg className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span>ADD TO CART</span>
            </button>

            {/* ANIMATED ACCORDION SECTIONS */}
            <div className="mt-12 border-t border-black/10 text-[10px] tracking-[0.2em] uppercase">
              
              {/* ACCORDION ITEM: DESCRIPTION */}
              <div className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="flex w-full items-center justify-between py-5 text-left font-medium transition-colors hover:text-black/60 cursor-pointer"
                >
                  <span>DESCRIPTION</span>
                  <span className="text-[14px] transition-transform duration-300">
                    {openAccordion === "description" ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openAccordion === "description" ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-[11px] leading-relaxed tracking-normal text-black/80 normal-case">
                    {descriptionBullets.length > 0 ? (
                      <ul className="flex flex-col gap-2.5">
                        {descriptionBullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-black/30 font-mono select-none">—</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-black/40 italic">No description provided.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ACCORDION ITEM: SHIPPING */}
              <div className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="flex w-full items-center justify-between py-5 text-left font-medium transition-colors hover:text-black/60 cursor-pointer"
                >
                  <span>SHIPPING & DELIVERY</span>
                  <span className="text-[14px] transition-transform duration-300">
                    {openAccordion === "shipping" ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openAccordion === "shipping" ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-[11px] leading-relaxed tracking-normal text-black/70 normal-case">
                    Standard delivery within 2-4 business days across Bangladesh. Cash on delivery available.
                  </div>
                </div>
              </div>

              {/* ACCORDION ITEM: RETURNS */}
              <div className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => toggleAccordion("return")}
                  className="flex w-full items-center justify-between py-5 text-left font-medium transition-colors hover:text-black/60 cursor-pointer"
                >
                  <span>EXCHANGES</span>
                  <span className="text-[14px] transition-transform duration-300">
                    {openAccordion === "return" ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openAccordion === "return" ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-[11px] leading-relaxed tracking-normal text-black/70 normal-case">
                    Exchanges allowed within 2-3 days of delivery for unworn items in original packaging.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* LOOKBOOK BUNDLE: PAIR IT WITH */}
        {pairProduct && (
          <section className="mt-32 border-t border-black/10 pt-20">
            <h2 className="text-[10px] font-medium tracking-[0.3em] uppercase text-black/50">
              PAIR IT WITH
            </h2>

            <div className="mt-12 flex flex-col items-center justify-between gap-12 lg:flex-row lg:items-end">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
                {/* PRIMARY PRODUCT */}
                <div className="flex flex-col">
                  <div className="relative aspect-[3/4] w-44 sm:w-56 bg-neutral-50/50">
                    <Image src={images[0]} alt={product.name} fill className="object-contain p-2" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] tracking-wider uppercase">
                    <span className="truncate max-w-[120px]">{product.name}</span>
                    <span className="text-black/40">{selectedSize}</span>
                    <span>{formattedPrice}</span>
                  </div>
                </div>

                <span className="text-[20px] font-light text-black/30">+</span>

                {/* PAIR PRODUCT */}
                <div className="flex flex-col">
                  <div className="relative aspect-[3/4] w-44 sm:w-56 bg-neutral-50/50">
                    <Image
                      src={pairProduct.images?.[0] || "/placeholder.png"}
                      alt={pairProduct.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] tracking-wider uppercase">
                    <span className="truncate max-w-[120px]">{pairProduct.name}</span>
                    <span>{pairProduct.price_formatted || `৳ ${pairProduct.price}`}</span>
                  </div>
                </div>
              </div>

              {/* BUNDLE TOTAL & ACTION */}
              <div className="flex flex-col items-center lg:items-end">
                <div className="text-[11px] font-medium tracking-[0.25em] uppercase">
                  BUNDLE TOTAL:{" "}
                  <span className="text-black font-semibold">
                    ৳ {(Number(product.price) + Number(pairProduct.price)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePairAddToCart}
                  className="mt-5 border border-black bg-transparent px-10 py-3.5 text-[10px] font-medium tracking-[0.3em] uppercase text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                >
                  ADD LOOK TO CART
                </button>
              </div>
            </div>
          </section>
        )}

        {/* YOU MAY ALSO LIKE GRID */}
        {recommendations.length > 0 && (
          <section className="mt-32 border-t border-black/10 pt-20">
            <h2 className="text-[10px] font-medium tracking-[0.3em] uppercase text-black/50">
              YOU MAY ALSO LIKE
            </h2>

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {recommendations.slice(0, 4).map((rec) => {
                const recImg = rec.images?.[0] || "/placeholder.png";
                const recPrice =
                  rec.price_formatted || `৳ ${Number(rec.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

                return (
                  <article key={rec.id} className="group flex flex-col">
                    <Link href={`/product/${rec.slug || rec.id}`}>
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-50/50">
                        <Image
                          src={recImg}
                          alt={rec.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <div className="mt-4 flex items-start justify-between text-[10px] font-medium tracking-wider uppercase">
                      <h2>
                        <Link href={`/product/${rec.slug || rec.id}`} className="hover:opacity-50 transition-opacity">
                          + {rec.name}
                        </Link>
                      </h2>
                    </div>
                    <p className="mt-1 text-[10px] text-black/50">{recPrice}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* FLOATING STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-black/10 bg-white/90 px-6 py-3.5 backdrop-blur-md sm:px-12 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden bg-neutral-50 border border-black/10">
            <Image src={images[0]} alt={product.name} fill className="object-contain p-1" />
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase">{product.name}</p>
            <p className="text-[9px] text-black/40 uppercase">{selectedSize}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden text-[10px] font-medium tracking-wider sm:inline">{formattedPrice}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-black px-6 py-2.5 text-[10px] font-medium tracking-[0.25em] uppercase text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}