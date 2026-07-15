import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coast2Coast Properties CRM",
  description: "Modern Real Estate CRM Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[#F8F9FA] text-gray-900 transition-colors duration-300">
        <Sidebar />
        <main className="ml-[260px] flex-1 min-h-screen flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 w-full h-full min-w-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
