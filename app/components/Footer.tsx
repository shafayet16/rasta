"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="border-t border-black/10 bg-white px-6 py-8 text-[#111111] sm:px-12 sm:py-10"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:gap-6">
          <div className="flex flex-col gap-2 text-[10px] font-normal tracking-[0.1em] uppercase text-black/70 sm:col-span-4">
            <a href="#contact" className="transition-colors hover:text-black">
              Terms of Service
            </a>
            <a href="#contact" className="transition-colors hover:text-black">
              Privacy Policy
            </a>
            <a href="#contact" className="transition-colors hover:text-black">
              Refund Policy
            </a>
            <a href="#contact" className="transition-colors hover:text-black">
              Contact Us
            </a>
            <a href="#contact" className="transition-colors hover:text-black">
              Shipping
            </a>
          </div>

          <div className="flex flex-col gap-2 text-[10px] font-normal tracking-[0.1em] uppercase text-black/70 sm:col-span-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-black"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-black"
            >
              Tiktok
            </a>
          </div>

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
                className="whitespace-nowrap text-[10px] font-normal tracking-[0.1em] uppercase text-black/80 transition-colors hover:text-black"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-[10px] tracking-[0.05em] uppercase text-black/40">
          © {new Date().getFullYear()} RASTA
        </div>
      </div>
    </footer>
  );
}