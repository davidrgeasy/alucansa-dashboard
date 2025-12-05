/**
 * STORE DE PROBLEMAS - ZUSTAND CON BASE DE DATOS
 * ===============================================
 * 
 * Gestiona problemas y áreas usando la API conectada a MySQL.
 * Los datos se cargan desde la base de datos y se mantienen sincronizados.
 */

import { create } from 'zustand';
import { Area, Problem } from '@/data/problems';

// Tipos para problemas/áreas personalizados
export interface CustomProblem extends Problem {
  isCustom: true;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CustomArea extends Omit<Area, 'problemas' | 'resumen'> {
  isCustom: true;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  problemas: (Problem | CustomProblem)[];
  resumen: Area['resumen'];
}

// Tipo para ediciones (mantenido por compatibilidad)
export interface ProblemEdit {
  problemId: string;
  changes: Partial<Problem>;
  editedAt: string;
  editedBy: string;
}

export interface AreaEdit {
  areaId: string;
  changes: Partial<Omit<Area, 'problemas'>>;
  editedAt: string;
  editedBy: string;
}

interface ProblemsState {
  // Estado principal
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  // Para compatibilidad con código existente
  customProblems: CustomProblem[];
  customAreas: CustomArea[];
  problemEdits: Record<string, ProblemEdit>;
  areaEdits: Record<string, AreaEdit>;
  
  // Acciones de carga
  fetchAreas: () => Promise<void>;
  
  // Acciones para problemas
  addProblem: (problem: Omit<CustomProblem, 'isCustom' | 'createdAt'>, createdBy: string) => Promise<void>;
  updateProblem: (problemId: string, changes: Partial<Problem>, editedBy: string) => Promise<void>;
  deleteProblem: (problemId: string) => Promise<void>;
  
  // Acciones para áreas
  addArea: (area: Omit<CustomArea, 'isCustom' | 'createdAt' | 'problemas' | 'resumen'>, createdBy: string) => Promise<void>;
  updateArea: (areaId: string, changes: Partial<Omit<Area, 'problemas'>>, editedBy: string) => Promise<void>;
  deleteArea: (areaId: string) => Promise<void>;
  
  // Getters combinados
  getAllAreas: () => Area[];
  getAreaById: (id: string) => Area | undefined;
  getAllProblems: () => Problem[];
  getProblemById: (id: string) => Problem | undefined;
  
  // Utilidades
  isCustomProblem: (problemId: string) => boolean;
  isCustomArea: (areaId: string) => boolean;
  isProblemEdited: (problemId: string) => boolean;
  isAreaEdited: (areaId: string) => boolean;
  getNextProblemId: (areaId: string) => string;
  getNextAreaId: () => string;
}

export const useProblems = create<ProblemsState>((set, get) => ({
  // Estado inicial
  areas: [],
  isLoading: false,
  error: null,
  lastFetch: null,
  
  // Para compatibilidad (se calcularán desde areas)
  customProblems: [],
  customAreas: [],
  problemEdits: {},
  areaEdits: {},

  // Cargar áreas desde la API
  fetchAreas: async () => {
    const state = get();
    
    // Evitar cargas duplicadas
    if (state.isLoading) return;
    
    // Cache de 5 segundos
    if (state.lastFetch && Date.now() - state.lastFetch < 5000) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/areas');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extraer custom problems y areas para compatibilidad
      const customProblems: CustomProblem[] = [];
      const customAreas: CustomArea[] = [];
      
      for (const area of data) {
        if (area.isCustom) {
          customAreas.push(area);
        }
        for (const problem of area.problemas) {
          if (problem.isCustom) {
            customProblems.push(problem);
          }
        }
      }
      
      set({ 
        areas: data, 
        customProblems,
        customAreas,
        isLoading: false, 
        lastFetch: Date.now(),
        error: null,
      });
    } catch (error) {
      console.error('Error fetching areas:', error);
      set({ 
        error: 'Error al cargar los datos. Verifica la conexión a la base de datos.', 
        isLoading: false 
      });
    }
  },

  // Añadir problema
  addProblem: async (problem, createdBy) => {
    try {
      const state = get();
      const area = state.areas.find(a => a.id === problem.areaId);
      const areaCode = area?.codigo || 'NEW';
      const problemCount = area?.problemas.length || 0;
      const id = `${areaCode}-${problemCount + 1}`;

      const response = await fetch('/api/problemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...problem, 
          id, 
          createdBy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al crear problema');
      }

      // Forzar recarga
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error adding problem:', error);
      set({ error: 'Error al crear el problema' });
      throw error;
    }
  },

  // Actualizar problema
  updateProblem: async (problemId, changes, editedBy) => {
    try {
      // Obtener problema actual para merge
      const currentProblem = get().getProblemById(problemId);
      
      const response = await fetch(`/api/problemas/${problemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...currentProblem,
          ...changes, 
          updatedBy: editedBy,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar problema');
      }

      // Forzar recarga
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error updating problem:', error);
      set({ error: 'Error al actualizar el problema' });
      throw error;
    }
  },

  // Eliminar problema
  deleteProblem: async (problemId) => {
    try {
      const response = await fetch(`/api/problemas/${problemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar problema');
      }

      // Forzar recarga
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error deleting problem:', error);
      set({ error: 'Error al eliminar el problema' });
      throw error;
    }
  },

  // Añadir área
  addArea: async (area, createdBy) => {
    try {
      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...area, createdBy }),
      });

      if (!response.ok) {
        throw new Error('Error al crear área');
      }

      // Forzar recarga
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error adding area:', error);
      set({ error: 'Error al crear el área' });
      throw error;
    }
  },

  // Actualizar área
  updateArea: async (areaId, changes, editedBy) => {
    try {
      const currentArea = get().getAreaById(areaId);
      
      const response = await fetch(`/api/areas/${areaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...currentArea,
          ...changes, 
          updatedBy: editedBy,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar área');
      }

      // Forzar recarga
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error updating area:', error);
      set({ error: 'Error al actualizar el área' });
      throw error;
    }
  },

  // Eliminar área
  deleteArea: async (areaId) => {
    try {
      const response = await fetch(`/api/areas/${areaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar área');
      }

      // Forzar recarga
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error deleting area:', error);
      set({ error: 'Error al eliminar el área' });
      throw error;
    }
  },

  // === GETTERS ===
  
  getAllAreas: () => get().areas,
  
  getAreaById: (id) => get().areas.find(a => a.id === id),
  
  getAllProblems: () => get().areas.flatMap(a => a.problemas),
  
  getProblemById: (id) => {
    for (const area of get().areas) {
      const problem = area.problemas.find(p => p.id === id);
      if (problem) return problem;
    }
    return undefined;
  },

  // === UTILIDADES ===
  
  isCustomProblem: (problemId) => {
    const problem = get().getProblemById(problemId);
    return (problem as any)?.isCustom === true;
  },
  
  isCustomArea: (areaId) => {
    const area = get().getAreaById(areaId);
    return (area as any)?.isCustom === true;
  },

  isProblemEdited: (problemId) => {
    const problem = get().getProblemById(problemId);
    return !!(problem as any)?.updatedAt;
  },

  isAreaEdited: (areaId) => {
    const area = get().getAreaById(areaId);
    return !!(area as any)?.updatedAt;
  },

  getNextProblemId: (areaId) => {
    const area = get().getAreaById(areaId);
    if (!area) return 'NEW-1';
    const code = area.codigo || areaId.toUpperCase();
    return `${code}-${area.problemas.length + 1}`;
  },

  getNextAreaId: () => {
    return `area-custom-${Date.now()}`;
  },
}));

// Hook para cargar datos automáticamente
export function useAllAreas() {
  const store = useProblems();
  
  // Cargar datos si no hay
  if (typeof window !== 'undefined' && store.areas.length === 0 && !store.isLoading && !store.lastFetch) {
    store.fetchAreas();
  }
  
  return store.areas;
}

export function useAllProblems() {
  const store = useProblems();
  
  // Cargar datos si no hay
  if (typeof window !== 'undefined' && store.areas.length === 0 && !store.isLoading && !store.lastFetch) {
    store.fetchAreas();
  }
  
  return store.getAllProblems();
}
