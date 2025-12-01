'use client';

import { useCanEdit } from '@/store/useAuth';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface ReadOnlyBadgeProps {
  className?: string;
  message?: string;
}

/**
 * Badge que indica que una sección es de solo lectura para el usuario actual
 */
export function ReadOnlyBadge({ 
  className,
  message = 'Solo editable por Dirección/Consultoría' 
}: ReadOnlyBadgeProps) {
  const canEdit = useCanEdit();

  // Si puede editar, no mostrar nada
  if (canEdit) return null;

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      'bg-amber-50 text-amber-700 border border-amber-200',
      className
    )}>
      <Lock className="w-3 h-3" />
      {message}
    </div>
  );
}

/**
 * Componente que envuelve contenido editable y lo deshabilita si no tiene permisos
 */
interface EditableWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showBadge?: boolean;
}

export function EditableWrapper({ 
  children, 
  fallback,
  showBadge = true 
}: EditableWrapperProps) {
  const canEdit = useCanEdit();

  if (!canEdit) {
    return (
      <div className="relative">
        {fallback || (
          <div className="opacity-60 pointer-events-none select-none">
            {children}
          </div>
        )}
        {showBadge && (
          <div className="mt-2">
            <ReadOnlyBadge />
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

