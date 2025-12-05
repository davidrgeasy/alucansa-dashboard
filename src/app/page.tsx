'use client';

import { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { KPICards } from '@/components/dashboard/KPICards';
import { ProblemGrid } from '@/components/dashboard/ProblemGrid';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProblemForm, AreaForm } from '@/components/forms';
import { useProblems } from '@/store/useProblems';
import { useFilters } from '@/store/useFilters';
import { useCanEdit, useAuth } from '@/store/useAuth';
import { calculateKPIs } from '@/lib/utils';
import { Plus, FolderPlus } from 'lucide-react';

export default function DashboardPage() {
  const { applyFilters } = useFilters();
  
  // Suscribirse a los datos del store (ahora vienen de la API)
  const areas = useProblems((state) => state.areas);
  const isLoading = useProblems((state) => state.isLoading);
  
  // Obtener las funciones del store
  const { getAllProblems, getAllAreas, addProblem, addArea, getNextProblemId, getNextAreaId } = useProblems();
  const canEdit = useCanEdit();
  const { user } = useAuth();
  
  // Modales
  const [showNewProblemModal, setShowNewProblemModal] = useState(false);
  const [showNewAreaModal, setShowNewAreaModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Recalcular cuando cambien los datos del store
  const allProblems = useMemo(() => getAllProblems(), [areas, getAllProblems]);
  const allAreas = useMemo(() => getAllAreas(), [areas, getAllAreas]);

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
            
            {/* Botones de crear */}
            {canEdit && isHydrated && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowNewAreaModal(true)}
                  className="gap-2"
                >
                  <FolderPlus className="w-4 h-4" />
                  Nueva Área
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowNewProblemModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Problema
                </Button>
              </div>
            )}
          </div>

          {/* Grid de problemas */}
          <ProblemGrid problems={filteredProblems} />
        </section>
      </div>

      {/* Modal de nuevo problema */}
      <Modal
        isOpen={showNewProblemModal}
        onClose={() => setShowNewProblemModal(false)}
        size="xl"
      >
        <ProblemForm
          areas={allAreas}
          isNew={true}
          onSave={(newProblem) => {
            const problemId = getNextProblemId(newProblem.areaId);
            addProblem(
              {
                ...newProblem,
                id: problemId,
                createdBy: user?.name || 'Usuario',
              },
              user?.name || 'Usuario'
            );
            setShowNewProblemModal(false);
          }}
          onCancel={() => setShowNewProblemModal(false)}
        />
      </Modal>

      {/* Modal de nueva área */}
      <Modal
        isOpen={showNewAreaModal}
        onClose={() => setShowNewAreaModal(false)}
        size="lg"
      >
        <AreaForm
          isNew={true}
          onSave={(newArea) => {
            const areaId = getNextAreaId();
            addArea(
              {
                ...newArea,
                id: areaId,
                createdBy: user?.name || 'Usuario',
              },
              user?.name || 'Usuario'
            );
            setShowNewAreaModal(false);
          }}
          onCancel={() => setShowNewAreaModal(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}

