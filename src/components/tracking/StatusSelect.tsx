'use client';

import { useState, useRef, useEffect } from 'react';
import { ProblemStatus, STATUS_CONFIG } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { 
  Circle, 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ChevronDown
} from 'lucide-react';

interface StatusSelectProps {
  value: ProblemStatus;
  onChange: (status: ProblemStatus) => void;
  className?: string;
  disabled?: boolean;
}

const STATUS_ICONS: Record<ProblemStatus, React.ReactNode> = {
  pendiente: <Circle className="w-4 h-4" />,
  en_analisis: <Search className="w-4 h-4" />,
  en_progreso: <Loader2 className="w-4 h-4" />,
  bloqueado: <AlertTriangle className="w-4 h-4" />,
  completado: <CheckCircle2 className="w-4 h-4" />,
  descartado: <XCircle className="w-4 h-4" />,
};

const STATUS_ORDER: ProblemStatus[] = [
  'pendiente',
  'en_analisis',
  'en_progreso',
  'bloqueado',
  'completado',
  'descartado',
];

export function StatusSelect({ value, onChange, className, disabled = false }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = STATUS_CONFIG[value];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          config.bgColor,
          config.borderColor,
          config.color,
          disabled 
            ? 'opacity-60 cursor-not-allowed' 
            : 'hover:shadow-sm cursor-pointer'
        )}
      >
        {STATUS_ICONS[value]}
        <span className="font-medium">{config.label}</span>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 animate-scale-in">
          {STATUS_ORDER.map((status) => {
            const statusConfig = STATUS_CONFIG[status];
            const isSelected = status === value;
            
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                  isSelected 
                    ? cn(statusConfig.bgColor, statusConfig.color)
                    : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <span className={statusConfig.color}>
                  {STATUS_ICONS[status]}
                </span>
                <span className="font-medium">{statusConfig.label}</span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 ml-auto text-primary-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

