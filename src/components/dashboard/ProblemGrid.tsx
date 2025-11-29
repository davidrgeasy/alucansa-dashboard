'use client';

import { Problem } from '@/types';
import { ProblemCard } from './ProblemCard';
import { FileQuestion } from 'lucide-react';

interface ProblemGridProps {
  problems: Problem[];
}

export function ProblemGrid({ problems }: ProblemGridProps) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-slate-200">
        <FileQuestion className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          No se encontraron problemas
        </h3>
        <p className="text-sm text-slate-500 text-center max-w-md">
          No hay problemas que coincidan con los filtros seleccionados. 
          Prueba a ajustar los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}

