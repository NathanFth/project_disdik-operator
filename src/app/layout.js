// src/app/layout.js
export const metadata = { title: "E-planDisdik Operator" };

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
