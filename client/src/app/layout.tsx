import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { AIChat } from "./components/aichat/AIChat";
import { Toaster } from "./components/sonner/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KatHome In Town - Hệ thống Homestay Hà Nội",
  description: "Đặt phòng homestay cao cấp tại Hà Nội với KatHome In Town",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
          <AIChat />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
