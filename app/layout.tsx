import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper"; // Import the new wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strenoxa – Rise. Lift. Repeat.",
  description: "Rise. Lift. Repeat. Push your limits with Strenoxa's premium selection of gym supplements, including protein powders, creatine, and recovery formulas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <Providers>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: '#ec1313',
                    secondary: '#fff',
                  },
                },
              }}
            />
            {/* Let the wrapper handle the Nav and Footer logic! */}
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}