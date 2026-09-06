"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-6 py-4 border-b border-white/10 sm:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] font-medium tracking-[0.2em] uppercase">
        <Link href="/admin" className="text-[13px] font-bold tracking-[0.3em]">
          RASTA // ADMIN
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/admin"
            className={`transition-colors ${
              pathname === "/admin" ? "text-white underline underline-offset-4" : "text-white/60 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/new"
            className={`transition-colors ${
              pathname === "/admin/new" ? "text-white underline underline-offset-4" : "text-white/60 hover:text-white"
            }`}
          >
            + New Product
          </Link>
          <Link
            href="/"
            target="_blank"
            className="border border-white/20 px-3 py-1.5 text-white/80 transition-colors hover:border-white hover:text-white"
          >
            Live Store ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}