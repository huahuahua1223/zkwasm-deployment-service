import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import NavBar from "./components/NavBar";

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
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
