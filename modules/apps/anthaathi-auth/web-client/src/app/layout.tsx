import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/containers/AppProvider';
import Script from 'next/script';
import { config } from '@anthaathi-internal/config';

const inter = Inter({ subsets: ['latin'] });

const properties = config.getProperties();

export const metadata: Metadata = {
  title: config.get('appName'),
  description: config.get('appDescription'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__auth_data = ${JSON.stringify(properties)}`,
          }}
          id="appData"
          type="application/javascript"
        />
      </head>
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
