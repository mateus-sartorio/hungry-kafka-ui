import type { Metadata } from "next";
import { MobileOnlyGate } from "./mobile-only-gate";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kafka food",
  description: "Kafka food mobile ordering platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={"h-full antialiased"}
    >
      <body className="min-h-full flex flex-col">
        <MobileOnlyGate>{children}</MobileOnlyGate>
      </body>
    </html>
  );
}
