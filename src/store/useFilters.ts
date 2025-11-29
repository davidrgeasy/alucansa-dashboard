/**
 * STORE DE FILTROS - ZUSTAND
 * ==========================
 * 
 * Gestiona el estado global de filtros del dashboard.
 * 
 * Para extender los filtros:
 * 1. Añadir el nuevo filtro al interface FiltrosState en /types
 * 2. Añadir el estado inicial aquí
 * 3. Añadir el setter correspondiente
 * 4. Actualizar la función applyFilters para incluir el nuevo filtro
 */

import { create } from 'zustand';
import { FiltrosState, Prioridad, HorizonteTemporal, Problem } from '@/types';

interface FiltersStore extends FiltrosState {
  // Setters individuales
  setAreaId: (areaId: string | null) => void;
  setImpacto: (impacto: Prioridad | null) => void;
  setHorizonte: (horizonte: HorizonteTemporal | null) => void;
  setCosteMin: (coste: number | null) => void;
  setCosteMax: (coste: number | null) => void;
  setRoiMin: (roi: number | null) => void;
  setRoiMax: (roi: number | null) => void;
  
  // Reset de filtros
  resetFilters: () => void;
  
  // Aplicar filtros a una lista de problemas
  applyFilters: (problems: Problem[]) => Problem[];
}

const initialState: FiltrosState = {
  areaId: null,
  impacto: null,
  horizonte: null,
  costeMin: null,
  costeMax: null,
  roiMin: null,
  roiMax: null,
};

export const useFilters = create<FiltersStore>((set, get) => ({
  ...initialState,
  
  setAreaId: (areaId) => set({ areaId }),
  setImpacto: (impacto) => set({ impacto }),
  setHorizonte: (horizonte) => set({ horizonte }),
  setCosteMin: (costeMin) => set({ costeMin }),
  setCosteMax: (costeMax) => set({ costeMax }),
  setRoiMin: (roiMin) => set({ roiMin }),
  setRoiMax: (roiMax) => set({ roiMax }),
  
  resetFilters: () => set(initialState),
  
  applyFilters: (problems: Problem[]) => {
    const state = get();
    
    return problems.filter(problem => {
      // Filtro por área
      if (state.areaId && problem.areaId !== state.areaId) {
        return false;
      }
      
      // Filtro por impacto
      if (state.impacto && problem.impacto !== state.impacto) {
        return false;
      }
      
      // Filtro por horizonte temporal
      if (state.horizonte && problem.urgencia !== state.horizonte) {
        return false;
      }
      
      // Filtro por coste mínimo
      if (state.costeMin !== null && problem.coste.maximo < state.costeMin) {
        return false;
      }
      
      // Filtro por coste máximo
      if (state.costeMax !== null && problem.coste.minimo > state.costeMax) {
        return false;
      }
      
      // Filtro por ROI mínimo
      if (state.roiMin !== null && problem.roi.maximo < state.roiMin) {
        return false;
      }
      
      // Filtro por ROI máximo
      if (state.roiMax !== null && problem.roi.minimo > state.roiMax) {
        return false;
      }
      
      return true;
    });
  },
}));

