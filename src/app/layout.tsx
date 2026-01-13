import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { FontSizeInitializer } from "@/components/providers/font-size-initializer";

export const metadata: Metadata = {
  title: "Expenso - Expense Tracker",
  description: "Track your expenses easily and efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning className="overflow-x-hidden max-w-full">
        <head>
          {/* Prevent browser extensions from interfering */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Prevent ethereum wallet extensions from causing errors
                  if (typeof window !== 'undefined' && window.ethereum) {
                    try {
                      // Clear any automatic assignments that might cause errors
                      const originalEthereum = window.ethereum;
                      Object.defineProperty(window, 'ethereum', {
                        get: () => originalEthereum,
                        set: () => {},
                        configurable: false
                      });
                    } catch (e) {
                      console.error(e);
                    }
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="overflow-x-hidden max-w-full">
          <FontSizeInitializer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
