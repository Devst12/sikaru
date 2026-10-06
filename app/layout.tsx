import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sikaru — Little steps, strong foundations",
  description: "A playful learning garden for children. See it, make it, then solve it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
