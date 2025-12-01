'use client';

import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserMenu } from '@/components/auth';

interface HeaderProps {
  title: string;
  subtitle?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ title, subtitle, isSidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Toggle del menú móvil */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>

            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-primary-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Datos actualizados
            </div>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

