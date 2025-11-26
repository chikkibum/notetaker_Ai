import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvide";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "./providers/Theme-Provider";
import { Header } from "@/components/resizeable-navbar/Navbar";
import { ConsentManager } from "./consent-manager";
import { fonts } from "@/lib/fonts";
import { JetBrains_Mono } from "next/font/google";


const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", ],
  variable: "--font-jetbrains-mono",
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
          className={`${fonts.satoshi.variable} ${jetbrainsMono.variable} antialiased`}
        >
          <ConsentManager>
            <ConvexClientProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
              </ThemeProvider>
            </ConvexClientProvider>
          </ConsentManager>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
