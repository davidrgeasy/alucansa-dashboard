/**
 * STORE DE PROBLEMAS - ZUSTAND CON PERSISTENCIA
 * ==============================================
 * 
 * Gestiona problemas y áreas creados/editados por usuarios.
 * Los datos estáticos de problems.ts se combinan con los datos dinámicos.
 * Persiste en localStorage para mantener los cambios.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Area, 
  Problem, 
  AREAS as STATIC_AREAS,
  getAllProblems as getStaticProblems 
} from '@/data/problems';

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

// Tipo para ediciones de problemas existentes
export interface ProblemEdit {
  problemId: string;
  changes: Partial<Problem>;
  editedAt: string;
  editedBy: string;
}

// Tipo para ediciones de áreas existentes
export interface AreaEdit {
  areaId: string;
  changes: Partial<Omit<Area, 'problemas'>>;
  editedAt: string;
  editedBy: string;
}

interface ProblemsState {
  // Datos personalizados
  customProblems: CustomProblem[];
  customAreas: CustomArea[];
  problemEdits: Record<string, ProblemEdit>;
  areaEdits: Record<string, AreaEdit>;
  
  // Acciones para problemas
  addProblem: (problem: Omit<CustomProblem, 'isCustom' | 'createdAt'>, createdBy: string) => void;
  updateProblem: (problemId: string, changes: Partial<Problem>, editedBy: string) => void;
  deleteProblem: (problemId: string) => void;
  
  // Acciones para áreas
  addArea: (area: Omit<CustomArea, 'isCustom' | 'createdAt' | 'problemas' | 'resumen'>, createdBy: string) => void;
  updateArea: (areaId: string, changes: Partial<Omit<Area, 'problemas'>>, editedBy: string) => void;
  deleteArea: (areaId: string) => void;
  
  // Getters combinados (estáticos + dinámicos)
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

// Función para aplicar ediciones a un problema
function applyProblemEdits(problem: Problem, edit?: ProblemEdit): Problem {
  if (!edit) return problem;
  return { ...problem, ...edit.changes };
}

// Función para aplicar ediciones a un área
function applyAreaEdits(area: Area, edit?: AreaEdit): Area {
  if (!edit) return area;
  return { ...area, ...edit.changes };
}

// Función para recalcular resumen del área
function recalculateAreaResumen(problemas: Problem[]): Area['resumen'] {
  return {
    numProblemas: problemas.length,
    inversionMin: problemas.reduce((sum, p) => sum + p.coste.minimo, 0),
    inversionMax: problemas.reduce((sum, p) => sum + p.coste.maximo, 0),
    ahorroMin: problemas.reduce((sum, p) => sum + Math.round(p.coste.minimo * p.roi.minimo / 100), 0),
    ahorroMax: problemas.reduce((sum, p) => sum + Math.round(p.coste.maximo * p.roi.maximo / 100), 0),
  };
}

export const useProblems = create<ProblemsState>()(
  persist(
    (set, get) => ({
      customProblems: [],
      customAreas: [],
      problemEdits: {},
      areaEdits: {},
      
      // === ACCIONES PARA PROBLEMAS ===
      
      addProblem: (problem, createdBy) => {
        const newProblem: CustomProblem = {
          ...problem,
          isCustom: true,
          createdAt: new Date().toISOString(),
          createdBy,
        };
        
        set((state) => ({
          customProblems: [...state.customProblems, newProblem],
        }));
      },
      
      updateProblem: (problemId, changes, editedBy) => {
        const state = get();
        
        // Si es un problema personalizado, actualizarlo directamente
        const customIndex = state.customProblems.findIndex(p => p.id === problemId);
        if (customIndex !== -1) {
          set((state) => ({
            customProblems: state.customProblems.map((p, i) => 
              i === customIndex 
                ? { ...p, ...changes, updatedAt: new Date().toISOString(), updatedBy: editedBy }
                : p
            ),
          }));
          return;
        }
        
        // Si es un problema estático, guardar la edición
        set((state) => ({
          problemEdits: {
            ...state.problemEdits,
            [problemId]: {
              problemId,
              changes: { ...state.problemEdits[problemId]?.changes, ...changes },
              editedAt: new Date().toISOString(),
              editedBy,
            },
          },
        }));
      },
      
      deleteProblem: (problemId) => {
        set((state) => ({
          customProblems: state.customProblems.filter(p => p.id !== problemId),
          // También eliminar cualquier edición si existe
          problemEdits: Object.fromEntries(
            Object.entries(state.problemEdits).filter(([id]) => id !== problemId)
          ),
        }));
      },
      
      // === ACCIONES PARA ÁREAS ===
      
      addArea: (area, createdBy) => {
        const newArea: CustomArea = {
          ...area,
          isCustom: true,
          createdAt: new Date().toISOString(),
          createdBy,
          problemas: [],
          resumen: {
            numProblemas: 0,
            inversionMin: 0,
            inversionMax: 0,
            ahorroMin: 0,
            ahorroMax: 0,
          },
        };
        
        set((state) => ({
          customAreas: [...state.customAreas, newArea],
        }));
      },
      
      updateArea: (areaId, changes, editedBy) => {
        const state = get();
        
        // Si es un área personalizada, actualizarla directamente
        const customIndex = state.customAreas.findIndex(a => a.id === areaId);
        if (customIndex !== -1) {
          set((state) => ({
            customAreas: state.customAreas.map((a, i) =>
              i === customIndex
                ? { ...a, ...changes, updatedAt: new Date().toISOString(), updatedBy: editedBy }
                : a
            ),
          }));
          return;
        }
        
        // Si es un área estática, guardar la edición
        set((state) => ({
          areaEdits: {
            ...state.areaEdits,
            [areaId]: {
              areaId,
              changes: { ...state.areaEdits[areaId]?.changes, ...changes },
              editedAt: new Date().toISOString(),
              editedBy,
            },
          },
        }));
      },
      
      deleteArea: (areaId) => {
        set((state) => ({
          customAreas: state.customAreas.filter(a => a.id !== areaId),
          customProblems: state.customProblems.filter(p => p.areaId !== areaId),
          areaEdits: Object.fromEntries(
            Object.entries(state.areaEdits).filter(([id]) => id !== areaId)
          ),
        }));
      },
      
      // === GETTERS COMBINADOS ===
      
      getAllAreas: () => {
        const state = get();
        
        // Procesar áreas estáticas con ediciones
        const processedStaticAreas = STATIC_AREAS.map(area => {
          const editedArea = applyAreaEdits(area, state.areaEdits[area.id]);
          
          // Combinar problemas estáticos (con ediciones) y personalizados del área
          const staticProblems = editedArea.problemas.map(p => 
            applyProblemEdits(p, state.problemEdits[p.id])
          );
          const customProblemsForArea = state.customProblems.filter(p => p.areaId === area.id);
          const allProblems = [...staticProblems, ...customProblemsForArea];
          
          return {
            ...editedArea,
            problemas: allProblems,
            resumen: recalculateAreaResumen(allProblems),
          };
        });
        
        // Procesar áreas personalizadas
        const processedCustomAreas = state.customAreas.map(area => {
          const customProblemsForArea = state.customProblems.filter(p => p.areaId === area.id);
          return {
            ...area,
            problemas: customProblemsForArea,
            resumen: recalculateAreaResumen(customProblemsForArea),
          };
        });
        
        return [...processedStaticAreas, ...processedCustomAreas] as Area[];
      },
      
      getAreaById: (id) => {
        return get().getAllAreas().find(a => a.id === id);
      },
      
      getAllProblems: () => {
        return get().getAllAreas().flatMap(a => a.problemas);
      },
      
      getProblemById: (id) => {
        return get().getAllProblems().find(p => p.id === id);
      },
      
      // === UTILIDADES ===
      
      isCustomProblem: (problemId) => {
        return get().customProblems.some(p => p.id === problemId);
      },
      
      isCustomArea: (areaId) => {
        return get().customAreas.some(a => a.id === areaId);
      },
      
      isProblemEdited: (problemId) => {
        return problemId in get().problemEdits;
      },
      
      isAreaEdited: (areaId) => {
        return areaId in get().areaEdits;
      },
      
      getNextProblemId: (areaId) => {
        const state = get();
        const area = state.getAreaById(areaId);
        if (!area) return 'NEW-1';
        
        // Extraer el código del área
        const areaCode = area.codigo || areaId.toUpperCase();
        
        // Contar problemas existentes
        const existingCount = area.problemas.length;
        
        return `${areaCode}-${existingCount + 1}`;
      },
      
      getNextAreaId: () => {
        const state = get();
        const allAreas = state.getAllAreas();
        return `area-custom-${allAreas.length + 1}`;
      },
    }),
    {
      name: 'alucansa-problems-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customProblems: state.customProblems,
        customAreas: state.customAreas,
        problemEdits: state.problemEdits,
        areaEdits: state.areaEdits,
      }),
    }
  )
);

// Hooks de conveniencia
export function useAllAreas() {
  return useProblems((state) => state.getAllAreas());
}

export function useAllProblems() {
  return useProblems((state) => state.getAllProblems());
}

