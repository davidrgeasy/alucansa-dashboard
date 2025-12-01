'use client';

import { useState, useRef, useEffect } from 'react';
import { InternalPriority, PRIORITY_CONFIG } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { ChevronDown, CheckCircle2, Flag } from 'lucide-react';

interface PrioritySelectProps {
  value: InternalPriority;
  onChange: (priority: InternalPriority) => void;
  className?: string;
  disabled?: boolean;
}

const PRIORITY_ORDER: InternalPriority[] = ['critica', 'alta', 'media', 'baja'];

export function PrioritySelect({ value, onChange, className, disabled = false }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = PRIORITY_CONFIG[value];

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
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'bg-white',
          disabled 
            ? 'opacity-60 cursor-not-allowed' 
            : 'hover:shadow-sm cursor-pointer'
        )}
      >
        <Flag className={cn('w-4 h-4', config.color)} />
        <span className={cn('font-medium', config.color)}>{config.label}</span>
        <ChevronDown className={cn(
          'w-4 h-4 text-slate-400 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-40 bg-white rounded-lg border border-slate-200 shadow-lg py-1 animate-scale-in">
          {PRIORITY_ORDER.map((priority) => {
            const priorityConfig = PRIORITY_CONFIG[priority];
            const isSelected = priority === value;
            
            return (
              <button
                key={priority}
                type="button"
                onClick={() => {
                  onChange(priority);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                  isSelected 
                    ? cn(priorityConfig.bgColor, priorityConfig.color)
                    : 'hover:bg-slate-50'
                )}
              >
                <Flag className={cn('w-4 h-4', priorityConfig.color)} />
                <span className={cn('font-medium', priorityConfig.color)}>
                  {priorityConfig.label}
                </span>
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

