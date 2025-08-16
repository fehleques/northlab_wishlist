'use client';

import { ReactNode, StrictMode } from 'react';
import ErrorBoundary from '../src/components/ErrorBoundary';
import '../src/styles/base.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <StrictMode>
          <ErrorBoundary>{children}</ErrorBoundary>
        </StrictMode>
      </body>
    </html>
  );
}
