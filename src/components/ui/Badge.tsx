'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'alto' | 'medio' | 'bajo' | 'corto' | 'medio-plazo' | 'largo';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-primary-100 text-primary-900',
  alto: 'bg-accent-500 text-white',
  medio: 'bg-amber-500 text-white',
  bajo: 'bg-industrial-aluminum text-primary-900',
  corto: 'bg-emerald-500 text-white',
  'medio-plazo': 'bg-blue-500 text-white',
  largo: 'bg-purple-500 text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

