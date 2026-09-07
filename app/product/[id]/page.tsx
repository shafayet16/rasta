"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";

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

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Pair It With state
  const [pairProduct, setPairProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch product details
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data: Product = await res.json();
        setProduct(data);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        // Fetch all products for recommendations & 'Pair It With'
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[10px] font-medium tracking-[0.25em] uppercase text-black/40">
        LOADING PRODUCT...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
        <p className="text-[11px] tracking-[0.2em] uppercase text-black/60">
          PRODUCT NOT FOUND
        </p>
        <Link
          href="/shop"
          className="mt-4 border border-black px-6 py-2 text-[10px] tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
        >
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];
  const formattedPrice =
    product.price_formatted || `৳ ${Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handlePrevImage = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* MAIN PRODUCT DISPLAY */}
      <main className="mx-auto max-w-[1600px] px-6 pt-24 pb-16 sm:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* LEFT CAROUSEL SECTION (7 COLS) */}
          <div className="relative flex flex-col items-center lg:col-span-7">
            <div className="relative aspect-[4/5] w-full max-w-[650px] overflow-hidden bg-white">
              <Image
                src={images[currentImgIndex]}
                alt={product.name}
                fill
                priority
                className="object-contain object-center transition-all duration-300"
              />

              {/* CLEAN NAVIGATION ARROWS */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-[18px] text-black/40 hover:text-black transition-colors"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-[18px] text-black/40 hover:text-black transition-colors"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT DETAILS SECTION (5 COLS) */}
          <div className="flex flex-col max-w-md lg:col-span-5">
            <h1 className="text-[12px] font-medium tracking-[0.2em] uppercase">
              {product.name}
            </h1>
            <p className="mt-2 text-[12px] text-black/70">
              {formattedPrice}
            </p>

            {/* SIZE SELECTOR */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between text-[10px] font-medium tracking-widest uppercase">
                  <span>SIZE</span>
                  <button className="text-black/50 underline underline-offset-4 hover:text-black">
                    SIZE GUIDE
                  </button>
                </div>

                <div className="mt-4 flex gap-6 text-[11px] font-medium tracking-wider uppercase">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative pb-1 transition-colors ${
                        selectedSize === size
                          ? "text-black after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-black"
                          : "text-black/40 hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADD TO CART BUTTON */}
            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-2 border border-black bg-transparent py-4 text-[10px] font-medium tracking-[0.25em] uppercase text-black hover:bg-black hover:text-white transition-colors"
            >
              <span>🛒 ADD TO CART</span>
            </button>

            {/* ACCORDION SECTIONS */}
            <div className="mt-10 border-t border-black/10 text-[10px] tracking-[0.2em] uppercase">
              
              {/* DESCRIPTION ACCORDION */}
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion("description")}
                  className="flex w-full items-center justify-between py-4 text-left font-medium"
                >
                  <span>DESCRIPTION</span>
                  <span className="text-[12px]">{openAccordion === "description" ? "−" : "+"}</span>
                </button>
                {openAccordion === "description" && (
                  <div className="pb-4 text-[11px] leading-relaxed tracking-normal text-black/70 lowercase normal-case">
                    {product.description || "No description provided."}
                  </div>
                )}
              </div>

              {/* SHIPPING ACCORDION */}
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="flex w-full items-center justify-between py-4 text-left font-medium"
                >
                  <span>SHIPPING</span>
                  <span className="text-[12px]">{openAccordion === "shipping" ? "−" : "+"}</span>
                </button>
                {openAccordion === "shipping" && (
                  <div className="pb-4 text-[11px] leading-relaxed tracking-normal text-black/70 lowercase normal-case">
                    Standard delivery within 2-4 business days across Bangladesh. Cash on delivery available.
                  </div>
                )}
              </div>

              {/* RETURN ACCORDION */}
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion("return")}
                  className="flex w-full items-center justify-between py-4 text-left font-medium"
                >
                  <span>RETURN</span>
                  <span className="text-[12px]">{openAccordion === "return" ? "−" : "+"}</span>
                </button>
                {openAccordion === "return" && (
                  <div className="pb-4 text-[11px] leading-relaxed tracking-normal text-black/70 lowercase normal-case">
                    Exchanges allowed within 7 days of delivery for unworn items in original packaging.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* THUMBNAIL PREVIEW ROW */}
        {images.length > 1 && (
          <div className="mt-12 flex justify-center gap-3 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImgIndex(idx)}
                className={`relative h-16 w-16 bg-white transition-all ${
                  currentImgIndex === idx
                    ? "border border-black p-0.5"
                    : "border border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* PAIR IT WITH SECTION */}
        {pairProduct && (
          <section className="mt-28 border-t border-black/10 pt-16">
            <h2 className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/60">
              PAIR IT WITH
            </h2>

            <div className="mt-12 flex flex-col items-center justify-between gap-12 lg:flex-row">
              <div className="flex items-center gap-8 sm:gap-12">
                {/* ITEM 1 */}
                <div className="flex flex-col text-left">
                  <div className="relative aspect-[3/4] w-48 sm:w-64 bg-white">
                    <Image src={images[0]} alt={product.name} fill className="object-contain" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] tracking-wider uppercase">
                    <span>{product.name}</span>
                    <span className="text-black/50">{selectedSize}</span>
                    <span>{formattedPrice}</span>
                  </div>
                </div>

                <span className="text-[18px] text-black/40">+</span>

                {/* ITEM 2 */}
                <div className="flex flex-col text-left">
                  <div className="relative aspect-[3/4] w-48 sm:w-64 bg-white">
                    <Image
                      src={pairProduct.images?.[0] || "/placeholder.png"}
                      alt={pairProduct.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] tracking-wider uppercase">
                    <span>{pairProduct.name}</span>
                    <span>
                      {pairProduct.price_formatted || `৳ ${pairProduct.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* BUNDLE ADD TO CART */}
              <div className="flex flex-col items-center lg:items-end">
                <div className="text-[11px] font-medium tracking-widest uppercase">
                  TOTAL:{" "}
                  <span className="text-black">
                    ৳ {(Number(product.price) + Number(pairProduct.price)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-4 border border-black bg-transparent px-8 py-3 text-[10px] font-medium tracking-[0.25em] uppercase text-black hover:bg-black hover:text-white transition-colors"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </section>
        )}

        {/* YOU MAY ALSO LIKE SECTION */}
        {recommendations.length > 0 && (
          <section className="mt-28 border-t border-black/10 pt-16">
            <h2 className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/60">
              YOU MAY ALSO LIKE
            </h2>

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {recommendations.slice(0, 4).map((rec) => {
                const recImg = rec.images?.[0] || "/placeholder.png";
                const recPrice =
                  rec.price_formatted || `৳ ${Number(rec.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

                return (
                  <article key={rec.id} className="group flex flex-col text-left">
                    <Link href={`/product/${rec.slug || rec.id}`}>
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                        <Image
                          src={recImg}
                          alt={rec.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <div className="mt-4 flex items-start justify-between text-[10px] font-medium tracking-wider uppercase">
                      <h2>
                        <Link href={`/product/${rec.slug || rec.id}`} className="hover:opacity-60 transition-opacity">
                          + {rec.name}
                        </Link>
                      </h2>
                    </div>
                    <p className="mt-1 text-[10px] text-black/60">{recPrice}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* FLOATING STICKY ADD TO CART BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-black/10 bg-white/95 px-6 py-3 backdrop-blur-md sm:px-12">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden bg-white">
            <Image src={images[0]} alt={product.name} fill className="object-contain" />
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase">{product.name}</p>
            <p className="text-[9px] text-black/50">{selectedSize}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden text-[10px] font-medium sm:inline">{formattedPrice}</span>
          <button
            type="button"
            className="flex items-center gap-2 bg-black px-6 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase text-white hover:bg-black/80 transition-colors"
          >
            <span>🛒 ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}