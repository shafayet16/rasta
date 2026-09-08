"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "./context/CartContext";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string | number;
  name: string;
  price?: number;
  price_formatted?: string;
  images?: string[];
  image?: string;
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroImageRef.current,
        { scale: 1.15, filter: "brightness(0.6) contrast(1.1)" },
        {
          scale: 1,
          filter: "brightness(0.9) contrast(1.05)",
          duration: 1.8,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        heroContentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.5,
          ease: "power2.out",
        }
      );

      gsap.to(heroImageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: shopRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [loading, products]);

  const formatPrice = (product: Product) => {
    if (product.price_formatted) return product.price_formatted;
    if (product.price != null && !isNaN(Number(product.price))) {
      return `৳ ${Number(product.price).toLocaleString("en-BD")}.00`;
    }
    return "৳ 0.00";
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return "/hero.png";
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section
        id="home"
        ref={heroRef}
        className="relative h-[82vh] min-h-[580px] w-full overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 h-full w-full">
          <Image
            ref={heroImageRef}
            src="/hero.png"
            alt="Collection display"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]" />

        <div
          ref={heroContentRef}
          className="absolute inset-0 z-20 flex items-end justify-center pb-14"
        >
          <Link
            href="/shop"
            className="flex h-[44px] w-[75%] max-w-[240px] items-center justify-center border border-white/80 bg-black/40 text-[10px] font-medium tracking-[0.25em] uppercase text-white backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
          >
            Shop
          </Link>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section
        id="shop"
        ref={shopRef}
        className="bg-white px-6 pt-16 pb-24 sm:px-12 sm:pt-20 sm:pb-32"
      >
        <div className="mx-auto max-w-[1600px] bg-white">
          {loading ? (
            <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-black/50">
              Loading catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-black/50">
              No products available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bg-white">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="product-card group flex flex-col text-left bg-white"
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                  </Link>

                  <div className="mt-4 flex items-start justify-between gap-1 text-[11px] font-normal tracking-wide uppercase text-black">
                    <Link
                      href={`/product/${product.id}`}
                      className="leading-tight hover:underline"
                    >
                      {product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          productId: String(product.id),
                          name: product.name,
                          price: Number(product.price || 0),
                          image: getProductImage(product),
                          quantity: 1,
                          size: "M",
                        });
                      }}
                      className="text-[14px] leading-none text-black/60 transition-colors duration-300 hover:text-black font-bold p-1"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      +
                    </button>
                  </div>

                  <p className="mt-1 text-[11px] font-normal text-black/60">
                    {formatPrice(product)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}