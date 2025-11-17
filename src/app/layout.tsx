import type { Metadata } from "next";
import { type ReactNode } from "react";
import Header from "../shared/components/organisms/header";
import ToastProvider from "../shared/components/atoms/toastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" className="dark">
      <body className="bg-gray-900 text-black dark:bg-slate-950 dark:text-white">
        <Header />
        <main>{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}
