'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExportButton } from '@/components/ui/ExportButton';
import { RoadmapReport } from '@/components/export';
import { getAllProblems, getAreaById } from '@/data/problems';
import { Problem, HorizonteTemporal } from '@/types';
import { 
  formatCurrency, 
  getImpactoLabel,
  cn
} from '@/lib/utils';
import { 
  Calendar, 
  ArrowRight, 
  Zap, 
  Clock, 
  Target,
  Building2,
  Euro,
  TrendingUp
} from 'lucide-react';

interface TimelineGroup {
  horizonte: HorizonteTemporal;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  problems: Problem[];
  totalCosteMin: number;
  totalCosteMax: number;
  avgRoi: number;
}

export default function RoadmapPage() {
  const allProblems = getAllProblems();

  const timelineGroups = useMemo<TimelineGroup[]>(() => {
    const groups: Record<HorizonteTemporal, Problem[]> = {
      corto: [],
      medio: [],
      largo: [],
    };

    allProblems.forEach((problem) => {
      groups[problem.urgencia].push(problem);
    });

    // Ordenar cada grupo por impacto (alto primero)
    const impactoOrder: Record<string, number> = { alto: 0, medio: 1, bajo: 2 };
    Object.keys(groups).forEach((key) => {
      groups[key as HorizonteTemporal].sort(
        (a, b) => impactoOrder[a.impacto] - impactoOrder[b.impacto]
      );
    });

    return [
      {
        horizonte: 'corto',
        label: 'Corto Plazo',
        description: '0-6 meses',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-500',
        problems: groups.corto,
        totalCosteMin: groups.corto.reduce((sum, p) => sum + p.coste.minimo, 0),
        totalCosteMax: groups.corto.reduce((sum, p) => sum + p.coste.maximo, 0),
        avgRoi: groups.corto.length > 0 
          ? Math.round(groups.corto.reduce((sum, p) => sum + (p.roi.minimo + p.roi.maximo) / 2, 0) / groups.corto.length)
          : 0,
      },
      {
        horizonte: 'medio',
        label: 'Medio Plazo',
        description: '6-18 meses',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        problems: groups.medio,
        totalCosteMin: groups.medio.reduce((sum, p) => sum + p.coste.minimo, 0),
        totalCosteMax: groups.medio.reduce((sum, p) => sum + p.coste.maximo, 0),
        avgRoi: groups.medio.length > 0 
          ? Math.round(groups.medio.reduce((sum, p) => sum + (p.roi.minimo + p.roi.maximo) / 2, 0) / groups.medio.length)
          : 0,
      },
      {
        horizonte: 'largo',
        label: 'Largo Plazo',
        description: '+18 meses',
        icon: <Target className="w-5 h-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-500',
        problems: groups.largo,
        totalCosteMin: groups.largo.reduce((sum, p) => sum + p.coste.minimo, 0),
        totalCosteMax: groups.largo.reduce((sum, p) => sum + p.coste.maximo, 0),
        avgRoi: groups.largo.length > 0 
          ? Math.round(groups.largo.reduce((sum, p) => sum + (p.roi.minimo + p.roi.maximo) / 2, 0) / groups.largo.length)
          : 0,
      },
    ];
  }, [allProblems]);

  const impactoBadgeVariant = {
    alto: 'alto' as const,
    medio: 'medio' as const,
    bajo: 'bajo' as const,
  };

  // Ref para exportación PDF (informe)
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <DashboardLayout
      title="Roadmap de Implementación"
      subtitle="Cronograma de mejoras por horizonte temporal"
    >
      {/* Botón de exportación */}
      <div className="flex justify-end mb-6 no-print">
        <ExportButton
          targetRef={reportRef}
          options={{
            filename: 'informe-roadmap-alucansa',
            title: '',
            subtitle: '',
            orientation: 'portrait',
          }}
          label="Exportar Informe"
        />
      </div>

      {/* Informe oculto para exportación PDF */}
      <div className="fixed left-[-9999px] top-0">
        <div ref={reportRef}>
          <RoadmapReport problems={allProblems} />
        </div>
      </div>

      <div className="space-y-8">
        {/* Resumen visual del timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {timelineGroups.map((group, index) => (
            <div
              key={group.horizonte}
              className={cn(
                'rounded-xl p-5 border-l-4',
                group.bgColor,
                group.borderColor
              )}
              style={{ 
                opacity: 0, 
                animation: `fadeIn 0.4s ease-out forwards`,
                animationDelay: `${index * 100}ms` 
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2 rounded-lg', group.bgColor, group.color)}>
                  {group.icon}
                </div>
                <div>
                  <h3 className={cn('font-semibold', group.color)}>{group.label}</h3>
                  <p className="text-sm text-slate-500">{group.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-slate-500">Problemas</p>
                  <p className={cn('text-lg font-bold', group.color)}>
                    {group.problems.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Inversión</p>
                  <p className="text-sm font-semibold text-primary-900">
                    {formatCurrency(group.totalCosteMin)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">ROI medio</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {group.avgRoi}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline detallado */}
        <div className="space-y-8">
          {timelineGroups.map((group, groupIndex) => (
            <section 
              key={group.horizonte} 
              className="animate-fade-in"
              style={{ 
                opacity: 0, 
                animationDelay: `${(groupIndex + 3) * 100}ms` 
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  group.bgColor,
                  group.color
                )}>
                  {group.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-900">
                    {group.label}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {group.problems.length} {group.problems.length === 1 ? 'problema' : 'problemas'} • 
                    Inversión: {formatCurrency(group.totalCosteMin)} - {formatCurrency(group.totalCosteMax)}
                  </p>
                </div>
              </div>

              {group.problems.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500">
                    No hay problemas programados para este horizonte temporal
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Línea vertical del timeline */}
                  <div className={cn(
                    'absolute left-5 top-0 bottom-0 w-0.5 hidden md:block',
                    group.horizonte === 'corto' ? 'bg-emerald-200' : '',
                    group.horizonte === 'medio' ? 'bg-blue-200' : '',
                    group.horizonte === 'largo' ? 'bg-purple-200' : ''
                  )} />

                  <div className="space-y-4">
                    {group.problems.map((problem, problemIndex) => {
                      const area = getAreaById(problem.areaId);
                      
                      return (
                        <div
                          key={problem.id}
                          className="relative flex items-start gap-4 md:ml-10"
                        >
                          {/* Punto del timeline */}
                          <div className={cn(
                            'absolute -left-10 top-4 w-3 h-3 rounded-full border-2 hidden md:block',
                            group.horizonte === 'corto' ? 'bg-emerald-500 border-emerald-200' : '',
                            group.horizonte === 'medio' ? 'bg-blue-500 border-blue-200' : '',
                            group.horizonte === 'largo' ? 'bg-purple-500 border-purple-200' : ''
                          )} />

                          {/* Card del problema */}
                          <Card 
                            hover 
                            className="flex-1"
                          >
                            <CardContent className="py-4">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Info principal */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-primary-900">{problem.id}</span>
                                    <Badge variant={impactoBadgeVariant[problem.impacto]} size="sm">
                                      {getImpactoLabel(problem.impacto)}
                                    </Badge>
                                  </div>
                                  <h3 className="text-base font-semibold text-primary-900 mb-2">
                                    {problem.titulo}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Building2 className="w-4 h-4" />
                                    <span>{area?.nombre}</span>
                                  </div>
                                </div>

                                {/* Métricas */}
                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Euro className="w-4 h-4 text-slate-400" />
                                    <span className="text-primary-900 font-medium">
                                      {formatCurrency(problem.coste.minimo)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    <span className="text-emerald-600 font-medium">
                                      {problem.roi.minimo}-{problem.roi.maximo}%
                                    </span>
                                  </div>
                                  <Link
                                    href={`/problemas/${problem.id}`}
                                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                                  >
                                    Ver
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>

                              {/* Barra de progreso visual */}
                              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all duration-500',
                                    group.horizonte === 'corto' ? 'bg-emerald-400' : '',
                                    group.horizonte === 'medio' ? 'bg-blue-400' : '',
                                    group.horizonte === 'largo' ? 'bg-purple-400' : ''
                                  )}
                                  style={{ 
                                    width: `${Math.min(100, (problemIndex + 1) / group.problems.length * 100)}%`,
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Resumen final */}
        <Card className="animate-fade-in" style={{ opacity: 0, animationDelay: '600ms' }}>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
              <Calendar className="w-5 h-5 text-primary-600" />
              Resumen del Roadmap
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Problemas</p>
                <p className="text-2xl font-bold text-primary-900">{allProblems.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Inversión Total (mín)</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatCurrency(timelineGroups.reduce((sum, g) => sum + g.totalCosteMin, 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Inversión Total (máx)</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatCurrency(timelineGroups.reduce((sum, g) => sum + g.totalCosteMax, 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Problemas Alto Impacto</p>
                <p className="text-2xl font-bold text-accent-600">
                  {allProblems.filter(p => p.impacto === 'alto').length}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-800 leading-relaxed">
                <strong>Recomendación:</strong> Priorizar los problemas de corto plazo con alto impacto 
                para obtener quick wins y demostrar resultados tangibles. Las mejoras de medio y largo 
                plazo deben planificarse en paralelo para garantizar una transformación sostenible.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

