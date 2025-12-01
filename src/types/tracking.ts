/**
 * TIPOS PARA SISTEMA DE SEGUIMIENTO DE PROBLEMAS
 * ===============================================
 * 
 * Define los tipos necesarios para el tracking interno de problemas:
 * - Estados del problema
 * - Seguimientos/notas
 * - Asignaciones y fechas
 */

/**
 * Estados posibles de un problema
 */
export type ProblemStatus = 
  | 'pendiente'      // Sin iniciar
  | 'en_analisis'    // En fase de análisis
  | 'en_progreso'    // Implementación en curso
  | 'bloqueado'      // Con impedimentos
  | 'completado'     // Finalizado con éxito
  | 'descartado';    // No se implementará

/**
 * Tipos de entrada en el seguimiento
 */
export type FollowUpType = 
  | 'nota'           // Nota general
  | 'actualizacion'  // Actualización de progreso
  | 'bloqueo'        // Registro de impedimento
  | 'resolucion'     // Resolución de bloqueo
  | 'decision'       // Decisión tomada
  | 'hito';          // Hito alcanzado

/**
 * Prioridad interna para ordenación
 */
export type InternalPriority = 'critica' | 'alta' | 'media' | 'baja';

/**
 * Una entrada de seguimiento/nota
 */
export interface FollowUp {
  id: string;
  problemId: string;
  type: FollowUpType;
  content: string;
  author: string;
  createdAt: string; // ISO date string
  attachments?: string[]; // URLs o nombres de archivos
}

/**
 * Coste personalizado por el cliente
 */
export interface CustomCost {
  minimo: number;
  maximo: number;
  notas?: string;  // Notas explicativas del cliente
}

/**
 * Datos de tracking de un problema
 */
export interface ProblemTracking {
  problemId: string;
  status: ProblemStatus;
  internalPriority: InternalPriority;
  assignee: string | null;
  startDate: string | null;      // ISO date string
  targetDate: string | null;     // ISO date string
  completedDate: string | null;  // ISO date string
  progress: number;              // 0-100
  followUps: FollowUp[];
  customCost: CustomCost | null; // Coste personalizado por el cliente
  lastUpdated: string;           // ISO date string
  createdAt: string;             // ISO date string
}

/**
 * Configuración de etiquetas y colores para estados
 */
export const STATUS_CONFIG: Record<ProblemStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: string;
}> = {
  pendiente: {
    label: 'Pendiente',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    icon: 'circle',
  },
  en_analisis: {
    label: 'En Análisis',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    icon: 'search',
  },
  en_progreso: {
    label: 'En Progreso',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    icon: 'loader',
  },
  bloqueado: {
    label: 'Bloqueado',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    icon: 'alert-triangle',
  },
  completado: {
    label: 'Completado',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    icon: 'check-circle',
  },
  descartado: {
    label: 'Descartado',
    color: 'text-slate-400',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: 'x-circle',
  },
};

/**
 * Configuración de tipos de seguimiento
 */
export const FOLLOWUP_TYPE_CONFIG: Record<FollowUpType, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  nota: {
    label: 'Nota',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    icon: 'file-text',
  },
  actualizacion: {
    label: 'Actualización',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'refresh-cw',
  },
  bloqueo: {
    label: 'Bloqueo',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'alert-octagon',
  },
  resolucion: {
    label: 'Resolución',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: 'check-square',
  },
  decision: {
    label: 'Decisión',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: 'git-branch',
  },
  hito: {
    label: 'Hito',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: 'flag',
  },
};

/**
 * Configuración de prioridades internas
 */
export const PRIORITY_CONFIG: Record<InternalPriority, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  critica: {
    label: 'Crítica',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  alta: {
    label: 'Alta',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  media: {
    label: 'Media',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  baja: {
    label: 'Baja',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
};

/**
 * Lista de responsables predefinidos (puedes editarla)
 */
export const ASSIGNEES = [
  'David',
  'Carlos',
  'María',
  'Ana',
  'Equipo TI',
  'Dirección',
  'Producción',
  'Administración',
  'Consultor externo',
];

