'use client';

import { useState, useRef, useEffect } from 'react';
import { ASSIGNEES } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { ChevronDown, User, UserPlus, X } from 'lucide-react';

interface AssigneeSelectProps {
  value: string | null;
  onChange: (assignee: string | null) => void;
  className?: string;
  disabled?: boolean;
}

export function AssigneeSelect({ value, onChange, className, disabled = false }: AssigneeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomAdd = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomValue('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'bg-white min-w-[160px]',
          disabled 
            ? 'opacity-60 cursor-not-allowed' 
            : 'hover:shadow-sm cursor-pointer'
        )}
      >
        <User className="w-4 h-4 text-slate-400" />
        <span className={cn(
          'font-medium flex-1 text-left',
          value ? 'text-primary-900' : 'text-slate-400'
        )}>
          {value || 'Sin asignar'}
        </span>
        {value ? (
          <X 
            className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          />
        ) : (
          <ChevronDown className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 bg-white rounded-lg border border-slate-200 shadow-lg py-1 animate-scale-in">
          {/* Campo para añadir nuevo */}
          <div className="px-2 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd()}
                placeholder="Nombre personalizado..."
                className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleCustomAdd}
                disabled={!customValue.trim()}
                className="p-1 text-primary-600 hover:bg-primary-50 rounded disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de asignables predefinidos */}
          <div className="max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                !value ? 'bg-slate-50' : 'hover:bg-slate-50'
              )}
            >
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Sin asignar</span>
            </button>
            
            {ASSIGNEES.map((assignee) => {
              const isSelected = assignee === value;
              
              return (
                <button
                  key={assignee}
                  type="button"
                  onClick={() => {
                    onChange(assignee);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                    isSelected 
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <User className={cn(
                    'w-4 h-4',
                    isSelected ? 'text-primary-600' : 'text-slate-400'
                  )} />
                  <span className="font-medium">{assignee}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

