import "./globals.css";
import { Container } from "@/app/components/mantine";
import { StoreProvider } from "@/context/store";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chaos Ball!",
  description: "Try to guess...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Container p={20}>
          <StoreProvider>{children}</StoreProvider>
        </Container>
      </body>
    </html>
  );
}
