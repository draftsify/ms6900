import type { Metadata } from "next";
import "./globals.css";
import RevealInit from "./components/RevealInit";

export const metadata: Metadata = {
  title: "MS6900 — Real Stocks, Airdropped Onchain",
  description:
    "MS6900 acquires real equities and airdrops them to token holders. Distribution runs onchain through pump.fun.",
  openGraph: {
    title: "MS6900 — Real Stocks, Airdropped Onchain",
    description:
      "MS6900 acquires real equities and airdrops them to token holders, onchain through pump.fun.",
    images: ["/assets/og.jpg"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/assets/icon.png", apple: "/assets/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <RevealInit />
      </body>
    </html>
  );
}
