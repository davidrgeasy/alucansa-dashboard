/**
 * STORE DE PROBLEMAS - CON BASE DE DATOS
 * =======================================
 * 
 * Store que usa la API conectada a MySQL para gestionar
 * problemas y áreas. Los datos persisten en la base de datos.
 */

import { create } from 'zustand';
import { Area, Problem } from '@/data/problems';

interface ProblemsDBState {
  // Estado
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  // Acciones de carga
  fetchAreas: () => Promise<void>;
  
  // Acciones para problemas
  addProblem: (problem: Omit<Problem, 'id'> & { id?: string }, createdBy: string) => Promise<void>;
  updateProblem: (problemId: string, changes: Partial<Problem>, updatedBy: string) => Promise<void>;
  deleteProblem: (problemId: string) => Promise<void>;
  
  // Acciones para áreas
  addArea: (area: Omit<Area, 'id' | 'problemas' | 'resumen'>, createdBy: string) => Promise<void>;
  updateArea: (areaId: string, changes: Partial<Omit<Area, 'problemas'>>, updatedBy: string) => Promise<void>;
  deleteArea: (areaId: string) => Promise<void>;
  
  // Getters
  getAllAreas: () => Area[];
  getAreaById: (id: string) => Area | undefined;
  getAllProblems: () => Problem[];
  getProblemById: (id: string) => Problem | undefined;
  
  // Utilidades
  isCustomProblem: (problemId: string) => boolean;
  isCustomArea: (areaId: string) => boolean;
  getNextProblemId: (areaId: string) => string;
  getNextAreaId: () => string;
}

export const useProblemsDB = create<ProblemsDBState>((set, get) => ({
  areas: [],
  isLoading: false,
  error: null,
  lastFetch: null,

  // Cargar áreas desde la API
  fetchAreas: async () => {
    // Si ya cargamos hace menos de 5 segundos, no volver a cargar
    const lastFetch = get().lastFetch;
    if (lastFetch && Date.now() - lastFetch < 5000) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/areas');
      if (!response.ok) throw new Error('Error al cargar áreas');
      
      const data = await response.json();
      set({ areas: data, isLoading: false, lastFetch: Date.now() });
    } catch (error) {
      console.error('Error fetching areas:', error);
      set({ error: 'Error al cargar los datos', isLoading: false });
    }
  },

  // Añadir problema
  addProblem: async (problem, createdBy) => {
    try {
      const state = get();
      const area = state.areas.find(a => a.id === problem.areaId);
      const areaCode = area?.codigo || 'NEW';
      const problemCount = area?.problemas.length || 0;
      const id = problem.id || `${areaCode}-${problemCount + 1}`;

      const response = await fetch('/api/problemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...problem, id, createdBy }),
      });

      if (!response.ok) throw new Error('Error al crear problema');

      // Recargar datos
      await get().fetchAreas();
    } catch (error) {
      console.error('Error adding problem:', error);
      set({ error: 'Error al crear el problema' });
    }
  },

  // Actualizar problema
  updateProblem: async (problemId, changes, updatedBy) => {
    try {
      const response = await fetch(`/api/problemas/${problemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...changes, updatedBy }),
      });

      if (!response.ok) throw new Error('Error al actualizar problema');

      // Recargar datos
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error updating problem:', error);
      set({ error: 'Error al actualizar el problema' });
    }
  },

  // Eliminar problema
  deleteProblem: async (problemId) => {
    try {
      const response = await fetch(`/api/problemas/${problemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar problema');

      // Recargar datos
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error deleting problem:', error);
      set({ error: 'Error al eliminar el problema' });
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

      if (!response.ok) throw new Error('Error al crear área');

      // Recargar datos
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error adding area:', error);
      set({ error: 'Error al crear el área' });
    }
  },

  // Actualizar área
  updateArea: async (areaId, changes, updatedBy) => {
    try {
      const response = await fetch(`/api/areas/${areaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...changes, updatedBy }),
      });

      if (!response.ok) throw new Error('Error al actualizar área');

      // Recargar datos
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error updating area:', error);
      set({ error: 'Error al actualizar el área' });
    }
  },

  // Eliminar área
  deleteArea: async (areaId) => {
    try {
      const response = await fetch(`/api/areas/${areaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar área');

      // Recargar datos
      set({ lastFetch: null });
      await get().fetchAreas();
    } catch (error) {
      console.error('Error deleting area:', error);
      set({ error: 'Error al eliminar el área' });
    }
  },

  // Getters
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

  // Utilidades
  isCustomProblem: (problemId) => {
    const problem = get().getProblemById(problemId);
    return (problem as any)?.isCustom === true;
  },
  
  isCustomArea: (areaId) => {
    const area = get().getAreaById(areaId);
    return (area as any)?.isCustom === true;
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
export function useProblemsDBWithFetch() {
  const store = useProblemsDB();
  
  // Cargar datos al montar
  if (typeof window !== 'undefined' && !store.lastFetch && !store.isLoading) {
    store.fetchAreas();
  }
  
  return store;
}

