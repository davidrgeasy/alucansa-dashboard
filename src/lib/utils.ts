/**
 * Utilidades generales del proyecto
 */

import { Problem, KPIs, Prioridad, HorizonteTemporal } from '@/types';

/**
 * Formatea un número como moneda EUR
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea un rango de valores como moneda
 */
export function formatCurrencyRange(min: number, max: number): string {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Formatea un rango de porcentajes
 */
export function formatPercentageRange(min: number, max: number): string {
  return `${min}% - ${max}%`;
}

/**
 * Calcula los KPIs globales a partir de una lista de problemas
 */
export function calculateKPIs(problems: Problem[]): KPIs {
  return {
    totalProblemas: problems.length,
    inversionMinima: problems.reduce((sum, p) => sum + p.coste.minimo, 0),
    inversionMaxima: problems.reduce((sum, p) => sum + p.coste.maximo, 0),
    ahorroMinimo: problems.reduce((sum, p) => sum + (p.coste.minimo * p.roi.minimo / 100), 0),
    ahorroMaximo: problems.reduce((sum, p) => sum + (p.coste.maximo * p.roi.maximo / 100), 0),
    problemasAltoImpacto: problems.filter(p => p.impacto === 'alto').length,
    problemasMedioImpacto: problems.filter(p => p.impacto === 'medio').length,
    problemasBajoImpacto: problems.filter(p => p.impacto === 'bajo').length,
  };
}

/**
 * Obtiene el color para un nivel de impacto
 */
export function getImpactoColor(impacto: Prioridad): string {
  const colors: Record<Prioridad, string> = {
    alto: 'bg-accent-500 text-white',
    medio: 'bg-amber-500 text-white',
    bajo: 'bg-industrial-aluminum text-primary-900',
  };
  return colors[impacto];
}

/**
 * Obtiene el color de borde para un nivel de impacto
 */
export function getImpactoBorderColor(impacto: Prioridad): string {
  const colors: Record<Prioridad, string> = {
    alto: 'border-accent-500',
    medio: 'border-amber-500',
    bajo: 'border-industrial-aluminum',
  };
  return colors[impacto];
}

/**
 * Obtiene el color de fondo suave para un nivel de impacto
 */
export function getImpactoBgColor(impacto: Prioridad): string {
  const colors: Record<Prioridad, string> = {
    alto: 'bg-accent-50',
    medio: 'bg-amber-50',
    bajo: 'bg-slate-100',
  };
  return colors[impacto];
}

/**
 * Obtiene la etiqueta en español para un horizonte temporal
 */
export function getHorizonteLabel(horizonte: HorizonteTemporal): string {
  const labels: Record<HorizonteTemporal, string> = {
    corto: 'Corto plazo (0-6 meses)',
    medio: 'Medio plazo (6-18 meses)',
    largo: 'Largo plazo (+18 meses)',
  };
  return labels[horizonte];
}

/**
 * Obtiene la etiqueta corta para un horizonte temporal
 */
export function getHorizonteShortLabel(horizonte: HorizonteTemporal): string {
  const labels: Record<HorizonteTemporal, string> = {
    corto: 'Corto',
    medio: 'Medio',
    largo: 'Largo',
  };
  return labels[horizonte];
}

/**
 * Obtiene el color para un horizonte temporal
 */
export function getHorizonteColor(horizonte: HorizonteTemporal): string {
  const colors: Record<HorizonteTemporal, string> = {
    corto: 'bg-emerald-500 text-white',
    medio: 'bg-blue-500 text-white',
    largo: 'bg-purple-500 text-white',
  };
  return colors[horizonte];
}

/**
 * Obtiene la etiqueta en español para un nivel de impacto
 */
export function getImpactoLabel(impacto: Prioridad): string {
  const labels: Record<Prioridad, string> = {
    alto: 'Alto',
    medio: 'Medio',
    bajo: 'Bajo',
  };
  return labels[impacto];
}

/**
 * Clase CSS condicional helper
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

