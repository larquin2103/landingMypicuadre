import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://mypicuadre.com";
const title = "MypiCuadre — Tu negocio siempre cuadrado, en cualquier lugar";
const description =
  "Controla ventas, caja e inventario desde tu teléfono, sin internet. La app hecha para pequeños negocios latinoamericanos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "punto de venta offline",
    "control de caja",
    "inventario para negocios",
    "app para bodegas",
    "PWA sin internet",
  ],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "MypiCuadre",
    locale: "es_LA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <ScrollRevealInit />
      </body>
    </html>
  );
}
