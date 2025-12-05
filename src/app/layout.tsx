import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Panel de Mejora ALUCANSA',
  description: 'Dashboard de consultoría de procesos y tecnología para ALUCANSA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-pattern min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

