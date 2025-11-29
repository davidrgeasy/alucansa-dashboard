'use client';

import { cn } from '@/lib/utils';

interface RangeInputProps {
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  label?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function RangeInput({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  label,
  minPlaceholder = 'Mín',
  maxPlaceholder = 'Máx',
  prefix,
  suffix,
  className,
}: RangeInputProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onMinChange(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onMaxChange(value);
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={minValue ?? ''}
            onChange={handleMinChange}
            placeholder={minPlaceholder}
            className={cn(
              'w-full py-2 bg-white border border-slate-300 rounded-lg text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'transition-colors duration-200',
              prefix ? 'pl-7 pr-3' : 'px-3',
              suffix ? 'pr-8' : ''
            )}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              {suffix}
            </span>
          )}
        </div>
        <span className="text-slate-400">-</span>
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={maxValue ?? ''}
            onChange={handleMaxChange}
            placeholder={maxPlaceholder}
            className={cn(
              'w-full py-2 bg-white border border-slate-300 rounded-lg text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'transition-colors duration-200',
              prefix ? 'pl-7 pr-3' : 'px-3',
              suffix ? 'pr-8' : ''
            )}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

