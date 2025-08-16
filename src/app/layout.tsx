import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Northlab Wishlist",
  description: "Join the Northlab wishlist.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
