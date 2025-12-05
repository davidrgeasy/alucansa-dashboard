'use client';

import { DataLoader } from './DataLoader';

/**
 * Componente que provee los contextos y carga de datos
 * para toda la aplicación.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataLoader>
      {children}
    </DataLoader>
  );
}

