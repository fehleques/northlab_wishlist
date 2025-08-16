import type { AppProps } from 'next/app';
import { StrictMode } from 'react';
import ErrorBoundary from '../src/components/ErrorBoundary';
import '../src/styles/base.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StrictMode>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </StrictMode>
  );
}
