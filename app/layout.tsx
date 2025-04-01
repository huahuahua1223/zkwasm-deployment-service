import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZKWasm Deployment Service",
  description: "Deploy zkwasm applications to Kubernetes with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
