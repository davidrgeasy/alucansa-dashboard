'use client';

import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  allowClear?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  label,
  className,
  allowClear = true,
}: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className={cn(
          'px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'transition-colors duration-200'
        )}
      >
        <option value="">{allowClear ? placeholder : options[0]?.label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

