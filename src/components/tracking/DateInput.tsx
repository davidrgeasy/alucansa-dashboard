'use client';

import { cn } from '@/lib/utils';
import { Calendar, X } from 'lucide-react';

interface DateInputProps {
  value: string | null;
  onChange: (date: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateInput({ 
  value, 
  onChange, 
  label, 
  placeholder = 'Seleccionar fecha',
  className,
  disabled = false
}: DateInputProps) {
  const formatDisplayDate = (isoString: string | null): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      // Convertir a ISO string
      onChange(new Date(newValue).toISOString());
    } else {
      onChange(null);
    }
  };

  const getInputValue = (): string => {
    if (!value) return '';
    return new Date(value).toISOString().split('T')[0];
  };

  return (
    <div className={cn('space-y-1.5', disabled && 'opacity-60', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="date"
          value={getInputValue()}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-colors duration-200',
            !value && 'text-slate-400',
            disabled && 'cursor-not-allowed bg-slate-50'
          )}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {value && (
        <p className="text-xs text-slate-500">
          {formatDisplayDate(value)}
        </p>
      )}
    </div>
  );
}

