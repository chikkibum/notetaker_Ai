import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvide";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "./providers/Theme-Provider";
import { Header } from "@/components/resizeable-navbar/Navbar";
import Head from "next/head";
import { ConsentManager } from "./consent-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteIt",
  description: "A beautiful note taking app with AI quirkies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ConvexAuthNextjsServerProvider>
          <html lang="en" suppressHydrationWarning>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
    		<ConsentManager>
    			
              <ConvexClientProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Header/>
                  {children}
                </ThemeProvider>
              </ConvexClientProvider>
            
    		</ConsentManager>
    	</body>
          </html>
        </ConvexAuthNextjsServerProvider>
      )
}
