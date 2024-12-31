import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "sonner"; // Import Sonner's Toaster
import { MusicPlayerProvider } from "./user-dashboard/components/useMusicPlayer";
import ClientWrapper from "./liveCoding/components/ClientWrapper";
import { Analytics } from '@vercel/analytics/next';
const inter = Inter({ subsets: ["latin"] });

// Metadata configuration for SEO
export const metadata: Metadata = {
  title: "DevMusic - Music Website for Developers",
  description: "Code with Beats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Add Sonner Toaster for global toast notifications */}
          <Toaster position="top-right" richColors />
          
          {/* Main application content */}
          <main className="flex flex-col min-h-screen">
            <MusicPlayerProvider>
            <ClientWrapper>
              {children}
              <Analytics />
            </ClientWrapper>
            </MusicPlayerProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
