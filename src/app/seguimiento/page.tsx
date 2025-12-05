'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { useProblems } from '@/store/useProblems';
import { useTracking } from '@/store/useTracking';
import { 
  ProblemStatus, 
  InternalPriority, 
  STATUS_CONFIG, 
  PRIORITY_CONFIG,
  ASSIGNEES 
} from '@/types/tracking';
import { Problem, HorizonteTemporal } from '@/types';
import { 
  formatCurrency,
  getImpactoLabel,
  cn
} from '@/lib/utils';
import { 
  Activity,
  Filter,
  RotateCcw,
  ChevronRight,
  User,
  Clock,
  Target,
  Building2,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Search,
  Loader2,
  XCircle,
  Circle,
  BarChart3,
  Users
} from 'lucide-react';

// Iconos de estado
const STATUS_ICONS: Record<ProblemStatus, React.ReactNode> = {
  pendiente: <Circle className="w-4 h-4" />,
  en_analisis: <Search className="w-4 h-4" />,
  en_progreso: <Loader2 className="w-4 h-4" />,
  bloqueado: <AlertTriangle className="w-4 h-4" />,
  completado: <CheckCircle2 className="w-4 h-4" />,
  descartado: <XCircle className="w-4 h-4" />,
};

interface ProjectWithTracking {
  problem: Problem;
  tracking: {
    status: ProblemStatus;
    internalPriority: InternalPriority;
    assignee: string | null;
    progress: number;
    startDate: string | null;
    targetDate: string | null;
    followUps: number;
    lastUpdated: string;
  };
}

export default function SeguimientoPage() {
  // Suscribirse a los datos del store para detectar cambios
  const customProblems = useProblems((state) => state.customProblems);
  const customAreas = useProblems((state) => state.customAreas);
  const problemEdits = useProblems((state) => state.problemEdits);
  const areaEdits = useProblems((state) => state.areaEdits);
  
  const { getAllProblems, getAreaById, getAllAreas } = useProblems();
  
  // Recalcular cuando cambien los datos del store
  const allProblems = useMemo(() => getAllProblems(), [customProblems, customAreas, problemEdits, areaEdits, getAllProblems]);
  const areas = useMemo(() => getAllAreas(), [customProblems, customAreas, problemEdits, areaEdits, getAllAreas]);
  
  const { getTracking, getAllTracking } = useTracking();
  
  // Estado de hidratación
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<InternalPriority | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [horizonteFilter, setHorizonteFilter] = useState<HorizonteTemporal | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Obtener proyectos con tracking (excluyendo pendientes sin actividad)
  const projectsWithTracking = useMemo<ProjectWithTracking[]>(() => {
    if (!isHydrated) return [];
    
    return allProblems
      .map((problem) => {
        const tracking = getTracking(problem.id);
        return {
          problem,
          tracking: {
            status: tracking.status,
            internalPriority: tracking.internalPriority,
            assignee: tracking.assignee,
            progress: tracking.progress,
            startDate: tracking.startDate,
            targetDate: tracking.targetDate,
            followUps: tracking.followUps.length,
            lastUpdated: tracking.lastUpdated,
          },
        };
      })
      // Solo mostrar proyectos que no están pendientes O que tienen alguna actividad
      .filter((p) => 
        p.tracking.status !== 'pendiente' || 
        p.tracking.followUps > 0 || 
        p.tracking.assignee !== null
      );
  }, [isHydrated, allProblems, getTracking]);

  // Aplicar filtros
  const filteredProjects = useMemo(() => {
    return projectsWithTracking.filter((p) => {
      if (statusFilter && p.tracking.status !== statusFilter) return false;
      if (priorityFilter && p.tracking.internalPriority !== priorityFilter) return false;
      if (assigneeFilter && p.tracking.assignee !== assigneeFilter) return false;
      if (areaFilter && p.problem.areaId !== areaFilter) return false;
      if (horizonteFilter && p.problem.urgencia !== horizonteFilter) return false;
      return true;
    });
  }, [projectsWithTracking, statusFilter, priorityFilter, assigneeFilter, areaFilter, horizonteFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    const all = projectsWithTracking;
    return {
      total: all.length,
      enProgreso: all.filter(p => p.tracking.status === 'en_progreso').length,
      enAnalisis: all.filter(p => p.tracking.status === 'en_analisis').length,
      bloqueados: all.filter(p => p.tracking.status === 'bloqueado').length,
      completados: all.filter(p => p.tracking.status === 'completado').length,
      sinAsignar: all.filter(p => !p.tracking.assignee).length,
    };
  }, [projectsWithTracking]);

  // Opciones de filtros
  const statusOptions = (Object.keys(STATUS_CONFIG) as ProblemStatus[])
    .filter(s => s !== 'pendiente')
    .map(status => ({
      value: status,
      label: STATUS_CONFIG[status].label,
    }));

  const priorityOptions = (Object.keys(PRIORITY_CONFIG) as InternalPriority[]).map(priority => ({
    value: priority,
    label: PRIORITY_CONFIG[priority].label,
  }));

  const assigneeOptions = useMemo(() => {
    const assignees = new Set<string>();
    projectsWithTracking.forEach(p => {
      if (p.tracking.assignee) assignees.add(p.tracking.assignee);
    });
    return Array.from(assignees).map(a => ({ value: a, label: a }));
  }, [projectsWithTracking]);

  const areaOptions = areas.map(area => ({
    value: area.id,
    label: `${area.codigo}: ${area.nombre}`,
  }));

  const horizonteOptions = [
    { value: 'corto', label: 'Corto plazo' },
    { value: 'medio', label: 'Medio plazo' },
    { value: 'largo', label: 'Largo plazo' },
  ];

  const hasActiveFilters = statusFilter || priorityFilter || assigneeFilter || areaFilter || horizonteFilter;

  const resetFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setAssigneeFilter(null);
    setAreaFilter(null);
    setHorizonteFilter(null);
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatLastUpdated = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays < 1) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatDate(isoString);
  };

  const impactoBadgeVariant = {
    alto: 'alto' as const,
    medio: 'medio' as const,
    bajo: 'bajo' as const,
  };

  return (
    <DashboardLayout
      title="Seguimiento de Proyectos"
      subtitle="Control y estado de los problemas en curso"
    >
      <div className="space-y-6">
        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-600">Total activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-900">{stats.enProgreso}</p>
                  <p className="text-xs text-amber-600">En progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-900">{stats.enAnalisis}</p>
                  <p className="text-xs text-purple-600">En análisis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{stats.bloqueados}</p>
                  <p className="text-xs text-red-600">Bloqueados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{stats.completados}</p>
                  <p className="text-xs text-emerald-600">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-slate-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.sinAsignar}</p>
                  <p className="text-xs text-slate-600">Sin asignar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="animate-fade-in delay-100" style={{ opacity: 0 }}>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-primary-900">Filtros</h2>
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                  Activos
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Select
                label="Estado"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as ProblemStatus | null)}
                options={statusOptions}
                placeholder="Todos"
              />

              <Select
                label="Prioridad"
                value={priorityFilter}
                onChange={(v) => setPriorityFilter(v as InternalPriority | null)}
                options={priorityOptions}
                placeholder="Todas"
              />

              <Select
                label="Responsable"
                value={assigneeFilter}
                onChange={setAssigneeFilter}
                options={assigneeOptions}
                placeholder="Todos"
              />

              <Select
                label="Área"
                value={areaFilter}
                onChange={setAreaFilter}
                options={areaOptions}
                placeholder="Todas"
              />

              <Select
                label="Horizonte"
                value={horizonteFilter}
                onChange={(v) => setHorizonteFilter(v as HorizonteTemporal | null)}
                options={horizonteOptions}
                placeholder="Todos"
              />

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-colors duration-200',
                    hasActiveFilters
                      ? 'text-primary-700 hover:bg-slate-100'
                      : 'text-slate-400 cursor-not-allowed'
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpiar
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de proyectos */}
        <div className="animate-fade-in delay-200" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary-900">
              Proyectos en Seguimiento
            </h2>
            <span className="text-sm text-slate-500">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}
            </span>
          </div>

          {!isHydrated ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  No hay proyectos activos
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {hasActiveFilters 
                    ? 'No hay proyectos que coincidan con los filtros seleccionados.'
                    : 'Los proyectos aparecerán aquí cuando inicies su seguimiento desde la vista de detalle.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const { problem, tracking } = project;
                const area = getAreaById(problem.areaId);
                const statusConfig = STATUS_CONFIG[tracking.status];
                const priorityConfig = PRIORITY_CONFIG[tracking.internalPriority];

                return (
                  <Card key={problem.id} hover className="overflow-hidden">
                    <div className="flex items-stretch">
                      {/* Indicador de estado lateral */}
                      <div className={cn(
                        'w-1.5 flex-shrink-0',
                        tracking.status === 'en_progreso' && 'bg-amber-500',
                        tracking.status === 'en_analisis' && 'bg-blue-500',
                        tracking.status === 'bloqueado' && 'bg-red-500',
                        tracking.status === 'completado' && 'bg-emerald-500',
                        tracking.status === 'descartado' && 'bg-slate-400',
                        tracking.status === 'pendiente' && 'bg-slate-300',
                      )} />

                      <CardContent className="flex-1 py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Info principal */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-primary-900">{problem.id}</span>
                              <Badge variant={impactoBadgeVariant[problem.impacto]} size="sm">
                                {getImpactoLabel(problem.impacto)}
                              </Badge>
                              <span className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                                statusConfig.bgColor,
                                statusConfig.color
                              )}>
                                {STATUS_ICONS[tracking.status]}
                                {statusConfig.label}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-primary-900 truncate mb-2">
                              {problem.titulo}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {area?.codigo}
                              </span>
                              {tracking.assignee && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {tracking.assignee}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Actualizado {formatLastUpdated(tracking.lastUpdated)}
                              </span>
                            </div>
                          </div>

                          {/* Métricas */}
                          <div className="flex items-center gap-6 text-sm">
                            {/* Progreso */}
                            <div className="hidden sm:block w-32">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-500">Progreso</span>
                                <span className="text-xs font-semibold text-primary-900">{tracking.progress}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    tracking.progress >= 100 ? 'bg-emerald-500' :
                                    tracking.progress >= 50 ? 'bg-amber-400' : 'bg-slate-300'
                                  )}
                                  style={{ width: `${tracking.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Prioridad */}
                            <div className="hidden md:block text-center">
                              <p className="text-xs text-slate-500 mb-1">Prioridad</p>
                              <span className={cn(
                                'inline-block px-2 py-0.5 rounded text-xs font-medium',
                                priorityConfig.bgColor,
                                priorityConfig.color
                              )}>
                                {priorityConfig.label}
                              </span>
                            </div>

                            {/* Fecha objetivo */}
                            <div className="hidden lg:block text-center">
                              <p className="text-xs text-slate-500 mb-1">Objetivo</p>
                              <span className="text-xs font-medium text-primary-900">
                                {formatDate(tracking.targetDate)}
                              </span>
                            </div>

                            {/* Seguimientos */}
                            <div className="text-center">
                              <p className="text-xs text-slate-500 mb-1">Notas</p>
                              <span className="text-xs font-bold text-primary-900">
                                {tracking.followUps}
                              </span>
                            </div>

                            {/* Enlace */}
                            <Link
                              href={`/problemas/${problem.id}`}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

