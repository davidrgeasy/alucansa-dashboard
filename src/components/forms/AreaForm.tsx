'use client';

import { useState } from 'react';
import { Area, Impacto } from '@/data/problems';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCanEdit } from '@/store/useAuth';
import { ReadOnlyBadge } from '@/components/auth';
import {
  X,
  Save,
  Folder,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface AreaFormProps {
  area?: Omit<Area, 'problemas' | 'resumen'>;
  onSave: (area: Omit<Area, 'id' | 'problemas' | 'resumen'> & { id?: string }) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const PRIORIDAD_OPTIONS: { value: Impacto; label: string; color: string }[] = [
  { value: 'alto', label: 'Alta', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medio', label: 'Media', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'bajo', label: 'Baja', color: 'bg-green-100 text-green-700 border-green-200' },
];

export function AreaForm({ area, onSave, onCancel, isNew = false }: AreaFormProps) {
  const canEdit = useCanEdit();
  
  const [formData, setFormData] = useState({
    codigo: area?.codigo || '',
    nombre: area?.nombre || '',
    descripcion: area?.descripcion || '',
    prioridad: area?.prioridad || 'medio' as Impacto,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const areaData = {
      ...(area?.id ? { id: area.id } : {}),
      codigo: formData.codigo.trim().toUpperCase(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      prioridad: formData.prioridad,
    };
    
    onSave(areaData);
  };

  if (!canEdit) {
    return (
      <div className="p-6 text-center">
        <ReadOnlyBadge />
        <p className="mt-4 text-slate-600">No tienes permisos para editar áreas.</p>
        <Button variant="ghost" onClick={onCancel} className="mt-4">
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-primary-900">
          {isNew ? 'Nueva Área' : 'Editar Área'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Código */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Folder className="w-4 h-4 inline mr-2" />
          Código del Área
        </label>
        <input
          type="text"
          value={formData.codigo}
          onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
          placeholder="Ej: PROD, IT, RRHH..."
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase',
            errors.codigo ? 'border-red-300' : 'border-slate-300'
          )}
        />
        {errors.codigo && <p className="text-sm text-red-600 mt-1">{errors.codigo}</p>}
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Nombre del Área
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          placeholder="Nombre descriptivo del área..."
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            errors.nombre ? 'border-red-300' : 'border-slate-300'
          )}
        />
        {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descripción
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          rows={4}
          placeholder="Describe el alcance y responsabilidades del área..."
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none',
            errors.descripcion ? 'border-red-300' : 'border-slate-300'
          )}
        />
        {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
      </div>

      {/* Prioridad */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Prioridad
        </label>
        <div className="flex gap-2">
          {PRIORIDAD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, prioridad: opt.value }))}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                formData.prioridad === opt.value
                  ? opt.color + ' ring-2 ring-offset-1'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          <Save className="w-4 h-4" />
          {isNew ? 'Crear Área' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}





