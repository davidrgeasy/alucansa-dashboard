'use client';

import { useState, useEffect } from 'react';
import { Problem, Impacto, Urgencia, Area } from '@/data/problems';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCanEdit } from '@/store/useAuth';
import { ReadOnlyBadge } from '@/components/auth';
import {
  X,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  Target,
  Clock,
  Euro,
  TrendingUp,
  FileText,
  ListChecks,
  Search,
  Link2,
  Tag,
} from 'lucide-react';

interface ProblemFormProps {
  problem?: Problem;
  areas: Area[];
  onSave: (problem: Omit<Problem, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const IMPACTO_OPTIONS: { value: Impacto; label: string; color: string }[] = [
  { value: 'alto', label: 'Alto', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medio', label: 'Medio', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'bajo', label: 'Bajo', color: 'bg-green-100 text-green-700 border-green-200' },
];

const URGENCIA_OPTIONS: { value: Urgencia; label: string; color: string }[] = [
  { value: 'corto', label: 'Corto plazo', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medio', label: 'Medio plazo', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'largo', label: 'Largo plazo', color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

export function ProblemForm({ problem, areas, onSave, onCancel, isNew = false }: ProblemFormProps) {
  const canEdit = useCanEdit();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    areaId: problem?.areaId || (areas[0]?.id || ''),
    titulo: problem?.titulo || '',
    descripcion: problem?.descripcion || '',
    impacto: problem?.impacto || 'medio' as Impacto,
    urgencia: problem?.urgencia || 'medio' as Urgencia,
    causas: problem?.causas || [''],
    evidencias: problem?.evidencias || [''],
    solucionPropuesta: problem?.solucionPropuesta || '',
    pasosImplementacion: problem?.pasosImplementacion || [''],
    costeMin: problem?.coste.minimo || 0,
    costeMax: problem?.coste.maximo || 0,
    roiMin: problem?.roi.minimo || 0,
    roiMax: problem?.roi.maximo || 0,
    roiJustificacion: problem?.roi.justificacion || '',
    dependencias: problem?.dependencias || [],
    tags: problem?.tags || [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newDependencia, setNewDependencia] = useState('');

  // Validación
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (!formData.areaId) {
      newErrors.areaId = 'Debes seleccionar un área';
    }
    if (formData.costeMin < 0 || formData.costeMax < 0) {
      newErrors.coste = 'El coste no puede ser negativo';
    }
    if (formData.costeMin > formData.costeMax) {
      newErrors.coste = 'El coste mínimo no puede ser mayor que el máximo';
    }
    if (!formData.solucionPropuesta.trim()) {
      newErrors.solucionPropuesta = 'La solución propuesta es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers para arrays dinámicos
  const handleArrayAdd = (field: 'causas' | 'evidencias' | 'pasosImplementacion') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleArrayRemove = (field: 'causas' | 'evidencias' | 'pasosImplementacion', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (field: 'causas' | 'evidencias' | 'pasosImplementacion', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  // Handler para tags
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // Handler para dependencias
  const handleAddDependencia = () => {
    if (newDependencia.trim() && !formData.dependencias.includes(newDependencia.trim())) {
      setFormData(prev => ({
        ...prev,
        dependencias: [...prev.dependencias, newDependencia.trim()],
      }));
      setNewDependencia('');
    }
  };

  const handleRemoveDependencia = (dep: string) => {
    setFormData(prev => ({
      ...prev,
      dependencias: prev.dependencias.filter(d => d !== dep),
    }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const problemData = {
      ...(problem?.id ? { id: problem.id } : {}),
      areaId: formData.areaId,
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      impacto: formData.impacto,
      urgencia: formData.urgencia,
      causas: formData.causas.filter(c => c.trim()),
      evidencias: formData.evidencias.filter(e => e.trim()),
      solucionPropuesta: formData.solucionPropuesta.trim(),
      pasosImplementacion: formData.pasosImplementacion.filter(p => p.trim()),
      coste: {
        minimo: formData.costeMin,
        maximo: formData.costeMax,
        moneda: 'EUR' as const,
      },
      roi: {
        minimo: formData.roiMin,
        maximo: formData.roiMax,
        justificacion: formData.roiJustificacion.trim(),
      },
      dependencias: formData.dependencias,
      tags: formData.tags,
    };
    
    onSave(problemData);
  };

  if (!canEdit) {
    return (
      <div className="p-6 text-center">
        <ReadOnlyBadge />
        <p className="mt-4 text-slate-600">No tienes permisos para editar problemas.</p>
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
          {isNew ? 'Nuevo Problema' : 'Editar Problema'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Área */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Target className="w-4 h-4 inline mr-2" />
          Área
        </label>
        <select
          value={formData.areaId}
          onChange={(e) => setFormData(prev => ({ ...prev, areaId: e.target.value }))}
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            errors.areaId ? 'border-red-300' : 'border-slate-300'
          )}
        >
          {areas.map(area => (
            <option key={area.id} value={area.id}>
              {area.codigo} - {area.nombre}
            </option>
          ))}
        </select>
        {errors.areaId && <p className="text-sm text-red-600 mt-1">{errors.areaId}</p>}
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Título del Problema
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Describe brevemente el problema..."
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            errors.titulo ? 'border-red-300' : 'border-slate-300'
          )}
        />
        {errors.titulo && <p className="text-sm text-red-600 mt-1">{errors.titulo}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descripción Detallada
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          rows={4}
          placeholder="Explica el problema con más detalle..."
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none',
            errors.descripcion ? 'border-red-300' : 'border-slate-300'
          )}
        />
        {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
      </div>

      {/* Impacto y Urgencia */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Impacto
          </label>
          <div className="flex gap-2">
            {IMPACTO_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, impacto: opt.value }))}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                  formData.impacto === opt.value
                    ? opt.color + ' ring-2 ring-offset-1'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Urgencia
          </label>
          <div className="flex gap-2">
            {URGENCIA_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, urgencia: opt.value }))}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                  formData.urgencia === opt.value
                    ? opt.color + ' ring-2 ring-offset-1'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Causas */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Search className="w-4 h-4 inline mr-2" />
          Causas Identificadas
        </label>
        <div className="space-y-2">
          {formData.causas.map((causa, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={causa}
                onChange={(e) => handleArrayChange('causas', index, e.target.value)}
                placeholder={`Causa ${index + 1}...`}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {formData.causas.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleArrayRemove('causas', index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('causas')}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="w-4 h-4" />
            Añadir causa
          </button>
        </div>
      </div>

      {/* Evidencias */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Evidencias
        </label>
        <div className="space-y-2">
          {formData.evidencias.map((evidencia, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={evidencia}
                onChange={(e) => handleArrayChange('evidencias', index, e.target.value)}
                placeholder={`Evidencia ${index + 1}...`}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {formData.evidencias.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleArrayRemove('evidencias', index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('evidencias')}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="w-4 h-4" />
            Añadir evidencia
          </button>
        </div>
      </div>

      {/* Solución Propuesta */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Solución Propuesta
        </label>
        <textarea
          value={formData.solucionPropuesta}
          onChange={(e) => setFormData(prev => ({ ...prev, solucionPropuesta: e.target.value }))}
          rows={3}
          placeholder="Describe la solución propuesta..."
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none',
            errors.solucionPropuesta ? 'border-red-300' : 'border-slate-300'
          )}
        />
        {errors.solucionPropuesta && <p className="text-sm text-red-600 mt-1">{errors.solucionPropuesta}</p>}
      </div>

      {/* Pasos de Implementación */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <ListChecks className="w-4 h-4 inline mr-2" />
          Pasos de Implementación
        </label>
        <div className="space-y-2">
          {formData.pasosImplementacion.map((paso, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-10 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                value={paso}
                onChange={(e) => handleArrayChange('pasosImplementacion', index, e.target.value)}
                placeholder={`Paso ${index + 1}...`}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {formData.pasosImplementacion.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleArrayRemove('pasosImplementacion', index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('pasosImplementacion')}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="w-4 h-4" />
            Añadir paso
          </button>
        </div>
      </div>

      {/* Coste e Inversión */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Euro className="w-4 h-4 inline mr-2" />
          Inversión Estimada (€)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Mínimo</label>
            <input
              type="number"
              value={formData.costeMin}
              onChange={(e) => setFormData(prev => ({ ...prev, costeMin: Number(e.target.value) }))}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Máximo</label>
            <input
              type="number"
              value={formData.costeMax}
              onChange={(e) => setFormData(prev => ({ ...prev, costeMax: Number(e.target.value) }))}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        {errors.coste && <p className="text-sm text-red-600 mt-1">{errors.coste}</p>}
      </div>

      {/* ROI */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <TrendingUp className="w-4 h-4 inline mr-2" />
          ROI Estimado (%)
        </label>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Mínimo</label>
            <input
              type="number"
              value={formData.roiMin}
              onChange={(e) => setFormData(prev => ({ ...prev, roiMin: Number(e.target.value) }))}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Máximo</label>
            <input
              type="number"
              value={formData.roiMax}
              onChange={(e) => setFormData(prev => ({ ...prev, roiMax: Number(e.target.value) }))}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Justificación del ROI</label>
          <textarea
            value={formData.roiJustificacion}
            onChange={(e) => setFormData(prev => ({ ...prev, roiJustificacion: e.target.value }))}
            rows={2}
            placeholder="Explica cómo se calcula el ROI..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      {/* Dependencias */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Link2 className="w-4 h-4 inline mr-2" />
          Dependencias (IDs de otros problemas)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newDependencia}
            onChange={(e) => setNewDependencia(e.target.value)}
            placeholder="Ej: ORG-1"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDependencia())}
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleAddDependencia}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.dependencias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.dependencias.map(dep => (
              <span
                key={dep}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm"
              >
                {dep}
                <button
                  type="button"
                  onClick={() => handleRemoveDependencia(dep)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Tag className="w-4 h-4 inline mr-2" />
          Etiquetas
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Añadir etiqueta..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          <Save className="w-4 h-4" />
          {isNew ? 'Crear Problema' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}



