import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Reconciliation Dashboard",
  description: "Operational dashboard for payment reconciliation review"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
