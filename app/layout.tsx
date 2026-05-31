import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/pwa-register";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Álbum de Memórias da Família",
  description: "Um álbum digital privado, emocional e elegante para guardar fotos, vídeos, cartas e momentos da família.",
  manifest: "/manifest.webmanifest",
  themeColor: "#f4e7d6",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${caveat.variable}`}>
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
