'use client';

import { useFilters } from '@/store/useFilters';
import { areas } from '@/data/problems';
import { Select } from '@/components/ui/Select';
import { RangeInput } from '@/components/ui/RangeInput';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Filter } from 'lucide-react';
import { Prioridad, HorizonteTemporal } from '@/types';

export function FilterBar() {
  const {
    areaId,
    impacto,
    horizonte,
    costeMin,
    costeMax,
    roiMin,
    roiMax,
    setAreaId,
    setImpacto,
    setHorizonte,
    setCosteMin,
    setCosteMax,
    setRoiMin,
    setRoiMax,
    resetFilters,
  } = useFilters();

  const areaOptions = areas.map((area) => ({
    value: area.id,
    label: `${area.codigo}: ${area.nombre}`,
  }));

  const impactoOptions: { value: Prioridad; label: string }[] = [
    { value: 'alto', label: 'Alto' },
    { value: 'medio', label: 'Medio' },
    { value: 'bajo', label: 'Bajo' },
  ];

  const horizonteOptions: { value: HorizonteTemporal; label: string }[] = [
    { value: 'corto', label: 'Corto plazo (0-6 meses)' },
    { value: 'medio', label: 'Medio plazo (6-18 meses)' },
    { value: 'largo', label: 'Largo plazo (+18 meses)' },
  ];

  const hasActiveFilters = areaId || impacto || horizonte || 
    costeMin !== null || costeMax !== null || 
    roiMin !== null || roiMax !== null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
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
          label="Área"
          value={areaId}
          onChange={setAreaId}
          options={areaOptions}
          placeholder="Todas las áreas"
        />

        <Select
          label="Impacto"
          value={impacto}
          onChange={(v) => setImpacto(v as Prioridad | null)}
          options={impactoOptions}
          placeholder="Todos"
        />

        <Select
          label="Horizonte"
          value={horizonte}
          onChange={(v) => setHorizonte(v as HorizonteTemporal | null)}
          options={horizonteOptions}
          placeholder="Todos"
        />

        <RangeInput
          label="Coste (€)"
          minValue={costeMin}
          maxValue={costeMax}
          onMinChange={setCosteMin}
          onMaxChange={setCosteMax}
          minPlaceholder="Mín"
          maxPlaceholder="Máx"
        />

        <RangeInput
          label="ROI (%)"
          minValue={roiMin}
          maxValue={roiMax}
          onMinChange={setRoiMin}
          onMaxChange={setRoiMax}
          minPlaceholder="Mín"
          maxPlaceholder="Máx"
          suffix="%"
        />

        <div className="flex items-end">
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="w-full justify-center gap-2"
            disabled={!hasActiveFilters}
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}

