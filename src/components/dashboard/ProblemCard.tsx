'use client';

import { Problem } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  formatCurrencyRange, 
  formatPercentageRange, 
  getHorizonteShortLabel 
} from '@/lib/utils';
import { areas } from '@/data/problems';
import { ArrowRight, TrendingUp, Clock, Euro } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const area = areas.find((a) => a.id === problem.areaId);

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
    <Card hover className="flex flex-col h-full">
      <CardContent className="flex-1">
        {/* Header con código y badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-900">{problem.id}</span>
            <span className="text-sm text-slate-500">•</span>
            <span className="text-sm text-slate-600">{area?.codigo}</span>
          </div>
          <Badge variant={impactoBadgeVariant[problem.impacto]}>
            {problem.impacto.charAt(0).toUpperCase() + problem.impacto.slice(1)}
          </Badge>
        </div>

        {/* Título */}
        <h3 className="text-base font-semibold text-primary-900 mb-3 line-clamp-2 leading-snug">
          {problem.titulo}
        </h3>

        {/* Métricas */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Horizonte:</span>
            <Badge variant={horizonteBadgeVariant[problem.urgencia]} size="sm">
              {getHorizonteShortLabel(problem.urgencia)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Euro className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Coste:</span>
            <span className="font-medium text-primary-900">
              {formatCurrencyRange(problem.coste.minimo, problem.coste.maximo)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">ROI:</span>
            <span className="font-medium text-emerald-600">
              {formatPercentageRange(problem.roi.minimo, problem.roi.maximo)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {problem.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">
                +{problem.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          href={`/problemas/${problem.id}`}
          variant="secondary"
          size="sm"
          className="w-full gap-2"
        >
          Ver detalle
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

