'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { UserRole, ROLE_CONFIG } from '@/types/auth';
import { cn } from '@/lib/utils';
import { 
  User, 
  ChevronDown, 
  LogOut, 
  Shield,
  Check,
  Settings
} from 'lucide-react';

export function UserMenu() {
  const router = useRouter();
  const { user, logout, setRole, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
          'bg-primary-900 text-white hover:bg-primary-800',
          'transition-colors duration-200'
        )}
      >
        <User className="w-4 h-4" />
        Iniciar sesión
      </button>
    );
  }

  const roleConfig = ROLE_CONFIG[user.role];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
          'bg-white border border-slate-200 hover:bg-slate-50',
          'transition-colors duration-200'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center',
          roleConfig.bgColor
        )}>
          <User className={cn('w-4 h-4', roleConfig.color)} />
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-medium text-slate-700 leading-tight">{user.name}</p>
          <p className={cn('text-xs', roleConfig.color)}>{roleConfig.label}</p>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-slate-400 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg z-50 animate-scale-in overflow-hidden">
          {/* Info del usuario */}
          <div className="p-3 border-b border-slate-100">
            <p className="font-medium text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className={cn(
              'inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium',
              roleConfig.bgColor,
              roleConfig.color
            )}>
              <Shield className="w-3 h-3" />
              {roleConfig.label}
            </div>
          </div>

          {/* Cambio de rol (demo) */}
          <div className="p-2 border-b border-slate-100">
            <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase">
              Cambiar rol (demo)
            </p>
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
              const config = ROLE_CONFIG[role];
              const isSelected = role === user.role;
              
              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left',
                    'transition-colors duration-200',
                    isSelected 
                      ? cn(config.bgColor, config.color)
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    config.bgColor
                  )}>
                    <User className={cn('w-3 h-3', config.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{config.label}</p>
                    <p className="text-xs text-slate-500">{config.canEdit ? 'Puede editar' : 'Solo lectura'}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm',
                'text-red-600 hover:bg-red-50',
                'transition-colors duration-200'
              )}
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

