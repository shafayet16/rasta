"use client";

import Image from "next/image";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Black Essential Tee",
    price: "৳ 1,490.00",
    image: "/blacktee.png",
  },
  {
    id: 2,
    name: "Dark Grey Trousers",
    price: "৳ 2,290.00",
    image: "/dark-gray-trousers.jpeg",
  },
  {
    id: 3,
    name: "Grey Trousers",
    price: "৳ 2,290.00",
    image: "/gray-trousers.jpeg",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);

  function scrollToProducts() {
    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-white text-[#111111] antialiased">
      {/* HEADER / NAVBAR */}
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
            <a
              href="#home"
              className="transition-opacity duration-300 hover:opacity-50"
            >
              Home
            </a>
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
          <a
            href="#home"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.4em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-3xl"
          >
            RASTA
          </a>

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
            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-left"
            >
              Home
            </a>
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

      {/* DRAMATIC HERO SECTION WITH CINEMATIC SHADOWS & VIGNETTE */}
      <section
        id="home"
        className="relative h-[82vh] min-h-[580px] w-full overflow-hidden shadow-2xl"
      >
        {/* Background Image */}
        <Image
          src="/hero.png"
          alt="Collection display"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-90 contrast-[1.05]"
        />

        {/* Cinematic Vignette + Shadow Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]" />

        {/* Button Container */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-14">
          <button
            type="button"
            onClick={scrollToProducts}
            className="h-[44px] w-[75%] max-w-[240px] border border-white/80 bg-black/40 text-[10px] font-medium tracking-[0.25em] uppercase text-white backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* 1:1 SOUL GALLERY PRODUCT SECTION */}
      <section
        id="shop"
        className="mb-24 bg-white px-6 py-16 sm:mb-32 sm:px-12 sm:py-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col text-left"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full mix-blend-multiply">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                {/* Name + Add Button */}
                <div className="mt-4 flex items-start justify-between gap-1 text-[11px] font-normal tracking-wide uppercase text-black">
                  <h2 className="leading-tight">{product.name}</h2>
                  <button
                    type="button"
                    onClick={() => setBagCount((prev) => prev + 1)}
                    className="text-[14px] leading-none text-black/60 transition-colors hover:text-black"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <p className="mt-1 text-[11px] font-normal text-black/60">
                  {product.price}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMPACT & LOW-PROFILE FOOTER */}
      <footer
        id="contact"
        className="border-t border-black/10 bg-white px-6 py-8 text-[#111111] sm:px-12 sm:py-10"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:gap-6">
            {/* Column 1: Links */}
            <div className="flex flex-col gap-2 text-[10px] font-normal tracking-[0.1em] uppercase text-black/70 sm:col-span-4">
              <a href="#contact" className="hover:text-black">
                Terms of Service
              </a>
              <a href="#contact" className="hover:text-black">
                Privacy Policy
              </a>
              <a href="#contact" className="hover:text-black">
                Refund Policy
              </a>
              <a href="#contact" className="hover:text-black">
                Contact Us
              </a>
              <a href="#contact" className="hover:text-black">
                Shipping
              </a>
            </div>

            {/* Column 2: Socials */}
            <div className="flex flex-col gap-2 text-[10px] font-normal tracking-[0.1em] uppercase text-black/70 sm:col-span-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black"
              >
                Tiktok
              </a>
            </div>

            {/* Column 3: Newsletter */}
            <div className="flex flex-col gap-2 sm:col-span-5">
              <span className="text-[10px] font-normal tracking-[0.1em] uppercase text-black">
                Newsletter
              </span>
              <p className="text-[10px] leading-relaxed text-black/60">
                Join the Rasta waitlist for early access to upcoming collections
                and news.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-2 flex max-w-[320px] items-center gap-3"
              >
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="w-full border-b border-black/20 bg-transparent pb-1 text-[10px] tracking-[0.1em] text-black outline-none transition-colors placeholder:text-black/40 focus:border-black"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap text-[10px] font-normal tracking-[0.1em] uppercase text-black/80 hover:text-black"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 text-[10px] tracking-[0.05em] uppercase text-black/40">
            © {new Date().getFullYear()} RASTA
          </div>
        </div>
      </footer>
    </main>
  );
}