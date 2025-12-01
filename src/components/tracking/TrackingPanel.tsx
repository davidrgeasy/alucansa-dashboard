'use client';

import { ProblemTracking, STATUS_CONFIG, PRIORITY_CONFIG } from '@/types/tracking';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatusSelect } from './StatusSelect';
import { PrioritySelect } from './PrioritySelect';
import { AssigneeSelect } from './AssigneeSelect';
import { ProgressSlider } from './ProgressSlider';
import { DateInput } from './DateInput';
import { ReadOnlyBadge } from '@/components/auth';
import { useCanEdit } from '@/store/useAuth';
import { cn } from '@/lib/utils';
import { 
  Settings2, 
  Clock, 
  User, 
  CalendarDays,
  Target,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface TrackingPanelProps {
  tracking: ProblemTracking;
  onStatusChange: (status: ProblemTracking['status']) => void;
  onPriorityChange: (priority: ProblemTracking['internalPriority']) => void;
  onAssigneeChange: (assignee: string | null) => void;
  onProgressChange: (progress: number) => void;
  onDatesChange: (dates: { 
    startDate?: string | null; 
    targetDate?: string | null;
    completedDate?: string | null;
  }) => void;
  className?: string;
}

function formatLastUpdated(isoString: string): string {
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
  });
}

export function TrackingPanel({
  tracking,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onProgressChange,
  onDatesChange,
  className,
}: TrackingPanelProps) {
  const statusConfig = STATUS_CONFIG[tracking.status];
  const canEdit = useCanEdit();

  return (
    <Card className={cn('overflow-visible relative z-10', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
            <Settings2 className="w-5 h-5 text-primary-600" />
            Seguimiento
          </h2>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Activity className="w-3 h-3" />
            {formatLastUpdated(tracking.lastUpdated)}
          </span>
        </div>
        {/* Badge de solo lectura */}
        {!canEdit && (
          <div className="mt-2">
            <ReadOnlyBadge />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6" allowOverflow>
        {/* Estado */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            Estado
          </label>
          <StatusSelect
            value={tracking.status}
            onChange={onStatusChange}
            disabled={!canEdit}
          />
        </div>

        {/* Prioridad Interna */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Target className="w-4 h-4 text-slate-400" />
            Prioridad Interna
          </label>
          <PrioritySelect
            value={tracking.internalPriority}
            onChange={onPriorityChange}
            disabled={!canEdit}
          />
        </div>

        {/* Responsable */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            Responsable
          </label>
          <AssigneeSelect
            value={tracking.assignee}
            onChange={onAssigneeChange}
            disabled={!canEdit}
          />
        </div>

        {/* Separador */}
        <hr className="border-slate-100" />

        {/* Progreso */}
        <ProgressSlider
          value={tracking.progress}
          onChange={onProgressChange}
          disabled={!canEdit}
        />

        {/* Separador */}
        <hr className="border-slate-100" />

        {/* Fechas */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            Fechas
          </h3>

          <DateInput
            label="Fecha de Inicio"
            value={tracking.startDate}
            onChange={(date) => onDatesChange({ startDate: date })}
            disabled={!canEdit}
          />

          <DateInput
            label="Fecha Objetivo"
            value={tracking.targetDate}
            onChange={(date) => onDatesChange({ targetDate: date })}
            disabled={!canEdit}
          />

          {tracking.status === 'completado' && (
            <DateInput
              label="Fecha Completado"
              value={tracking.completedDate}
              onChange={(date) => onDatesChange({ completedDate: date })}
              disabled={!canEdit}
            />
          )}
        </div>

        {/* Resumen visual */}
        {tracking.status !== 'pendiente' && (
          <>
            <hr className="border-slate-100" />
            <div className={cn(
              'p-4 rounded-lg',
              statusConfig.bgColor
            )}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={cn('w-5 h-5', statusConfig.color)} />
                <span className={cn('font-semibold', statusConfig.color)}>
                  {statusConfig.label}
                </span>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                {tracking.assignee && (
                  <p>Asignado a: <strong>{tracking.assignee}</strong></p>
                )}
                <p>Progreso: <strong>{tracking.progress}%</strong></p>
                <p>Seguimientos: <strong>{tracking.followUps.length}</strong></p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

