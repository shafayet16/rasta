"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

function NavbarWrapperContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname ? pathname.startsWith("/admin") : false;

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <NavbarWrapperContent>{children}</NavbarWrapperContent>
    </Suspense>
  );
}