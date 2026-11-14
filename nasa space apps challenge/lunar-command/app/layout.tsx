import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunar Command — 3D Moon Colony Survival Simulator (NASA Space Apps)",
  description:
    "An interactive 3D lunar colony survival game teaching children ages 7–12 real space engineering trade-offs, closed-loop life support, and space weather hazards at the Lunar South Pole.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased dark select-none`}
    >
      <body className="h-full w-full m-0 p-0 overflow-hidden bg-slate-950 font-sans text-slate-100">
        {children}
      </body>
    </html>
  );
}
