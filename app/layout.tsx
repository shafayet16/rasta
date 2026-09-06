import NavbarWrapper from "./components/NavbarWrapper";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper>{children}</NavbarWrapper>
      </body>
    </html>
  );
}