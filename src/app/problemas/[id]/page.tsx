'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getProblemById, getAreaByProblemId } from '@/data/problems';
import { 
  formatCurrencyRange, 
  formatPercentageRange, 
  getHorizonteLabel,
  getImpactoLabel
} from '@/lib/utils';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Target, 
  Eye, 
  Lightbulb, 
  ListChecks,
  Euro,
  TrendingUp,
  Clock,
  Link2,
  Tag,
  FileText,
  Building2
} from 'lucide-react';

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = params.id as string;
  
  const problem = getProblemById(problemId);
  const area = problem ? getAreaByProblemId(problem.id) : undefined;

  if (!problem || !area) {
    return (
      <DashboardLayout title="Problema no encontrado">
        <div className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            Problema no encontrado
          </h2>
          <p className="text-slate-500 mb-6">
            El problema con ID &quot;{problemId}&quot; no existe en el sistema.
          </p>
          <Button href="/" variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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

  return (
    <DashboardLayout
      title={`${problem.id}: ${problem.titulo}`}
      subtitle={`${area.codigo} - ${area.nombre}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navegación */}
        <div className="animate-fade-in">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>
        </div>

        {/* Header con badges */}
        <div className="flex flex-wrap items-center gap-3 animate-fade-in delay-100" style={{ opacity: 0 }}>
          <Badge variant={impactoBadgeVariant[problem.impacto]} size="md">
            Impacto {getImpactoLabel(problem.impacto)}
          </Badge>
          <Badge variant={horizonteBadgeVariant[problem.urgencia]} size="md">
            {getHorizonteLabel(problem.urgencia)}
          </Badge>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
            <Building2 className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700">{area.nombre}</span>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción del problema */}
            <Card className="animate-fade-in delay-200" style={{ opacity: 0 }}>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Descripción del Problema
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  {problem.descripcion}
                </p>
              </CardContent>
            </Card>

            {/* Causas */}
            <Card className="animate-fade-in delay-300" style={{ opacity: 0 }}>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <Target className="w-5 h-5 text-accent-500" />
                  Causas Identificadas
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {problem.causas.map((causa, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{causa}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Evidencias */}
            <Card className="animate-fade-in delay-400" style={{ opacity: 0 }}>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <Eye className="w-5 h-5 text-purple-500" />
                  Evidencias Observadas
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {problem.evidencias.map((evidencia, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-400 rounded-full" />
                      <span className="text-slate-700">{evidencia}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Solución Propuesta */}
            <Card className="animate-fade-in delay-500" style={{ opacity: 0 }}>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Solución Propuesta
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {problem.solucionPropuesta}
                </p>
                
                <h3 className="flex items-center gap-2 text-base font-semibold text-primary-900 mb-4">
                  <ListChecks className="w-5 h-5 text-emerald-500" />
                  Pasos de Implementación
                </h3>
                <ol className="space-y-3">
                  {problem.pasosImplementacion.map((paso, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{paso}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar derecha */}
          <div className="space-y-6">
            {/* Métricas económicas */}
            <Card className="animate-fade-in delay-200" style={{ opacity: 0 }}>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <Euro className="w-5 h-5 text-primary-600" />
                  Inversión y Retorno
                </h2>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Coste */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Coste Estimado</p>
                  <p className="text-xl font-bold text-primary-900">
                    {formatCurrencyRange(problem.coste.minimo, problem.coste.maximo)}
                  </p>
                </div>

                {/* ROI */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">ROI Estimado</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatPercentageRange(problem.roi.minimo, problem.roi.maximo)}
                  </p>
                  <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(problem.roi.maximo / 3, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Horizonte */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Horizonte Temporal</p>
                  <Badge variant={horizonteBadgeVariant[problem.urgencia]} size="md">
                    {getHorizonteLabel(problem.urgencia)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Dependencias */}
            {problem.dependencias && problem.dependencias.length > 0 && (
              <Card className="animate-fade-in delay-300" style={{ opacity: 0 }}>
                <CardHeader>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                    <Link2 className="w-5 h-5 text-blue-500" />
                    Dependencias
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-3">
                    Este problema depende de la resolución de:
                  </p>
                  <div className="space-y-2">
                    {problem.dependencias.map((depId) => (
                      <Link
                        key={depId}
                        href={`/problemas/${depId}`}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <span className="font-semibold text-primary-600">{depId}</span>
                        <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <Card className="animate-fade-in delay-400" style={{ opacity: 0 }}>
                <CardHeader>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                    <Tag className="w-5 h-5 text-slate-500" />
                    Etiquetas
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notas para dirección */}
            <Card className="animate-fade-in delay-500 border-l-4 border-l-accent-500" style={{ opacity: 0 }}>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-900">
                  <AlertTriangle className="w-5 h-5 text-accent-500" />
                  Notas para Dirección
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Este problema ha sido identificado como de impacto <strong>{problem.impacto}</strong>.
                  Se recomienda priorizar su abordaje según el roadmap definido.
                  La inversión estimada presenta un retorno atractivo que justifica la implementación
                  de la solución propuesta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

