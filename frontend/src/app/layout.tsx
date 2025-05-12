import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Remove Inter
import { GeistSans } from 'geist/font/sans'; // Import GeistSans
import { GeistMono } from 'geist/font/mono'; // Import GeistMono
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider

// const inter = Inter({ subsets: ["latin"] }); // Remove Inter initialization

export const metadata: Metadata = {
  title: "Solana Campus Carpool", // Updated title
  description: "Smart campus carpooling with Solana integration", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
