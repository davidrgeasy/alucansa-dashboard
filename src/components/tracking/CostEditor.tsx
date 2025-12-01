'use client';

import { useState, useEffect } from 'react';
import { Euro, Edit3, Check, X, RotateCcw, Info } from 'lucide-react';
import { CustomCost } from '@/types/tracking';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CostEditorProps {
  originalCost: { minimo: number; maximo: number };
  customCost: CustomCost | null;
  onSave: (cost: CustomCost | null) => void;
  disabled?: boolean;
}

export function CostEditor({ 
  originalCost, 
  customCost, 
  onSave,
  disabled = false 
}: CostEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [minimo, setMinimo] = useState(customCost?.minimo ?? originalCost.minimo);
  const [maximo, setMaximo] = useState(customCost?.maximo ?? originalCost.maximo);
  const [notas, setNotas] = useState(customCost?.notas ?? '');

  // Sincronizar cuando cambia customCost externamente
  useEffect(() => {
    if (!isEditing) {
      setMinimo(customCost?.minimo ?? originalCost.minimo);
      setMaximo(customCost?.maximo ?? originalCost.maximo);
      setNotas(customCost?.notas ?? '');
    }
  }, [customCost, originalCost, isEditing]);

  const handleSave = () => {
    // Si los valores son iguales a los originales y no hay notas, guardar null
    if (minimo === originalCost.minimo && maximo === originalCost.maximo && !notas.trim()) {
      onSave(null);
    } else {
      onSave({ minimo, maximo, notas: notas.trim() || undefined });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMinimo(customCost?.minimo ?? originalCost.minimo);
    setMaximo(customCost?.maximo ?? originalCost.maximo);
    setNotas(customCost?.notas ?? '');
    setIsEditing(false);
  };

  const handleReset = () => {
    setMinimo(originalCost.minimo);
    setMaximo(originalCost.maximo);
    setNotas('');
    onSave(null);
    setIsEditing(false);
  };

  const hasCustomValue = customCost !== null;
  const currentMinimo = customCost?.minimo ?? originalCost.minimo;
  const currentMaximo = customCost?.maximo ?? originalCost.maximo;

  // Calcular variación respecto al original
  const variacionMin = ((currentMinimo - originalCost.minimo) / originalCost.minimo) * 100;
  const variacionMax = ((currentMaximo - originalCost.maximo) / originalCost.maximo) * 100;

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Euro className="w-4 h-4 text-primary-600" />
            Ajustar Coste Estimado
          </h4>
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
              title="Guardar"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Mínimo (€)</label>
            <input
              type="number"
              value={minimo}
              onChange={(e) => setMinimo(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              min={0}
              step={100}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Máximo (€)</label>
            <input
              type="number"
              value={maximo}
              onChange={(e) => setMaximo(Math.max(minimo, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              min={minimo}
              step={100}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Notas (opcional)</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: Incluye formación del personal..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
          />
        </div>

        {/* Referencia al valor original */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-xs text-slate-400">
            Original: {formatCurrency(originalCost.minimo)} - {formatCurrency(originalCost.maximo)}
          </span>
          {hasCustomValue && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar original
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Coste Estimado</p>
        {!disabled && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            Ajustar
          </button>
        )}
      </div>
      
      <p className={cn(
        "text-xl font-bold",
        hasCustomValue ? "text-blue-600" : "text-primary-900"
      )}>
        {formatCurrency(currentMinimo)} - {formatCurrency(currentMaximo)}
      </p>

      {/* Indicador de valor personalizado */}
      {hasCustomValue && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
              <Info className="w-3 h-3" />
              Coste ajustado
            </span>
            {variacionMin !== 0 && (
              <span className={cn(
                "text-xs font-medium",
                variacionMin > 0 ? "text-red-600" : "text-emerald-600"
              )}>
                {variacionMin > 0 ? '+' : ''}{variacionMin.toFixed(0)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Original: {formatCurrency(originalCost.minimo)} - {formatCurrency(originalCost.maximo)}
          </p>
          {customCost?.notas && (
            <p className="text-xs text-slate-500 italic mt-1">
              &quot;{customCost.notas}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}

