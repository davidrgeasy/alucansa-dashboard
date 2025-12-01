'use client';

import { useState, useRef, useCallback } from 'react';
import { exportToPdf, ExportOptions } from '@/lib/exportPdf';
import { cn } from '@/lib/utils';
import { FileDown, Loader2, Check } from 'lucide-react';

interface ExportButtonProps {
  /** Ref al elemento a exportar, o función que devuelve el elemento */
  targetRef?: React.RefObject<HTMLElement>;
  getTarget?: () => HTMLElement | null;
  /** Opciones de exportación */
  options: ExportOptions;
  /** Variante visual */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Tamaño */
  size?: 'sm' | 'md';
  /** Texto del botón */
  label?: string;
  /** Clase adicional */
  className?: string;
  /** Callback al completar */
  onComplete?: () => void;
  /** Callback en error */
  onError?: (error: Error) => void;
}

const variantStyles = {
  primary: 'bg-primary-900 text-white hover:bg-primary-800 shadow-sm',
  secondary: 'bg-white text-primary-900 border border-slate-300 hover:bg-slate-50 shadow-sm',
  ghost: 'text-primary-700 hover:bg-slate-100',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
};

export function ExportButton({
  targetRef,
  getTarget,
  options,
  variant = 'secondary',
  size = 'md',
  label = 'Exportar PDF',
  className,
  onComplete,
  onError,
}: ExportButtonProps) {
  const [status, setStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  const handleExport = useCallback(async () => {
    const target = getTarget ? getTarget() : targetRef?.current;
    
    if (!target) {
      console.error('No se encontró el elemento a exportar');
      return;
    }

    setStatus('exporting');

    try {
      await exportToPdf(target, options);
      setStatus('success');
      onComplete?.();
      
      // Volver a idle después de mostrar éxito
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      setStatus('error');
      onError?.(error as Error);
      
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [targetRef, getTarget, options, onComplete, onError]);

  const isDisabled = status === 'exporting';

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-70 disabled:cursor-not-allowed',
        'no-print', // Esta clase hace que no aparezca en la exportación
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {status === 'exporting' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Exportando...</span>
        </>
      ) : status === 'success' ? (
        <>
          <Check className="w-4 h-4" />
          <span>¡Descargado!</span>
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

