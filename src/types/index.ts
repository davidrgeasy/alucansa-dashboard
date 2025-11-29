/**
 * TIPOS DE DATOS PARA EL DASHBOARD ALUCANSA
 * ==========================================
 * 
 * Este archivo define los tipos adicionales necesarios para el dashboard.
 * Los tipos base (Area, Problem, etc.) se importan desde el archivo de datos.
 */

// Tipos de impacto y urgencia
export type Prioridad = 'alto' | 'medio' | 'bajo';
export type HorizonteTemporal = 'corto' | 'medio' | 'largo';
export type Moneda = 'EUR';

// Alias para compatibilidad
export type Impacto = Prioridad;
export type Urgencia = HorizonteTemporal;

/**
 * Rango de valores (usado para costes y ROI)
 */
export interface Rango {
  minimo: number;
  maximo: number;
}

/**
 * Estructura de coste
 */
export interface Coste extends Rango {
  moneda: Moneda;
}

/**
 * ROI estimado
 */
export interface ROI extends Rango {}

/**
 * Resumen agregado de un área
 */
export interface ResumenArea {
  numProblemas: number;
  inversionMin: number;
  inversionMax: number;
  ahorroMin: number;
  ahorroMax: number;
}

// Alias
export type AreaResumen = ResumenArea;

/**
 * Representa un problema/oportunidad de mejora identificado
 */
export interface Problem {
  id: string;
  areaId: string;
  titulo: string;
  descripcion: string;
  impacto: Prioridad;
  urgencia: HorizonteTemporal;
  causas: string[];
  evidencias: string[];
  solucionPropuesta: string;
  pasosImplementacion: string[];
  coste: Coste;
  roi: ROI;
  dependencias?: string[];
  tags?: string[];
}

/**
 * Representa un área/departamento de la empresa
 */
export interface Area {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  prioridad: Prioridad;
  resumen: ResumenArea;
  problemas: Problem[];
}

/**
 * Estado global de filtros del dashboard
 */
export interface FiltrosState {
  areaId: string | null;
  impacto: Prioridad | null;
  horizonte: HorizonteTemporal | null;
  costeMin: number | null;
  costeMax: number | null;
  roiMin: number | null;
  roiMax: number | null;
}

/**
 * KPIs globales del dashboard
 */
export interface KPIs {
  totalProblemas: number;
  inversionMinima: number;
  inversionMaxima: number;
  ahorroMinimo: number;
  ahorroMaximo: number;
  problemasAltoImpacto: number;
  problemasMedioImpacto: number;
  problemasBajoImpacto: number;
}
