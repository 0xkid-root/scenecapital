"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/theme-provider';
import { Web3Provider } from '@/components/web3-provider';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LayoutWithConditionalSidebar } from '@/components/layout/conditional-sidebar-layout';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const clashDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} ${clashDisplay.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <Web3Provider>
              <AuthProvider>
                <TooltipProvider>
                  <LayoutWithConditionalSidebar>
                    {children}
                  </LayoutWithConditionalSidebar>
                  <Toaster />
                </TooltipProvider>
              </AuthProvider>
            </Web3Provider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}