'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas que requieren autenticación.
 * Verifica primero el código de acceso, luego el login.
 * - Sin código de acceso → /acceso
 * - Con código pero sin login → /login
 * - Con ambos → muestra contenido
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { isAuthenticated, hasAccessCode } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // Primero verificar código de acceso
      if (!hasAccessCode) {
        router.push('/acceso');
      } else if (!isAuthenticated) {
        // Tiene código pero no está logueado
        router.push('/login');
      }
    }
  }, [isHydrated, isAuthenticated, hasAccessCode, router]);

  // Mientras se hidrata, mostrar loading
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no tiene código de acceso o no está autenticado, no mostrar nada (se redirigirá)
  if (!hasAccessCode || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

