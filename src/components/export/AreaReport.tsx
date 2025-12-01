'use client';

import { Area } from '@/data/problems';
import { 
  formatCurrency,
  formatCurrencyRange, 
  getImpactoLabel 
} from '@/lib/utils';

interface AreaReportProps {
  area: Area;
}

export function AreaReport({ area }: AreaReportProps) {
  // Calcular métricas
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

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans text-slate-800">
      {/* Encabezado del informe */}
      <header className="border-b-2 border-primary-900 pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
              Informe de Área
            </p>
            <h1 className="text-2xl font-bold text-primary-900">
              {area.codigo}: {area.nombre}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Prioridad: {area.prioridad.charAt(0).toUpperCase() + area.prioridad.slice(1)}
            </p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>ALUCANSA</p>
            <p>Consultoría de Procesos</p>
          </div>
        </div>
      </header>

      {/* Descripción */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Descripción del Área
        </h2>
        <p className="text-slate-700 leading-relaxed">
          {area.descripcion}
        </p>
      </section>

      {/* Resumen ejecutivo */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Resumen Ejecutivo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Total Problemas</p>
            <p className="text-2xl font-bold text-primary-900">{area.problemas.length}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Inversión (mín)</p>
            <p className="text-lg font-bold text-primary-900">{formatCurrency(totalCosteMin)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">Inversión (máx)</p>
            <p className="text-lg font-bold text-primary-900">{formatCurrency(totalCosteMax)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-slate-500 text-xs uppercase">ROI Medio</p>
            <p className="text-2xl font-bold text-emerald-600">{avgRoi}%</p>
          </div>
        </div>
      </section>

      {/* Distribución por impacto */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Distribución por Impacto
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 text-slate-600">Nivel de Impacto</th>
              <th className="text-center py-2 text-slate-600">Cantidad</th>
              <th className="text-right py-2 text-slate-600">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2">Alto</td>
              <td className="py-2 text-center font-semibold">{problemasAlto}</td>
              <td className="py-2 text-right">{Math.round((problemasAlto / area.problemas.length) * 100)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2">Medio</td>
              <td className="py-2 text-center font-semibold">{problemasMedio}</td>
              <td className="py-2 text-right">{Math.round((problemasMedio / area.problemas.length) * 100)}%</td>
            </tr>
            <tr>
              <td className="py-2">Bajo</td>
              <td className="py-2 text-center font-semibold">{problemasBajo}</td>
              <td className="py-2 text-right">{Math.round((problemasBajo / area.problemas.length) * 100)}%</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Distribución por horizonte */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Distribución por Horizonte Temporal
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 text-slate-600">Horizonte</th>
              <th className="text-center py-2 text-slate-600">Cantidad</th>
              <th className="text-right py-2 text-slate-600">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2">Corto plazo (0-6 meses)</td>
              <td className="py-2 text-center font-semibold">{problemasCorto}</td>
              <td className="py-2 text-right">{Math.round((problemasCorto / area.problemas.length) * 100)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2">Medio plazo (6-18 meses)</td>
              <td className="py-2 text-center font-semibold">{problemasMedioP}</td>
              <td className="py-2 text-right">{Math.round((problemasMedioP / area.problemas.length) * 100)}%</td>
            </tr>
            <tr>
              <td className="py-2">Largo plazo (+18 meses)</td>
              <td className="py-2 text-center font-semibold">{problemasLargo}</td>
              <td className="py-2 text-right">{Math.round((problemasLargo / area.problemas.length) * 100)}%</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Lista de problemas */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-primary-900 border-b border-slate-200 pb-2 mb-3">
          Listado de Problemas
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2 px-2 text-slate-600">ID</th>
              <th className="text-left py-2 px-2 text-slate-600">Problema</th>
              <th className="text-center py-2 px-2 text-slate-600">Impacto</th>
              <th className="text-center py-2 px-2 text-slate-600">Horizonte</th>
              <th className="text-right py-2 px-2 text-slate-600">Inversión</th>
              <th className="text-right py-2 px-2 text-slate-600">ROI</th>
            </tr>
          </thead>
          <tbody>
            {area.problemas.map((problem) => (
              <tr key={problem.id} className="border-b border-slate-100">
                <td className="py-2 px-2 font-semibold text-primary-900">{problem.id}</td>
                <td className="py-2 px-2">{problem.titulo}</td>
                <td className="py-2 px-2 text-center">{getImpactoLabel(problem.impacto)}</td>
                <td className="py-2 px-2 text-center">
                  {problem.urgencia === 'corto' ? 'Corto' : problem.urgencia === 'medio' ? 'Medio' : 'Largo'}
                </td>
                <td className="py-2 px-2 text-right">{formatCurrency(problem.coste.minimo)}</td>
                <td className="py-2 px-2 text-right text-emerald-600">{problem.roi.minimo}-{problem.roi.maximo}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
              <td className="py-2 px-2" colSpan={4}>TOTAL</td>
              <td className="py-2 px-2 text-right">{formatCurrency(totalCosteMin)}</td>
              <td className="py-2 px-2 text-right text-emerald-600">{avgRoi}% (media)</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Resumen de inversión */}
      <section className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h2 className="text-base font-semibold text-primary-900 mb-3">
          Resumen de Inversión del Área
        </h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-primary-700 text-xs uppercase">Inversión Mínima</p>
            <p className="text-lg font-bold text-primary-900">{formatCurrency(totalCosteMin)}</p>
          </div>
          <div>
            <p className="text-primary-700 text-xs uppercase">Inversión Máxima</p>
            <p className="text-lg font-bold text-primary-900">{formatCurrency(totalCosteMax)}</p>
          </div>
          <div>
            <p className="text-primary-700 text-xs uppercase">Retorno Esperado (media)</p>
            <p className="text-lg font-bold text-emerald-600">{avgRoi}%</p>
          </div>
        </div>
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

