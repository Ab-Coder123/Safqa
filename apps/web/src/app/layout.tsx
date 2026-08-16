import React from 'react';
import { Cairo } from 'next/font/google';
import { ThemeProvider } from '../components/theme-provider';
import { ToastProvider } from '../components/ui/toast';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata = {
  title: 'صفقة | Safqa Marketplace',
  description: 'منصة صفقة - أسهل سوق للبيع والشراء في مصر والوطن العربي',
  icons: {
    icon: '/images/safqa-logo-3d.png',
    shortcut: '/images/safqa-logo-3d.png',
    apple: '/images/safqa-logo-3d.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={cairo.className}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
