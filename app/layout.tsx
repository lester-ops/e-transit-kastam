import type { Metadata } from "next";
import "./globals.css"; // <-- Baris penyambung Tailwind CSS yang sangat penting!

export const metadata: Metadata = {
  title: "Sistem e-Transit",
  description: "Jabatan Kastam Diraja Malaysia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body className="bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}