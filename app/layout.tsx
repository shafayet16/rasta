import NavbarWrapper from "./components/NavbarWrapper";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext"; // Adjust to "@/context/CartContext" if context folder is in project root
import "./globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RASTA',
  description: 'Explore the Rasta collection.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavbarWrapper>{children}</NavbarWrapper>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}