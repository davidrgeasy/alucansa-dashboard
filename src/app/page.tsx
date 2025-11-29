'use client';

import { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICards } from '@/components/dashboard/KPICards';
import { ProblemGrid } from '@/components/dashboard/ProblemGrid';
import { getAllProblems } from '@/data/problems';
import { useFilters } from '@/store/useFilters';
import { calculateKPIs } from '@/lib/utils';

export default function DashboardPage() {
  const { applyFilters } = useFilters();
  const allProblems = getAllProblems();

  // Aplicar filtros a los problemas
  const filteredProblems = useMemo(() => {
    return applyFilters(allProblems);
  }, [applyFilters, allProblems]);

  // Calcular KPIs de los problemas filtrados
  const kpis = useMemo(() => {
    return calculateKPIs(filteredProblems);
  }, [filteredProblems]);

  return (
    <DashboardLayout
      title="Panel de Mejora ALUCANSA"
      subtitle="Informe de consultoría de procesos y tecnología"
    >
      <div className="space-y-6">
        {/* Sección de filtros */}
        <section className="animate-fade-in">
          <FilterBar />
        </section>

        {/* Sección de KPIs */}
        <section className="animate-fade-in delay-100" style={{ opacity: 0 }}>
          <KPICards kpis={kpis} />
        </section>

        {/* Encabezado de problemas */}
        <section className="animate-fade-in delay-200" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-primary-900">
                Problemas Identificados
              </h2>
              <p className="text-sm text-slate-500">
                {filteredProblems.length} {filteredProblems.length === 1 ? 'problema' : 'problemas'} encontrados
              </p>
            </div>
          </div>

          {/* Grid de problemas */}
          <ProblemGrid problems={filteredProblems} />
        </section>
      </div>
    </DashboardLayout>
  );
}

