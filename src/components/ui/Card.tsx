'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-card',
        hover && 'transition-all duration-200 hover:shadow-industrial hover:border-primary-300 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 py-4 border-b border-slate-100', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, allowOverflow = false }: { children: React.ReactNode; className?: string; allowOverflow?: boolean }) {
  return (
    <div className={cn('px-5 py-4', allowOverflow && 'overflow-visible', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl', className)}>
      {children}
    </div>
  );
}

