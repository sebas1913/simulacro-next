// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Raleway } from "next/font/google";
import SessionProviderWrapper from "@/components/provider/SessionProviderWrapper";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simulacro",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={raleway.className}>
        <SessionProviderWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
