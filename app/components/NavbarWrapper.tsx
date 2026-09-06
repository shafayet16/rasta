"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar"; // Adjust path to your store Navbar
import Footer from "../components/Footer"; // Adjust path to your store Footer

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}