import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer/page";
import Navbar from "@/components/navbar/page";
import { Providers } from "@/context/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mantenimiento Marcobre",
  description: "Gestión de Mantenimiento Planta y Mina de Marcobre",
  keywords:
    "Mantenimiento, Maintenance, getión de mantenimiento, Gestion de mantenimiento, gestion mantenimiento, gestión de activos, gestion de activos, gestion activos, planta, mina, marcobre, mantenimiento marcobre, Mantenimiento Marcobre",
  authors: { name: "Edgard Andre Carrillo Iparraguirre" },
  robots: "index, follow",
  metadataBase: new URL("https://mantenimientomarcobre.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
