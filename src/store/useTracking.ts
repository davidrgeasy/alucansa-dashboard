/**
 * STORE DE TRACKING - ZUSTAND CON PERSISTENCIA
 * =============================================
 * 
 * Gestiona el estado de seguimiento de problemas con persistencia en localStorage.
 * Los datos se guardan automáticamente y se recuperan al cargar la aplicación.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ProblemTracking, 
  ProblemStatus, 
  InternalPriority,
  FollowUp,
  FollowUpType,
  CustomCost
} from '@/types/tracking';
import { ROICalculation } from '@/components/calculator/ROICalculator';

interface TrackingStore {
  // Estado
  trackingData: Record<string, ProblemTracking>;
  roiCalculations: Record<string, ROICalculation[]>;
  
  // Getters
  getTracking: (problemId: string) => ProblemTracking;
  getAllTracking: () => ProblemTracking[];
  
  // Setters de estado
  setStatus: (problemId: string, status: ProblemStatus) => void;
  setPriority: (problemId: string, priority: InternalPriority) => void;
  setAssignee: (problemId: string, assignee: string | null) => void;
  setProgress: (problemId: string, progress: number) => void;
  setDates: (problemId: string, dates: { 
    startDate?: string | null; 
    targetDate?: string | null;
    completedDate?: string | null;
  }) => void;
  
  // Coste personalizado
  setCustomCost: (problemId: string, cost: CustomCost | null) => void;
  
  // Seguimientos
  addFollowUp: (problemId: string, followUp: Omit<FollowUp, 'id' | 'problemId' | 'createdAt'>) => void;
  updateFollowUp: (problemId: string, followUpId: string, content: string) => void;
  deleteFollowUp: (problemId: string, followUpId: string) => void;
  
  // Cálculos ROI
  getROICalculations: (problemId: string) => ROICalculation[];
  saveROICalculation: (problemId: string, calculation: ROICalculation) => void;
  deleteROICalculation: (problemId: string, calculationId: string) => void;
  
  // Utilidades
  initializeTracking: (problemId: string) => void;
  resetTracking: (problemId: string) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

/**
 * Crea un tracking inicial para un problema
 */
function createInitialTracking(problemId: string): ProblemTracking {
  const now = new Date().toISOString();
  return {
    problemId,
    status: 'pendiente',
    internalPriority: 'media',
    assignee: null,
    startDate: null,
    targetDate: null,
    completedDate: null,
    progress: 0,
    followUps: [],
    customCost: null,
    lastUpdated: now,
    createdAt: now,
  };
}

/**
 * Genera un ID único para seguimientos
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useTracking = create<TrackingStore>()(
  persist(
    (set, get) => ({
      trackingData: {},
      roiCalculations: {},
      
      // Obtener tracking de un problema (crea uno nuevo si no existe)
      getTracking: (problemId: string) => {
        const state = get();
        if (!state.trackingData[problemId]) {
          // Crear tracking inicial si no existe
          const initial = createInitialTracking(problemId);
          set((state) => ({
            trackingData: {
              ...state.trackingData,
              [problemId]: initial,
            },
          }));
          return initial;
        }
        return state.trackingData[problemId];
      },
      
      // Obtener todos los trackings
      getAllTracking: () => {
        return Object.values(get().trackingData);
      },
      
      // Cambiar estado
      setStatus: (problemId, status) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          const now = new Date().toISOString();
          
          // Si se marca como completado, guardar fecha
          const completedDate = status === 'completado' ? now : existing.completedDate;
          // Si se inicia, guardar fecha de inicio
          const startDate = (status === 'en_progreso' || status === 'en_analisis') && !existing.startDate 
            ? now 
            : existing.startDate;
          // Si se completa, poner progreso al 100%
          const progress = status === 'completado' ? 100 : existing.progress;
          
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                status,
                startDate,
                completedDate,
                progress,
                lastUpdated: now,
              },
            },
          };
        });
      },
      
      // Cambiar prioridad interna
      setPriority: (problemId, priority) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                internalPriority: priority,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Asignar responsable
      setAssignee: (problemId, assignee) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                assignee,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Actualizar progreso
      setProgress: (problemId, progress) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          const clampedProgress = Math.max(0, Math.min(100, progress));
          
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                progress: clampedProgress,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Actualizar fechas
      setDates: (problemId, dates) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                ...(dates.startDate !== undefined && { startDate: dates.startDate }),
                ...(dates.targetDate !== undefined && { targetDate: dates.targetDate }),
                ...(dates.completedDate !== undefined && { completedDate: dates.completedDate }),
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Actualizar coste personalizado
      setCustomCost: (problemId, cost) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                customCost: cost,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Añadir seguimiento
      addFollowUp: (problemId, followUpData) => {
        set((state) => {
          const existing = state.trackingData[problemId] || createInitialTracking(problemId);
          const now = new Date().toISOString();
          
          const newFollowUp: FollowUp = {
            id: generateId(),
            problemId,
            createdAt: now,
            ...followUpData,
          };
          
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                followUps: [newFollowUp, ...existing.followUps],
                lastUpdated: now,
              },
            },
          };
        });
      },
      
      // Actualizar seguimiento
      updateFollowUp: (problemId, followUpId, content) => {
        set((state) => {
          const existing = state.trackingData[problemId];
          if (!existing) return state;
          
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                followUps: existing.followUps.map((f) =>
                  f.id === followUpId ? { ...f, content } : f
                ),
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Eliminar seguimiento
      deleteFollowUp: (problemId, followUpId) => {
        set((state) => {
          const existing = state.trackingData[problemId];
          if (!existing) return state;
          
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: {
                ...existing,
                followUps: existing.followUps.filter((f) => f.id !== followUpId),
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      // Obtener cálculos ROI de un problema
      getROICalculations: (problemId) => {
        return get().roiCalculations[problemId] || [];
      },
      
      // Guardar cálculo ROI
      saveROICalculation: (problemId, calculation) => {
        set((state) => {
          const existing = state.roiCalculations[problemId] || [];
          return {
            roiCalculations: {
              ...state.roiCalculations,
              [problemId]: [calculation, ...existing],
            },
          };
        });
      },
      
      // Eliminar cálculo ROI
      deleteROICalculation: (problemId, calculationId) => {
        set((state) => {
          const existing = state.roiCalculations[problemId] || [];
          return {
            roiCalculations: {
              ...state.roiCalculations,
              [problemId]: existing.filter((c) => c.id !== calculationId),
            },
          };
        });
      },
      
      // Inicializar tracking para un problema
      initializeTracking: (problemId) => {
        set((state) => {
          if (state.trackingData[problemId]) return state;
          
          return {
            trackingData: {
              ...state.trackingData,
              [problemId]: createInitialTracking(problemId),
            },
          };
        });
      },
      
      // Resetear tracking de un problema
      resetTracking: (problemId) => {
        set((state) => ({
          trackingData: {
            ...state.trackingData,
            [problemId]: createInitialTracking(problemId),
          },
        }));
      },
      
      // Exportar datos como JSON
      exportData: () => {
        const state = get();
        return JSON.stringify(state.trackingData, null, 2);
      },
      
      // Importar datos desde JSON
      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({ trackingData: data });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'alucansa-tracking-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        trackingData: state.trackingData,
        roiCalculations: state.roiCalculations,
      }),
    }
  )
);

