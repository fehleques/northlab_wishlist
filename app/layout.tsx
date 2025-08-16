import type { Metadata } from 'next';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'NorthLab - Creative Ops Lab',
  description: 'A creative ops lab for thinking, making, and shipping better. NorthLab blends AI guidance with disciplined creative systems.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
