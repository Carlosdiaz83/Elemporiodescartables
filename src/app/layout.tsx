import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Emporio Descartables",
  description: "Marketplace de artículos descartables en Córdoba Capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-nunito)] antialiased" style={{ background: "#F0EDE8", color: "#0D3F7A" }}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
