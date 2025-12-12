import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import NavBar from './components/NavBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mass Entry Tool | Rocker Gaming',
  description: "A tool to help add cards to TCGPlayer's Mass-Entry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Cloudflare Web Analytics */}
      <script
        defer
        async={true}
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "e937fff367ab4eb99f13fb94379633a3"}'
      ></script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
