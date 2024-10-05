import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Raleway } from "next/font/google";
import SessionProviderWrapper from "@/components/provider/SessionProviderWrapper";
import "../styles/globals.css";

// Cargar la fuente de Google Raleway
const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simulacro",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Obtener el idioma y los mensajes de traducción
  const locale = await getLocale(); 
  const messages = await getMessages(); // Pasamos el locale para obtener los mensajes correctos

  return (
    <html lang={locale}>
      <body className={raleway.className}>
        <SessionProviderWrapper>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            {children}
          </NextIntlClientProvider>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
