'use client';

import { Problem, getAllProblems, getAreaById } from '@/data/problems';
import { HorizonteTemporal } from '@/types';
import { formatCurrency, getImpactoLabel } from '@/lib/utils';

interface RoadmapReportProps {
  problems?: Problem[];
}

export function RoadmapReport({ problems }: RoadmapReportProps) {
  const allProblems = problems || getAllProblems();

  // Agrupar por horizonte
  const groups: Record<HorizonteTemporal, Problem[]> = {
    corto: [],
    medio: [],
    largo: [],
  };

  allProblems.forEach((problem) => {
    groups[problem.urgencia].push(problem);
  });

  // Ordenar por impacto
  const impactoOrder: Record<string, number> = { alto: 0, medio: 1, bajo: 2 };
  Object.keys(groups).forEach((key) => {
    groups[key as HorizonteTemporal].sort(
      (a, b) => impactoOrder[a.impacto] - impactoOrder[b.impacto]
    );
  });

  // Calcular totales
  const calcularTotales = (probs: Problem[]) => ({
    count: probs.length,
    costeMin: probs.reduce((sum, p) => sum + p.coste.minimo, 0),
    costeMax: probs.reduce((sum, p) => sum + p.coste.maximo, 0),
    avgRoi: probs.length > 0
      ? Math.round(probs.reduce((sum, p) => sum + (p.roi.minimo + p.roi.maximo) / 2, 0) / probs.length)
      : 0,
    altoImpacto: probs.filter(p => p.impacto === 'alto').length,
  });

  const cortoStats = calcularTotales(groups.corto);
  const medioStats = calcularTotales(groups.medio);
  const largoStats = calcularTotales(groups.largo);
  const totalStats = calcularTotales(allProblems);

  const horizonteConfig = {
    corto: { label: 'Corto Plazo', description: '0-6 meses' },
    medio: { label: 'Medio Plazo', description: '6-18 meses' },
    largo: { label: 'Largo Plazo', description: '+18 meses' },
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans text-slate-800">
      {/* Encabezado del informe */}
      <header className="border-b-2 border-primary-900 pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
              Roadmap de Implementación
            </p>
            <h1 className="text-2xl font-bold text-primary-900">
              Cronograma de Mejoras
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Plan de acción por horizonte temporal
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
            <p className="text-slate-500 text-xs uppercase">Total Problemas</p>
            <p className="text-2xl font-bold text-primary-900">{totalStats.count}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Inversión Total (mín)</p>
            <p className="text-lg font-bold text-primary-900">{formatCurrency(totalStats.costeMin)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Inversión Total (máx)</p>
            <p className="text-lg font-bold text-primary-900">{formatCurrency(totalStats.costeMax)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Alto Impacto</p>
            <p className="text-2xl font-bold text-red-600">{totalStats.altoImpacto}</p>
          </div>
        </div>
      </section>

      {/* Resumen por horizonte */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Distribución por Horizonte Temporal
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2 px-2 text-slate-600">Horizonte</th>
              <th className="text-center py-2 px-2 text-slate-600">Problemas</th>
              <th className="text-center py-2 px-2 text-slate-600">Alto Impacto</th>
              <th className="text-right py-2 px-2 text-slate-600">Inversión (mín)</th>
              <th className="text-right py-2 px-2 text-slate-600">Inversión (máx)</th>
              <th className="text-right py-2 px-2 text-slate-600">ROI Medio</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2 px-2 font-semibold">Corto Plazo (0-6 meses)</td>
              <td className="py-2 px-2 text-center">{cortoStats.count}</td>
              <td className="py-2 px-2 text-center">{cortoStats.altoImpacto}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(cortoStats.costeMin)}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(cortoStats.costeMax)}</td>
              <td className="py-2 px-2 text-right text-emerald-600">{cortoStats.avgRoi}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 px-2 font-semibold">Medio Plazo (6-18 meses)</td>
              <td className="py-2 px-2 text-center">{medioStats.count}</td>
              <td className="py-2 px-2 text-center">{medioStats.altoImpacto}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(medioStats.costeMin)}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(medioStats.costeMax)}</td>
              <td className="py-2 px-2 text-right text-emerald-600">{medioStats.avgRoi}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 px-2 font-semibold">Largo Plazo (+18 meses)</td>
              <td className="py-2 px-2 text-center">{largoStats.count}</td>
              <td className="py-2 px-2 text-center">{largoStats.altoImpacto}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(largoStats.costeMin)}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(largoStats.costeMax)}</td>
              <td className="py-2 px-2 text-right text-emerald-600">{largoStats.avgRoi}%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
              <td className="py-2 px-2">TOTAL</td>
              <td className="py-2 px-2 text-center">{totalStats.count}</td>
              <td className="py-2 px-2 text-center">{totalStats.altoImpacto}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(totalStats.costeMin)}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(totalStats.costeMax)}</td>
              <td className="py-2 px-2 text-right text-emerald-600">{totalStats.avgRoi}%</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Detalle por horizonte */}
      {(['corto', 'medio', 'largo'] as HorizonteTemporal[]).map((horizonte) => (
        <section key={horizonte} className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
            {horizonteConfig[horizonte].label} ({horizonteConfig[horizonte].description})
          </h2>
          
          {groups[horizonte].length === 0 ? (
            <p className="text-slate-500 text-sm italic">
              No hay problemas programados para este horizonte temporal.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-2 px-2 text-slate-600">ID</th>
                  <th className="text-left py-2 px-2 text-slate-600">Problema</th>
                  <th className="text-left py-2 px-2 text-slate-600">Área</th>
                  <th className="text-center py-2 px-2 text-slate-600">Impacto</th>
                  <th className="text-right py-2 px-2 text-slate-600">Inversión</th>
                  <th className="text-right py-2 px-2 text-slate-600">ROI</th>
                </tr>
              </thead>
              <tbody>
                {groups[horizonte].map((problem) => {
                  const area = getAreaById(problem.areaId);
                  return (
                    <tr key={problem.id} className="border-b border-slate-100">
                      <td className="py-2 px-2 font-semibold text-primary-900">{problem.id}</td>
                      <td className="py-2 px-2">{problem.titulo}</td>
                      <td className="py-2 px-2 text-slate-600">{area?.codigo || '—'}</td>
                      <td className="py-2 px-2 text-center">{getImpactoLabel(problem.impacto)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(problem.coste.minimo)}</td>
                      <td className="py-2 px-2 text-right text-emerald-600">{problem.roi.minimo}-{problem.roi.maximo}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      ))}

      {/* Recomendaciones */}
      <section className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h2 className="text-base font-semibold text-primary-900 mb-3">
          Recomendaciones de Implementación
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-primary-800">
          <li>
            <strong>Priorizar problemas de corto plazo con alto impacto</strong> para obtener 
            quick wins y demostrar resultados tangibles rápidamente.
          </li>
          <li>
            <strong>Planificar las mejoras de medio plazo en paralelo</strong> para garantizar 
            una transformación sostenible y preparar los recursos necesarios.
          </li>
          <li>
            <strong>Revisar dependencias entre problemas</strong> para establecer la secuencia 
            óptima de implementación.
          </li>
          <li>
            <strong>Asignar responsables claros</strong> a cada problema y establecer 
            indicadores de seguimiento.
          </li>
        </ol>
      </section>

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

