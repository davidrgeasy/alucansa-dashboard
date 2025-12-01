'use client';

import { useState } from 'react';
import { FollowUp, FollowUpType, FOLLOWUP_TYPE_CONFIG } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  RefreshCw, 
  AlertOctagon, 
  CheckSquare, 
  GitBranch,
  Flag,
  Trash2,
  MoreVertical,
  Clock,
  User
} from 'lucide-react';

interface FollowUpTimelineProps {
  followUps: FollowUp[];
  onDelete?: (followUpId: string) => void;
  className?: string;
}

const TYPE_ICONS: Record<FollowUpType, React.ReactNode> = {
  nota: <FileText className="w-4 h-4" />,
  actualizacion: <RefreshCw className="w-4 h-4" />,
  bloqueo: <AlertOctagon className="w-4 h-4" />,
  resolucion: <CheckSquare className="w-4 h-4" />,
  decision: <GitBranch className="w-4 h-4" />,
  hito: <Flag className="w-4 h-4" />,
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface FollowUpItemProps {
  followUp: FollowUp;
  onDelete?: () => void;
  isLast: boolean;
}

function FollowUpItem({ followUp, onDelete, isLast }: FollowUpItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const config = FOLLOWUP_TYPE_CONFIG[followUp.type];

  return (
    <div className="relative flex gap-4">
      {/* Línea vertical del timeline */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-200" />
      )}

      {/* Icono del tipo */}
      <div className={cn(
        'relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        config.bgColor,
        config.color
      )}>
        {TYPE_ICONS[followUp.type]}
      </div>

      {/* Contenido */}
      <div className="flex-1 pb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                config.bgColor,
                config.color
              )}>
                {config.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <User className="w-3 h-3" />
                {followUp.author}
              </span>
              <span 
                className="flex items-center gap-1 text-xs text-slate-400"
                title={formatFullDate(followUp.createdAt)}
              >
                <Clock className="w-3 h-3" />
                {formatDate(followUp.createdAt)}
              </span>
            </div>

            {/* Menú de acciones */}
            {onDelete && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)} 
                    />
                    <div className="absolute right-0 z-20 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-scale-in">
                      <button
                        type="button"
                        onClick={() => {
                          onDelete();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Contenido del seguimiento */}
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {followUp.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FollowUpTimeline({ followUps, onDelete, className }: FollowUpTimelineProps) {
  if (followUps.length === 0) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}>
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-600 mb-1">
          Sin seguimientos
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Añade el primer seguimiento para empezar a registrar el progreso de este problema.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      {followUps.map((followUp, index) => (
        <FollowUpItem
          key={followUp.id}
          followUp={followUp}
          onDelete={onDelete ? () => onDelete(followUp.id) : undefined}
          isLast={index === followUps.length - 1}
        />
      ))}
    </div>
  );
}

