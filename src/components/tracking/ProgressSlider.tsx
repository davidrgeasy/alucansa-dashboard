'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export function ProgressSlider({ value, onChange, className, disabled = false }: ProgressSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 75) return 'bg-emerald-400';
    if (progress >= 50) return 'bg-amber-400';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  return (
    <div className={cn('space-y-2', disabled && 'opacity-60', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Progreso</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
            disabled={disabled}
            className={cn(
              'w-16 px-2 py-1 text-sm text-center border border-slate-200 rounded',
              'focus:outline-none focus:ring-1 focus:ring-primary-500',
              disabled && 'cursor-not-allowed bg-slate-50'
            )}
          />
          <span className="text-sm text-slate-500">%</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              getProgressColor(value)
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        
        {/* Slider invisible superpuesto */}
        {!disabled && (
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className={cn(
              'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
              isDragging && 'cursor-grabbing'
            )}
          />
        )}
      </div>

      {/* Marcadores de referencia */}
      <div className="flex justify-between text-xs text-slate-400 px-1">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

