import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProvideAuth } from "@/contextos/authContext";
import { ProvidePeriodos } from "@/contextos/periodosContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Periodos & Tareas by OSK",
  description: "App de periodos de tiempo y tareas para productividad",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Periodos",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProvideAuth>
          <ProvidePeriodos>{children}</ProvidePeriodos>
        </ProvideAuth>
      </body>
    </html>
  );
}
