'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExportButton } from '@/components/ui/ExportButton';
import { AreaReport } from '@/components/export';
import { getAreaById, areas } from '@/data/problems';
import { 
  formatCurrency,
  formatCurrencyRange, 
  formatPercentageRange, 
  getHorizonteLabel,
  getImpactoLabel,
  cn
} from '@/lib/utils';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Building2,
  Euro,
  TrendingUp,
  Target,
  Clock,
  BarChart3,
  ChevronRight,
  PieChart,
  Wallet,
  PiggyBank
} from 'lucide-react';

export default function AreaDetailPage() {
  const params = useParams();
  const areaId = params.id as string;
  
  const area = getAreaById(areaId);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!area) {
    return (
      <DashboardLayout title="Área no encontrada">
        <div className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            Área no encontrada
          </h2>
          <p className="text-slate-500 mb-6">
            El área con ID &quot;{areaId}&quot; no existe en el sistema.
          </p>
          <Button href="/" variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calcular métricas del área
  const totalCosteMin = area.problemas.reduce((sum, p) => sum + p.coste.minimo, 0);
  const totalCosteMax = area.problemas.reduce((sum, p) => sum + p.coste.maximo, 0);
  const avgRoi = area.problemas.length > 0
    ? Math.round(area.problemas.reduce((sum, p) => sum + (p.roi.minimo + p.roi.maximo) / 2, 0) / area.problemas.length)
    : 0;
  const problemasAlto = area.problemas.filter(p => p.impacto === 'alto').length;
  const problemasMedio = area.problemas.filter(p => p.impacto === 'medio').length;
  const problemasBajo = area.problemas.filter(p => p.impacto === 'bajo').length;
  const problemasCorto = area.problemas.filter(p => p.urgencia === 'corto').length;
  const problemasMedioP = area.problemas.filter(p => p.urgencia === 'medio').length;
  const problemasLargo = area.problemas.filter(p => p.urgencia === 'largo').length;

  const impactoBadgeVariant = {
    alto: 'alto' as const,
    medio: 'medio' as const,
    bajo: 'bajo' as const,
  };

  const horizonteBadgeVariant = {
    corto: 'corto' as const,
    medio: 'medio-plazo' as const,
    largo: 'largo' as const,
  };

  const prioridadBadgeVariant = {
    alto: 'alto' as const,
    medio: 'medio' as const,
    bajo: 'bajo' as const,
  };

  return (
    <DashboardLayout
      title={`${area.codigo}: ${area.nombre}`}
      subtitle={area.descripcion}
    >
      <div className="max-w-6xl mx-auto">
        {/* Navegación y botón de exportación */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors no-print"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>

          <ExportButton
            targetRef={reportRef}
            options={{
              filename: `informe-area-${area.codigo.toLowerCase()}`,
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
            <AreaReport area={area} />
          </div>
        </div>

        {/* Contenido visible */}
        <div className="space-y-6">
          {/* Header con prioridad */}
          <div className="flex items-center gap-3 animate-fade-in delay-100" style={{ opacity: 0 }}>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">{area.nombre}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">Prioridad:</span>
                <Badge variant={prioridadBadgeVariant[area.prioridad]} size="sm">
                  {area.prioridad.charAt(0).toUpperCase() + area.prioridad.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* KPIs del área */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in delay-200" style={{ opacity: 0 }}>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Problemas</p>
                    <p className="text-2xl font-bold text-primary-900">{area.problemas.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-50 rounded-lg">
                    <Wallet className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Inversión</p>
                    <p className="text-lg font-bold text-primary-900">
                      {formatCurrency(totalCosteMin)}
                    </p>
                    <p className="text-xs text-slate-400">
                      hasta {formatCurrency(totalCosteMax)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">ROI Medio</p>
                    <p className="text-2xl font-bold text-emerald-600">{avgRoi}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Alto Impacto</p>
                    <p className="text-2xl font-bold text-red-600">{problemasAlto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribución */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-300" style={{ opacity: 0 }}>
            {/* Por impacto */}
            <Card>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <Target className="w-5 h-5 text-primary-600" />
                  Distribución por Impacto
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent-500 rounded-full" />
                      <span className="text-sm text-slate-700">Alto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-500 rounded-full"
                          style={{ width: `${(problemasAlto / area.problemas.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-6 text-right">{problemasAlto}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full" />
                      <span className="text-sm text-slate-700">Medio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${(problemasMedio / area.problemas.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-6 text-right">{problemasMedio}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-400 rounded-full" />
                      <span className="text-sm text-slate-700">Bajo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${(problemasBajo / area.problemas.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-6 text-right">{problemasBajo}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Por horizonte */}
            <Card>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <Clock className="w-5 h-5 text-primary-600" />
                  Distribución por Horizonte
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="text-sm text-slate-700">Corto plazo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(problemasCorto / area.problemas.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-6 text-right">{problemasCorto}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm text-slate-700">Medio plazo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(problemasMedioP / area.problemas.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-6 text-right">{problemasMedioP}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-sm text-slate-700">Largo plazo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(problemasLargo / area.problemas.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-6 text-right">{problemasLargo}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de problemas */}
          <Card className="animate-fade-in delay-400" style={{ opacity: 0 }}>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                Problemas del Área ({area.problemas.length})
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {area.problemas.map((problem, index) => (
                  <div 
                    key={problem.id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-primary-900">{problem.id}</span>
                          <Badge variant={impactoBadgeVariant[problem.impacto]} size="sm">
                            {getImpactoLabel(problem.impacto)}
                          </Badge>
                          <Badge variant={horizonteBadgeVariant[problem.urgencia]} size="sm">
                            {problem.urgencia === 'corto' ? 'Corto' : problem.urgencia === 'medio' ? 'Medio' : 'Largo'}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-primary-900 mb-1">
                          {problem.titulo}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {problem.descripcion}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Coste</p>
                          <p className="font-semibold text-primary-900">
                            {formatCurrency(problem.coste.minimo)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">ROI</p>
                          <p className="font-semibold text-emerald-600">
                            {problem.roi.minimo}-{problem.roi.maximo}%
                          </p>
                        </div>
                        <Link
                          href={`/problemas/${problem.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors no-print"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumen de inversión */}
          <Card className="animate-fade-in delay-500 border-l-4 border-l-primary-500" style={{ opacity: 0 }}>
            <CardContent className="py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Inversión Total Estimada</p>
                  <p className="text-xl font-bold text-primary-900">
                    {formatCurrencyRange(totalCosteMin, totalCosteMax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">ROI Medio Esperado</p>
                  <p className="text-xl font-bold text-emerald-600">{avgRoi}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Prioridad de Abordaje</p>
                  <Badge variant={prioridadBadgeVariant[area.prioridad]} size="md">
                    {area.prioridad.charAt(0).toUpperCase() + area.prioridad.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

