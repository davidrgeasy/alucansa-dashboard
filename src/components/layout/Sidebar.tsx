'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { areas } from '@/data/problems';
import { useFilters } from '@/store/useFilters';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Building2,
  ChevronRight,
  Factory
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { areaId, setAreaId } = useFilters();

  const handleAreaClick = (id: string) => {
    // Si ya está seleccionada, deseleccionar
    if (areaId === id) {
      setAreaId(null);
    } else {
      setAreaId(id);
    }
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/roadmap', label: 'Roadmap', icon: Calendar },
  ];

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 bg-primary-900 text-white',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ALUCANSA</h1>
              <p className="text-xs text-primary-300">Panel de Mejora</p>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                      isActive 
                        ? 'bg-primary-800 text-white' 
                        : 'text-primary-200 hover:bg-primary-800/50 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Separador */}
        <div className="px-4">
          <div className="h-px bg-primary-800" />
        </div>

        {/* Áreas */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-3 px-4">
            Áreas de Análisis
          </h2>
          <ul className="space-y-1">
            {areas.map((area) => {
              const isSelected = areaId === area.id;
              
              return (
                <li key={area.id}>
                  <button
                    onClick={() => handleAreaClick(area.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
                      isSelected 
                        ? 'bg-accent-500 text-white' 
                        : 'text-primary-200 hover:bg-primary-800/50 hover:text-white'
                    )}
                  >
                    <Building2 className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold opacity-70">{area.codigo}</div>
                      <div className="text-sm font-medium truncate">{area.nombre}</div>
                    </div>
                    <div className={cn(
                      'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary-800 text-primary-300'
                    )}>
                      {area.resumen.numProblemas}
                    </div>
                    <ChevronRight className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isSelected ? 'rotate-90' : ''
                    )} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-primary-800">
          <div className="text-xs text-primary-400 text-center">
            Consultoría de Procesos y Tecnología
          </div>
        </div>
      </aside>
    </>
  );
}

