import { Geist, Geist_Mono } from "next/font/google";

import "@space/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          {children}
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
