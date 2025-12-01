'use client';

import { Problem, Area } from '@/data/problems';
import { ProblemTracking, STATUS_CONFIG, PRIORITY_CONFIG } from '@/types/tracking';
import { 
  formatCurrencyRange, 
  formatPercentageRange, 
  getHorizonteLabel,
  getImpactoLabel 
} from '@/lib/utils';

interface ProblemReportProps {
  problem: Problem;
  area: Area;
  tracking?: ProblemTracking | null;
}

function formatDate(isoString: string | null): string {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ProblemReport({ problem, area, tracking }: ProblemReportProps) {
  const statusConfig = tracking ? STATUS_CONFIG[tracking.status] : null;
  const priorityConfig = tracking ? PRIORITY_CONFIG[tracking.internalPriority] : null;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans text-slate-800">
      {/* Encabezado del informe */}
      <header className="border-b-2 border-primary-900 pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
              Informe de Problema
            </p>
            <h1 className="text-2xl font-bold text-primary-900">
              {problem.id}: {problem.titulo}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {area.codigo} — {area.nombre}
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>ALUCANSA</p>
            <p>Consultoría de Procesos</p>
          </div>
        </div>
      </header>

      {/* Resumen ejecutivo */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Resumen Ejecutivo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Impacto</p>
            <p className="font-semibold text-primary-900">{getImpactoLabel(problem.impacto)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Horizonte</p>
            <p className="font-semibold text-primary-900">
              {problem.urgencia === 'corto' ? 'Corto plazo' : problem.urgencia === 'medio' ? 'Medio plazo' : 'Largo plazo'}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Inversión</p>
            <p className="font-semibold text-primary-900">
              {formatCurrencyRange(problem.coste.minimo, problem.coste.maximo)}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">ROI Estimado</p>
            <p className="font-semibold text-emerald-600">
              {formatPercentageRange(problem.roi.minimo, problem.roi.maximo)}
            </p>
          </div>
        </div>
      </section>

      {/* Estado de seguimiento (si existe) */}
      {tracking && (
        <section className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-base font-semibold text-blue-900 mb-3">
            Estado de Seguimiento Interno
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-700 text-xs uppercase">Estado</p>
              <p className="font-semibold text-blue-900">{statusConfig?.label || '—'}</p>
            </div>
            <div>
              <p className="text-blue-700 text-xs uppercase">Prioridad Interna</p>
              <p className="font-semibold text-blue-900">{priorityConfig?.label || '—'}</p>
            </div>
            <div>
              <p className="text-blue-700 text-xs uppercase">Responsable</p>
              <p className="font-semibold text-blue-900">{tracking.assignee || 'Sin asignar'}</p>
            </div>
            <div>
              <p className="text-blue-700 text-xs uppercase">Progreso</p>
              <p className="font-semibold text-blue-900">{tracking.progress}%</p>
            </div>
          </div>
          {(tracking.startDate || tracking.targetDate) && (
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-blue-200 text-sm">
              <div>
                <p className="text-blue-700 text-xs uppercase">Fecha Inicio</p>
                <p className="font-semibold text-blue-900">{formatDate(tracking.startDate)}</p>
              </div>
              <div>
                <p className="text-blue-700 text-xs uppercase">Fecha Objetivo</p>
                <p className="font-semibold text-blue-900">{formatDate(tracking.targetDate)}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Descripción */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Descripción del Problema
        </h2>
        <p className="text-slate-700 leading-relaxed">
          {problem.descripcion}
        </p>
      </section>

      {/* Causas */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Causas Identificadas
        </h2>
        <ol className="list-decimal list-inside space-y-2">
          {problem.causas.map((causa, index) => (
            <li key={index} className="text-slate-700 leading-relaxed">
              {causa}
            </li>
          ))}
        </ol>
      </section>

      {/* Evidencias */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Evidencias Observadas
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {problem.evidencias.map((evidencia, index) => (
            <li key={index} className="text-slate-700 leading-relaxed">
              {evidencia}
            </li>
          ))}
        </ul>
      </section>

      {/* Solución propuesta */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Solución Propuesta
        </h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          {problem.solucionPropuesta}
        </p>
        
        <h3 className="text-base font-semibold text-primary-800 mb-2">
          Pasos de Implementación
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          {problem.pasosImplementacion.map((paso, index) => (
            <li key={index} className="text-slate-700 leading-relaxed">
              {paso}
            </li>
          ))}
        </ol>
      </section>

      {/* Análisis económico */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Análisis Económico
        </h2>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-600">Inversión Mínima</td>
              <td className="py-2 font-semibold text-right">{formatCurrencyRange(problem.coste.minimo, problem.coste.minimo).replace(' - ', '')}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-600">Inversión Máxima</td>
              <td className="py-2 font-semibold text-right">{formatCurrencyRange(problem.coste.maximo, problem.coste.maximo).replace(' - ', '')}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-600">ROI Esperado</td>
              <td className="py-2 font-semibold text-emerald-600 text-right">
                {formatPercentageRange(problem.roi.minimo, problem.roi.maximo)}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-600">Retorno Estimado (mín)</td>
              <td className="py-2 font-semibold text-emerald-600 text-right">
                {formatCurrencyRange(
                  Math.round(problem.coste.minimo * problem.roi.minimo / 100),
                  Math.round(problem.coste.minimo * problem.roi.minimo / 100)
                ).replace(' - ', '')}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Retorno Estimado (máx)</td>
              <td className="py-2 font-semibold text-emerald-600 text-right">
                {formatCurrencyRange(
                  Math.round(problem.coste.maximo * problem.roi.maximo / 100),
                  Math.round(problem.coste.maximo * problem.roi.maximo / 100)
                ).replace(' - ', '')}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Dependencias */}
      {problem.dependencias && problem.dependencias.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
            Dependencias
          </h2>
          <p className="text-slate-700 mb-2">
            Este problema depende de la resolución previa de:
          </p>
          <ul className="list-disc list-inside">
            {problem.dependencias.map((dep) => (
              <li key={dep} className="text-slate-700 font-semibold">{dep}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Etiquetas */}
      {problem.tags && problem.tags.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
            Etiquetas
          </h2>
          <p className="text-slate-600">
            {problem.tags.join(' • ')}
          </p>
        </section>
      )}

      {/* Historial de seguimientos */}
      {tracking && tracking.followUps.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
            Historial de Seguimientos ({tracking.followUps.length})
          </h2>
          <div className="space-y-3">
            {tracking.followUps.map((followUp) => (
              <div key={followUp.id} className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold">{followUp.author}</span>
                  <span>•</span>
                  <span>{formatDate(followUp.createdAt)}</span>
                  <span>•</span>
                  <span className="capitalize">{followUp.type}</span>
                </div>
                <p className="text-sm text-slate-700">{followUp.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pie del informe */}
      <footer className="border-t border-slate-200 pt-4 mt-8 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Panel de Mejora ALUCANSA — Consultoría de Procesos y Tecnología</span>
          <span>Generado: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </footer>
    </div>
  );
}

